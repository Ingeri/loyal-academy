'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { ScholarshipType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

/**
 * Get donor's scholarships
 */
export async function getDonorScholarships() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  const scholarships = await prisma.scholarship.findMany({
    where: { donorId: session.userId },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return scholarships;
}

/**
 * Get scholarship by slug (donor's own scholarship)
 */
export async function getDonorScholarshipBySlug(slug: string) {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  const scholarship = await prisma.scholarship.findUnique({
    where: { 
      slug,
      donorId: session.userId 
    },
    include: {
      applications: {
        include: {
          applicant: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
      },
    },
  });

  return scholarship;
}

/**
 * Create scholarship
 */
export async function createDonorScholarship(data: {
  title: string;
  slug: string;
  description: string;
  amount: number;
  type: ScholarshipType;
  eligibilityCriteria: any;
  applicationDeadline: Date;
  maxAwards: number;
  donorName: string;
  donorLogoUrl?: string;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, role: true },
  });

  if (!user || user.role !== 'DONOR') {
    redirect('/auth/login?error=unauthorized');
  }

  const scholarship = await prisma.scholarship.create({
    data: {
      ...data,
      donorId: session.userId,
      donorName: data.donorName || user.name || 'Anonymous Donor',
    },
  });

  revalidatePath('/donor');
  revalidatePath('/donor/scholarships');

  return scholarship;
}

/**
 * Update scholarship
 */
export async function updateDonorScholarship(id: string, data: any) {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  // Verify ownership
  const existing = await prisma.scholarship.findUnique({
    where: { id },
    select: { donorId: true },
  });

  if (!existing || existing.donorId !== session.userId) {
    redirect('/auth/login?error=unauthorized');
  }

  const scholarship = await prisma.scholarship.update({
    where: { id },
    data,
  });

  revalidatePath('/donor');
  revalidatePath('/donor/scholarships');
  revalidatePath(`/donor/scholarships/${scholarship.slug}`);

  return scholarship;
}

/**
 * Delete scholarship
 */
export async function deleteDonorScholarship(id: string) {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  // Verify ownership
  const existing = await prisma.scholarship.findUnique({
    where: { id },
    select: { donorId: true, slug: true },
  });

  if (!existing || existing.donorId !== session.userId) {
    redirect('/auth/login?error=unauthorized');
  }

  await prisma.scholarship.delete({
    where: { id },
  });

  revalidatePath('/donor');
  revalidatePath('/donor/scholarships');

  return { success: true, message: 'Scholarship deleted successfully' };
}

/**
 * Toggle scholarship active status
 */
export async function toggleScholarshipActive(id: string, isActive: boolean) {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  // Verify ownership
  const existing = await prisma.scholarship.findUnique({
    where: { id },
    select: { donorId: true, slug: true },
  });

  if (!existing || existing.donorId !== session.userId) {
    redirect('/auth/login?error=unauthorized');
  }

  const scholarship = await prisma.scholarship.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath('/donor');
  revalidatePath('/donor/scholarships');
  revalidatePath(`/donor/scholarships/${scholarship.slug}`);

  return scholarship;
}
