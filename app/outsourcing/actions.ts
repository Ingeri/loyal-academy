'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/auth/session';

/**
 * Utility function to generate slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Public Actions
 */

/**
 * Fetch all open projects for public viewing
 */
export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { 
        status: 'OPEN' 
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { 
        createdAt: 'desc' 
      },
    });

    return { projects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { projects: [] };
  }
}

/**
 * Fetch single project details
 */
export async function getProjectById(id: string) {
  if (!id || typeof id !== 'string') {
    console.error("getProjectById error: No valid id provided");
    return null;
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTalent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

/**
 * Fetch single project by slug
 */
export async function getProjectBySlug(slug: string) {
  if (!slug || typeof slug !== 'string') {
    console.error("getProjectBySlug error: No valid slug provided");
    return null;
  }

  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTalent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return project;
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return null;
  }
}

/**
 * Fetch verified students/alumni with certificates and skills for talent directory
 */
export async function getTalentDirectory() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ['STUDENT', 'INSTRUCTOR'] },
        isActive: true,
      },
      include: {
        certificates: {
          include: {
            course: {
              select: {
                title: true,
                level: true,
              },
            },
          },
        },
        enrollments: {
          include: {
            course: {
              select: {
                title: true,
                level: true,
                careerFields: true,
              },
            },
          },
        },
      },
      orderBy: { 
        createdAt: 'desc' 
      },
    });

    return { users };
  } catch (error) {
    console.error("Error fetching talent directory:", error);
    return { users: [] };
  }
}

/**
 * Fetch all case studies (featured first)
 */
export async function getCaseStudies() {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: {
        OR: [
          { featured: true },
          { projectId: { not: null } },
        ],
      },
      include: {
        project: {
          select: {
            title: true,
            status: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return { caseStudies };
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return { caseStudies: [] };
  }
}

/**
 * Fetch approved partnerships for public display
 */
export async function getPartnerships() {
  try {
    const partnerships = await prisma.partnership.findMany({
      where: { 
        status: 'APPROVED' 
      },
      orderBy: { 
        createdAt: 'desc' 
      },
    });

    return { partnerships };
  } catch (error) {
    console.error("Error fetching partnerships:", error);
    return { partnerships: [] };
  }
}

/**
 * Authenticated Actions (CLIENT role)
 */

/**
 * Create new project posting
 */
export async function createProject(formData: {
  title: string;
  description: string;
  budget: number;
  timeline: string;
  skillsRequired: string[];
}) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (user.role !== 'CLIENT' && user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized. Only CLIENT or ADMIN can create projects' };
    }

    const slug = generateSlug(formData.title);

    const project = await prisma.project.create({
      data: {
        title: formData.title,
        slug,
        description: formData.description,
        budget: formData.budget,
        timeline: formData.timeline,
        skillsRequired: formData.skillsRequired,
        companyId: user.id,
      },
    });

    revalidatePath('/outsourcing');
    return { success: true, project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: 'Failed to create project' };
  }
}

/**
 * Update existing project
 */
export async function updateProject(id: string, formData: {
  title?: string;
  description?: string;
  budget?: number;
  timeline?: string;
  skillsRequired?: string[];
}) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return { success: false, error: 'Project not found' };
    }

    if (project.companyId !== user.id && user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: formData,
    });

    revalidatePath('/outsourcing');
    return { success: true, project: updatedProject };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: 'Failed to update project' };
  }
}

/**
 * Delete project (only if not assigned)
 */
export async function deleteProject(id: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return { success: false, error: 'Project not found' };
    }

    if (project.companyId !== user.id && user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    if (project.assignedTalentId) {
      return { success: false, error: 'Cannot delete project that has been assigned to talent' };
    }

    await prisma.project.delete({
      where: { id },
    });

    revalidatePath('/outsourcing');
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: 'Failed to delete project' };
  }
}

/**
 * Authenticated Actions (ADMIN role)
 */

