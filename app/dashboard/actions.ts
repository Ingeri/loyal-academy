'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// Zod Schemas
const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const NotificationPreferencesSchema = z.object({
  emailSummaries: z.boolean().optional(),
  lessonAlerts: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
});

// Profile Actions
export async function getProfileData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      bio: true,
      notificationPreferences: true,
      isActive: true,
      createdAt: true,
      enrollments: {
        include: {
          course: {
            include: {
              category: true,
            },
          },
        },
      },
      certificates: {
        include: {
          course: {
            select: {
              title: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      createdCourses: {
        select: {
          id: true,
          title: true,
          studentNumber: true,
          published: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  // Convert Decimal objects to plain numbers for client component serialization
  const serializedUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    enrollments: user.enrollments.map((e: any) => ({
      ...e,
      progress: Number(e.progress),
      course: {
        ...e.course,
        createdAt: e.course.createdAt.toISOString(),
        updatedAt: e.course.updatedAt.toISOString(),
        price: e.course.price ? Number(e.course.price) : null,
        discount: e.course.discount ? Number(e.course.discount) : null,
        avgRating: e.course.avgRating ? Number(e.course.avgRating) : null,
        estimatedSalary: e.course.estimatedSalary ? Number(e.course.estimatedSalary) : null,
        expectedIncome: e.course.expectedIncome ? Number(e.course.expectedIncome) : null,
        growthPercentage: e.course.growthPercentage ? Number(e.course.growthPercentage) : null,
      },
    })),
    certificates: user.certificates.map((c: any) => ({
      ...c,
      finalScore: Number(c.finalScore),
      issuedAt: c.issuedAt ? c.issuedAt.toISOString() : null,
      course: {
        ...c.course,
      },
    })),
    createdCourses: user.createdCourses.map((c: any) => ({
      ...c,
      studentNumber: Number(c.studentNumber),
      price: c.price ? Number(c.price) : null,
      discount: c.discount ? Number(c.discount) : null,
      avgRating: c.avgRating ? Number(c.avgRating) : null,
      estimatedSalary: c.estimatedSalary ? Number(c.estimatedSalary) : null,
      expectedIncome: c.expectedIncome ? Number(c.expectedIncome) : null,
      growthPercentage: c.growthPercentage ? Number(c.growthPercentage) : null,
    })),
  };

  return serializedUser;
}

export async function updateProfile(formData: z.infer<typeof UpdateProfileSchema>) {
  const session = await getSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const validatedData = UpdateProfileSchema.parse(formData);

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: validatedData.name,
        bio: validatedData.bio || null,
        avatarUrl: validatedData.avatarUrl || null,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        avatarUrl: true,
      },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Profile update error:', error);
    return { error: 'Failed to update profile' };
  }
}

export async function uploadAvatar(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { error: 'No file provided' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { error: 'File must be an image' };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: 'File size must be less than 5MB' };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${session.userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { mkdir, writeFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const uploadsDirectory = join(process.cwd(), 'public', 'uploads', 'avatars');
    await mkdir(uploadsDirectory, { recursive: true });
    await writeFile(join(uploadsDirectory, fileName), Buffer.from(await file.arrayBuffer()));
    const publicUrl = `/uploads/avatars/${fileName}`;

    // Update user avatarUrl
    await prisma.user.update({
      where: { id: session.userId },
      data: { avatarUrl: publicUrl },
    });

    return { success: true, avatarUrl: publicUrl };
  } catch (error) {
    console.error('Avatar upload error:', error);
    return { error: 'Failed to upload avatar' };
  }
}

// Settings Actions
export async function updatePassword(formData: z.infer<typeof UpdatePasswordSchema>) {
  const session = await getSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const validatedData = UpdatePasswordSchema.parse(formData);

    // Get current user with passwordHash
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      return { error: 'User not found or no password set' };
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      validatedData.currentPassword,
      user.passwordHash
    );

    if (!isValidPassword) {
      return { error: 'Current password is incorrect' };
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: session.userId },
      data: { passwordHash: newPasswordHash },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Password update error:', error);
    return { error: 'Failed to update password' };
  }
}

export async function updateNotificationPreferences(
  preferences: z.infer<typeof NotificationPreferencesSchema>
) {
  const session = await getSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const validatedData = NotificationPreferencesSchema.parse(preferences);

    // Get current preferences
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { notificationPreferences: true },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    // Merge with existing preferences
    const currentPreferences = (user.notificationPreferences as Record<string, any>) || {};
    const updatedPreferences = { ...currentPreferences, ...validatedData };

    // Update user
    await prisma.user.update({
      where: { id: session.userId },
      data: { notificationPreferences: updatedPreferences },
    });

    return { success: true, preferences: updatedPreferences };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Notification preferences update error:', error);
    return { error: 'Failed to update notification preferences' };
  }
}

export async function deactivateAccount() {
  const session = await getSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    // Deactivate account
    await prisma.user.update({
      where: { id: session.userId },
      data: { isActive: false },
    });

    // Delete session
    const cookieStore = await import('next/headers').then(m => m.cookies());
    cookieStore.delete('session');

    return { success: true };
  } catch (error) {
    console.error('Account deactivation error:', error);
    return { error: 'Failed to deactivate account' };
  }
}

export async function getNotificationPreferences() {
  const session = await getSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { notificationPreferences: true },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    const preferences = (user.notificationPreferences as Record<string, any>) || {
      emailSummaries: true,
      lessonAlerts: true,
      securityAlerts: true,
    };

    return { success: true, preferences };
  } catch (error) {
    console.error('Failed to fetch notification preferences:', error);
    return { error: 'Failed to fetch preferences' };
  }
}
