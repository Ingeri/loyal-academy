'use server';

import { prisma } from '@/lib/prisma';
import { checkAdminAccess, validateUUID } from '../admin';
import { ProjectStatus } from '@prisma/client';

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