/**
 * Assign a student to a project
 */
export async function assignProjectToTalent(projectId: string, talentId: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized. Only ADMIN can assign projects' };
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        assignedTalentId: talentId,
        status: 'IN_PROGRESS',
      },
      include: {
        company: {
          select: {
            name: true,
            email: true,
          },
        },
        assignedTalent: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath('/outsourcing');
    return { success: true, project };
  } catch (error) {
    console.error("Error assigning project to talent:", error);
    return { success: false, error: 'Failed to assign project' };
  }
}

/**
 * Update project status
 */
export async function updateProjectStatus(projectId: string, status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized. Only ADMIN can update project status' };
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { status },
    });

    revalidatePath('/outsourcing');
    return { success: true, project };
  } catch (error) {
    console.error("Error updating project status:", error);
    return { success: false, error: 'Failed to update project status' };
  }
}

/**
 * Create new case study
 */
export async function createCaseStudy(formData: {
  title: string;
  description: string;
  imageUrl?: string;
  clientName: string;
  projectOutcome: string;
  projectId?: string;
  featured?: boolean;
}) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized. Only ADMIN can create case studies' };
    }

    const caseStudy = await prisma.caseStudy.create({
      data: formData,
    });

    revalidatePath('/outsourcing');
    return { success: true, caseStudy };
  } catch (error) {
    console.error("Error creating case study:", error);
    return { success: false, error: 'Failed to create case study' };
  }
}

/**
 * Update case study
 */
export async function updateCaseStudy(id: string, formData: {
  title?: string;
  description?: string;
  imageUrl?: string;
  clientName?: string;
  projectOutcome?: string;
  projectId?: string;
  featured?: boolean;
}) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized. Only ADMIN can update case studies' };
    }

    const caseStudy = await prisma.caseStudy.update({
      where: { id },
      data: formData,
    });

    revalidatePath('/outsourcing');
    return { success: true, caseStudy };
  } catch (error) {
    console.error("Error updating case study:", error);
    return { success: false, error: 'Failed to update case study' };
  }
}

/**
 * Delete case study
 */
export async function deleteCaseStudy(id: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized. Only ADMIN can delete case studies' };
    }

    await prisma.caseStudy.delete({
      where: { id },
    });

    revalidatePath('/outsourcing');
    return { success: true };
  } catch (error) {
    console.error("Error deleting case study:", error);
    return { success: false, error: 'Failed to delete case study' };
  }
}

/**
 * Approve partnership request
 */
export async function approvePartnership(id: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized. Only ADMIN can approve partnerships' };
    }

    const partnership = await prisma.partnership.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    revalidatePath('/outsourcing');
    return { success: true, partnership };
  } catch (error) {
    console.error("Error approving partnership:", error);
    return { success: false, error: 'Failed to approve partnership' };
  }
}

/**
 * Reject partnership request
 */
export async function rejectPartnership(id: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized. Only ADMIN can reject partnerships' };
    }

    const partnership = await prisma.partnership.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    revalidatePath('/outsourcing');
    return { success: true, partnership };
  } catch (error) {
    console.error("Error rejecting partnership:", error);
    return { success: false, error: 'Failed to reject partnership' };
  }
}

/**
 * Public Actions (Partnership Portal)
 */

/**
 * Submit partnership inquiry (public)
 */
export async function submitPartnershipRequest(formData: {
  companyName: string;
  contactEmail: string;
  contactName: string;
  partnershipType: 'CONTENT_CREATION' | 'TRAINING' | 'BOTH';
  description: string;
  websiteUrl?: string;
}) {
  try {
    const partnership = await prisma.partnership.create({
      data: {
        ...formData,
        status: 'PENDING',
      },
    });

    revalidatePath('/outsourcing');
    return { success: true, partnership };
  } catch (error) {
    console.error("Error submitting partnership request:", error);
    return { success: false, error: 'Failed to submit partnership request' };
  }
}
