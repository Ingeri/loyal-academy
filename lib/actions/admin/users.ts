'use server';

import { prisma } from '@/lib/prisma';
import { checkAdminAccess, validateUUID } from '../admin';
import { UserRole } from '@prisma/client';

/**
 * Get users with search and filters
 * @param search - Search by email or name
 * @param role - Filter by user role
 * @param isActive - Filter by active status
 */
export async function getUsers(search?: string, role?: UserRole, isActive?: boolean) {
  await checkAdminAccess();

  const where: any = {};

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (role) {
    where.role = role;
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          enrollments: true,
          certificates: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
}

/**
 * Get user details by ID
 */
export async function getUserDetails(userId: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(userId);

  const user = await prisma.user.findUnique({
    where: { id: validatedId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      enrollments: {
        select: {
          id: true,
          course: {
            select: {
              title: true,
              slug: true,
            },
          },
          createdAt: true,
          progress: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      certificates: {
        select: {
          id: true,
          certificateNumber: true,
          issueDate: true,
          grade: true,
          finalScore: true,
          course: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { issueDate: 'desc' },
      },
    },
  });

  return user;
}

/**
 * Update user role
 * @param userId - User ID
 * @param newRole - New role to assign
 */
export async function updateUserRole(userId: string, newRole: UserRole) {
  await checkAdminAccess();
  const validatedId = await validateUUID(userId);

  const user = await prisma.user.update({
    where: { id: validatedId },
    data: { role: newRole },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return user;
}

/**
 * Toggle user active status
 * @param userId - User ID
 * @param isActive - New active status
 */
export async function toggleUserActive(userId: string, isActive: boolean) {
  await checkAdminAccess();
  const validatedId = await validateUUID(userId);

  const user = await prisma.user.update({
    where: { id: validatedId },
    data: { isActive },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
    },
  });

  return user;
}
