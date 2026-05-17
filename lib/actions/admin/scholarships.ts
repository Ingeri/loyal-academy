'use server';

import { prisma } from '@/lib/prisma';
import { checkAdminAccess, validateUUID } from '../admin';
import { ScholarshipType, ApplicationStatus } from '@prisma/client';

/**
 * Get all scholarships
 */
export async function getScholarships() {
  await checkAdminAccess();

  const scholarships = await prisma.scholarship.findMany({
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
 * Create scholarship
 */
export async function createScholarship(data: {
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
  donorId?: string;
}) {
  await checkAdminAccess();

  const scholarship = await prisma.scholarship.create({
    data,
  });

  return scholarship;
}

/**
 * Update scholarship
 */
export async function updateScholarship(id: string, data: any) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  const scholarship = await prisma.scholarship.update({
    where: { id: validatedId },
    data,
  });

  return scholarship;
}

/**
 * Delete scholarship
 */
export async function deleteScholarship(id: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  await prisma.scholarship.delete({
    where: { id: validatedId },
  });

  return { success: true, message: 'Scholarship deleted successfully' };
}

/**
 * Get scholarship details with applications
 */
export async function getScholarshipDetails(id: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  const scholarship = await prisma.scholarship.findUnique({
    where: { id: validatedId },
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
          reviewer: {
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
 * Get scholarship applications
 */
export async function getScholarshipApplications(scholarshipId: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(scholarshipId);

  const applications = await prisma.scholarshipApplication.findMany({
    where: { scholarshipId: validatedId },
    include: {
      applicant: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });

  return applications;
}

/**
 * Review scholarship application
 */
export async function reviewApplication(
  applicationId: string,
  status: ApplicationStatus,
  reviewNotes?: string,
  reviewerId?: string
) {
  await checkAdminAccess();
  const validatedId = await validateUUID(applicationId);

  const application = await prisma.scholarshipApplication.update({
    where: { id: validatedId },
    data: {
      status,
      reviewNotes,
      reviewedAt: new Date(),
      reviewedBy: reviewerId,
    },
    include: {
      applicant: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  return application;
}
