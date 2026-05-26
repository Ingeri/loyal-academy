'use server';

import { prisma } from '@/lib/prisma';
import { checkAdminAccess, validateUUID } from '../admin';
import { ProjectStatus, ApplicationStatus } from '@prisma/client';

/**
 * Get all projects
 */
export async function getProjects(status?: ProjectStatus) {
  await checkAdminAccess();

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return projects;
}

/**
 * Create project
 */
export async function createProject(data: {
  title: string;
  slug: string;
  description: string;
  budget: number;
  timeline: string;
  skillsRequired: string[];
  companyId: string;
}) {
  await checkAdminAccess();

  const project = await prisma.project.create({
    data,
  });

  return project;
}

/**
 * Update project
 */
export async function updateProject(id: string, data: any) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  const project = await prisma.project.update({
    where: { id: validatedId },
    data,
  });

  return project;
}

/**
 * Delete project
 */
export async function deleteProject(id: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  await prisma.project.delete({
    where: { id: validatedId },
  });

  return { success: true, message: 'Project deleted successfully' };
}

/**
 * Update project status
 */
export async function updateProjectStatus(id: string, status: ProjectStatus) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  const project = await prisma.project.update({
    where: { id: validatedId },
    data: { status },
  });

  return project;
}

/**
 * Assign talent to project
 */
export async function assignProject(projectId: string, talentId: string) {
  await checkAdminAccess();
  const validatedProjectId = await validateUUID(projectId);
  const validatedTalentId = await validateUUID(talentId);

  const project = await prisma.project.update({
    where: { id: validatedProjectId },
    data: {
      assignedTalentId: validatedTalentId,
      status: ProjectStatus.IN_PROGRESS,
    },
  });

  return project;
}

/**
 * Get project details
 */
export async function getProjectDetails(id: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  const project = await prisma.project.findUnique({
    where: { id: validatedId },
  });

  return project;
}

/**
 * Get project applications
 */
export async function getProjectApplications(projectId: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(projectId);

  const applications = await prisma.projectApplication.findMany({
    where: { projectId: validatedId },
    orderBy: { createdAt: 'desc' },
  });

  // Manually fetch applicants since there's no relation in schema
  const applicantIds = applications.map((app) => app.applicantId);
  const applicants = await prisma.user.findMany({
    where: { id: { in: applicantIds } },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  // Map applicants to applications
  const applicantMap = new Map(applicants.map((a) => [a.id, a]));
  const applicationsWithApplicants = applications.map((app) => ({
    ...app,
    applicant: applicantMap.get(app.applicantId),
  }));

  return applicationsWithApplicants;
}

/**
 * Review project application
 */
export async function reviewProjectApplication(
  applicationId: string,
  status: ApplicationStatus,
  reviewNotes?: string,
  reviewerId?: string
) {
  await checkAdminAccess();
  const validatedId = await validateUUID(applicationId);

  const application = await prisma.projectApplication.findUnique({
    where: { id: validatedId },
    include: {
      project: true,
    },
  });

  if (!application) {
    throw new Error('Application not found');
  }

  // Update application
  const updatedApplication = await prisma.projectApplication.update({
    where: { id: validatedId },
    data: {
      status,
      reviewNotes,
      updatedAt: new Date(),
    },
  });

  // Manually fetch applicant
  const applicant = await prisma.user.findUnique({
    where: { id: application.applicantId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  // If approved, assign applicant to project and update project status
  if (status === ApplicationStatus.APPROVED) {
    await prisma.project.update({
      where: { id: application.projectId },
      data: {
        assignedTalentId: application.applicantId,
        status: ProjectStatus.IN_PROGRESS,
      },
    });
  }

  return {
    ...updatedApplication,
    applicant,
  };
}
