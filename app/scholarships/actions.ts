'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/auth/session';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { DocumentType, ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_ADDITIONAL_DOCUMENTS, MIN_MOTIVATION_LENGTH, DOCUMENT_TYPE_LABELS } from '@/lib/constants/scholarship';

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
 * Validation Schemas
 */

const documentSchema = z.object({
  type: z.string().refine((val) => Object.values(DocumentType).includes(val as DocumentType), {
    message: 'Invalid document type',
  }),
  name: z.string().min(1, 'Document name is required'),
  url: z.string().min(1, 'Document URL is required'),
});

const scholarshipApplicationSchema = z.object({
  scholarshipId: z.string().uuid('Invalid scholarship ID'),
  motivationLetter: z.string().min(MIN_MOTIVATION_LENGTH, `Motivation letter must be at least ${MIN_MOTIVATION_LENGTH} characters`),
  financialNeedProof: z.string().nullable().optional(),
  additionalDocuments: z.array(documentSchema).max(MAX_ADDITIONAL_DOCUMENTS, `Maximum ${MAX_ADDITIONAL_DOCUMENTS} additional documents allowed`).optional(),
});

/**
 * File Upload Action
 */
export async function uploadDocument(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const file = formData.get('file') as File | null;

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
    }

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
      return { success: false, error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` };
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Write file
    fs.writeFileSync(filePath, buffer);

    // Return URL
    const url = `/uploads/${fileName}`;

    return { success: true, url, fileName: file.name };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Upload failed' };
  }
}

/**
 * Public Actions
 */

/**
 * Fetch all active scholarships
 */
export async function getScholarships() {
  try {
    const scholarships = await prisma.scholarship.findMany({
      where: { 
        isActive: true,
        applicationDeadline: {
          gte: new Date(),
        },
      },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { 
        applicationDeadline: 'asc' 
      },
    });

    return { scholarships };
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    return { scholarships: [] };
  }
}

/**
 * Fetch single scholarship details
 */
export async function getScholarshipById(id: string) {
  if (!id || typeof id !== 'string') {
    console.error("getScholarshipById error: No valid id provided");
    return null;
  }

  try {
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return scholarship;
  } catch (error) {
    console.error("Error fetching scholarship:", error);
    return null;
  }
}

/**
 * Fetch single scholarship by slug
 */
export async function getScholarshipBySlug(slug: string) {
  if (!slug || typeof slug !== 'string') {
    console.error("getScholarshipBySlug error: No valid slug provided");
    return null;
  }

  try {
    const scholarship = await prisma.scholarship.findUnique({
      where: { slug },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return scholarship;
  } catch (error) {
    console.error("Error fetching scholarship by slug:", error);
    return null;
  }
}

/**
 * Check if user meets eligibility criteria for a scholarship
 */
export async function checkEligibility(scholarshipId: string, userId: string) {
  try {
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId },
    });

    if (!scholarship) {
      return { eligible: false, reasons: ['Scholarship not found'] };
    }

    const criteria = scholarship.eligibilityCriteria as any;
    const reasons: string[] = [];
    let eligible = true;

    // Get user's course progress and certificates
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
        certificates: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!user) {
      return { eligible: false, reasons: ['User not found'] };
    }

    // Check GPA requirement if specified
    if (criteria.minGPA) {
      // Calculate average score from certificates
      const certificates = user.certificates;
      if (certificates.length > 0) {
        const avgScore = certificates.reduce((sum, cert) => sum + cert.finalScore, 0) / certificates.length;
        if (avgScore < criteria.minGPA) {
          eligible = false;
          reasons.push(`GPA requirement not met (required: ${criteria.minGPA}, your average: ${avgScore.toFixed(2)})`);
        }
      } else {
        eligible = false;
        reasons.push('No certificates found to verify GPA');
      }
    }

    // Check location requirement if specified
    if (criteria.allowedLocations && criteria.allowedLocations.length > 0) {
      // This would need to be implemented based on user profile location
      // For now, we'll skip this check
    }

    // Check course progress requirement if specified
    if (criteria.requiredCourseProgress) {
      const completedCourses = user.enrollments.filter(e => e.progress >= 100).length;
      if (completedCourses < criteria.requiredCourseProgress) {
        eligible = false;
        reasons.push(`Course progress requirement not met (required: ${criteria.requiredCourseProgress} completed courses, you have: ${completedCourses})`);
      }
    }

    // Check if user has already applied
    const existingApplication = await prisma.scholarshipApplication.findUnique({
      where: {
        applicantId_scholarshipId: {
          applicantId: userId,
          scholarshipId: scholarshipId,
        },
      },
    });

    if (existingApplication) {
      eligible = false;
      reasons.push('You have already applied for this scholarship');
    }

    // Check if scholarship has reached max awards
    if (scholarship.awardsGranted >= scholarship.maxAwards) {
      eligible = false;
      reasons.push('This scholarship has reached its maximum number of awards');
    }

    return { eligible, reasons };
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return { eligible: false, reasons: ['Error checking eligibility'] };
  }
}

/**
 * Fetch all donors for recognition section
 */
export async function getDonors() {
  try {
    const donors = await prisma.user.findMany({
      where: {
        role: 'DONOR',
        isActive: true,
      },
      include: {
        scholarships: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            amount: true,
            awardsGranted: true,
          },
        },
      },
      orderBy: { 
        createdAt: 'desc' 
      },
    });

    return { donors };
  } catch (error) {
    console.error("Error fetching donors:", error);
    return { donors: [] };
  }
}

/**
 * Authenticated Actions (STUDENT role)
 */

/**
 * Submit scholarship application
 */
export async function submitScholarshipApplication(formData: {
  scholarshipId: string;
  motivationLetter: string;
  financialNeedProof?: string;
  additionalDocuments?: Array<{ type: DocumentType; name: string; url: string }>;
}) {
  try {
    console.log('Received formData:', JSON.stringify(formData, null, 2));
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (user.role !== 'STUDENT') {
      return { success: false, error: 'Unauthorized. Only students can apply for scholarships' };
    }

    // Fetch scholarship to check type for conditional validation
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: formData.scholarshipId },
    });

    if (!scholarship) {
      return { success: false, error: 'Scholarship not found' };
    }

    // Validate input data
    const validationResult = scholarshipApplicationSchema.safeParse(formData);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, error: 'Validation failed', errors };
    }

    // Conditional validation for NEED_BASED scholarships
    if (scholarship.type === 'NEED_BASED' && !formData.financialNeedProof) {
      return {
        success: false,
        error: 'Validation failed',
        errors: [{ path: 'financialNeedProof', message: 'Financial need proof is required for need-based scholarships' }]
      };
    }

    // Check if user has already applied
    const existingApplication = await prisma.scholarshipApplication.findUnique({
      where: {
        applicantId_scholarshipId: {
          applicantId: user.id,
          scholarshipId: formData.scholarshipId,
        },
      },
    });

    if (existingApplication) {
      return { success: false, error: 'You have already applied for this scholarship' };
    }

    // Check eligibility
    const eligibility = await checkEligibility(formData.scholarshipId, user.id);
    if (!eligibility.eligible) {
      return { success: false, error: 'Not eligible for this scholarship', reasons: eligibility.reasons };
    }

    const application = await prisma.scholarshipApplication.create({
      data: {
        scholarshipId: formData.scholarshipId,
        applicantId: user.id,
        motivationLetter: formData.motivationLetter,
        financialNeedProof: formData.financialNeedProof || null,
        additionalDocuments: formData.additionalDocuments as any || [],
      },
    });

    revalidatePath('/scholarships');
    return { success: true, application };
  } catch (error) {
    console.error("Error submitting scholarship application:", error);
    return { success: false, error: 'Failed to submit application' };
  }
}

/**
 * Fetch user's scholarship applications
 */
export async function getUserApplications(userId: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { applications: [] };
    }

    if (user.id !== userId && user.role !== 'ADMIN') {
      return { applications: [] };
    }

    const applications = await prisma.scholarshipApplication.findMany({
      where: { applicantId: userId },
      include: {
        scholarship: {
          include: {
            donor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc'
      },
    });

    return { applications };
  } catch (error) {
    console.error("Error fetching user applications:", error);
    return { applications: [] };
  }
}

/**
 * Get scholarship dashboard data for student
 */
export async function getScholarshipDashboardData() {
  try {
    const user = await getUser();

    if (!user) {
      return { eligibleScholarships: [], myApplications: [], stats: null };
    }

    if (user.role !== 'STUDENT') {
      return { eligibleScholarships: [], myApplications: [], stats: null };
    }

    // Fetch user's applications
    const applications = await prisma.scholarshipApplication.findMany({
      where: { applicantId: user.id },
      include: {
        scholarship: {
          include: {
            donor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc'
      },
    });

    // Get scholarship IDs user has already applied to
    const appliedScholarshipIds = applications.map(app => app.scholarshipId);

    // Fetch active scholarships
    const activeScholarships = await prisma.scholarship.findMany({
      where: {
        isActive: true,
        applicationDeadline: {
          gte: new Date(),
        },
        id: {
          notIn: appliedScholarshipIds,
        },
      },
      include: {
        donor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        applicationDeadline: 'asc',
      },
    });

    // Check eligibility for each scholarship
    const eligibleScholarships = [];
    for (const scholarship of activeScholarships) {
      const eligibility = await checkEligibility(scholarship.id, user.id);
      if (eligibility.eligible) {
        eligibleScholarships.push(scholarship);
      }
    }

    // Calculate stats
    const stats = {
      totalApplied: applications.length,
      pending: applications.filter(app => app.status === 'PENDING').length,
      underReview: applications.filter(app => app.status === 'UNDER_REVIEW').length,
      approved: applications.filter(app => app.status === 'APPROVED').length,
      rejected: applications.filter(app => app.status === 'REJECTED').length,
    };

    return {
      eligibleScholarships,
      myApplications: applications,
      stats,
    };
  } catch (error) {
    console.error("Error fetching scholarship dashboard data:", error);
    return { eligibleScholarships: [], myApplications: [], stats: null };
  }
}

/**
 * Check application status
 */
export async function getApplicationStatus(applicationId: string) {
  try {
    const user = await getUser();

    if (!user) {
      return null;
    }

    const application = await prisma.scholarshipApplication.findUnique({
      where: { id: applicationId },
      include: {
        scholarship: true,
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!application) {
      return null;
    }

    // Only allow applicant or admin to view
    if (application.applicantId !== user.id && user.role !== 'ADMIN') {
      return null;
    }

    return application;
  } catch (error) {
    console.error("Error fetching application status:", error);
    return null;
  }
}

/**
 * Authenticated Actions (ADMIN/DONOR role)
 */

/**
 * Create new scholarship
 */
export async function createScholarship(formData: {
  title: string;
  description: string;
  amount: number;
  type: 'MERIT_BASED' | 'NEED_BASED' | 'WOMEN_IN_TECH' | 'GENERAL';
  eligibilityCriteria: any;
  applicationDeadline: Date;
  maxAwards: number;
  donorName: string;
  donorLogoUrl?: string;
}) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (user.role !== 'ADMIN' && user.role !== 'DONOR') {
      return { success: false, error: 'Unauthorized. Only ADMIN or DONOR can create scholarships' };
    }

    const slug = generateSlug(formData.title);

    const scholarship = await prisma.scholarship.create({
      data: {
        ...formData,
        slug,
        donorId: user.role === 'DONOR' ? user.id : null,
      },
    });

    revalidatePath('/scholarships');
    return { success: true, scholarship };
  } catch (error) {
    console.error("Error creating scholarship:", error);
    return { success: false, error: 'Failed to create scholarship' };
  }
}

/**
 * Update scholarship details
 */
export async function updateScholarship(id: string, formData: {
  title?: string;
  description?: string;
  amount?: number;
  type?: 'MERIT_BASED' | 'NEED_BASED' | 'WOMEN_IN_TECH' | 'GENERAL';
  eligibilityCriteria?: any;
  applicationDeadline?: Date;
  maxAwards?: number;
  isActive?: boolean;
  donorName?: string;
  donorLogoUrl?: string;
}) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
    });

    if (!scholarship) {
      return { success: false, error: 'Scholarship not found' };
    }

    if (scholarship.donorId !== user.id && user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const updatedScholarship = await prisma.scholarship.update({
      where: { id },
      data: formData,
    });

    revalidatePath('/scholarships');
    return { success: true, scholarship: updatedScholarship };
  } catch (error) {
    console.error("Error updating scholarship:", error);
    return { success: false, error: 'Failed to update scholarship' };
  }
}

/**
 * Delete scholarship (only if no applications)
 */
export async function deleteScholarship(id: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      include: {
        applications: true,
      },
    });

    if (!scholarship) {
      return { success: false, error: 'Scholarship not found' };
    }

    if (scholarship.donorId !== user.id && user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    if (scholarship.applications.length > 0) {
      return { success: false, error: 'Cannot delete scholarship with existing applications' };
    }

    await prisma.scholarship.delete({
      where: { id },
    });

    revalidatePath('/scholarships');
    return { success: true };
  } catch (error) {
    console.error("Error deleting scholarship:", error);
    return { success: false, error: 'Failed to delete scholarship' };
  }
}

/**
 * Approve/reject application
 */
export async function reviewApplication(applicationId: string, status: 'APPROVED' | 'REJECTED', notes?: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized. Only ADMIN can review applications' };
    }

    const application = await prisma.scholarshipApplication.findUnique({
      where: { id: applicationId },
      include: {
        scholarship: true,
      },
    });

    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    if (application.status !== 'PENDING' && application.status !== 'UNDER_REVIEW') {
      return { success: false, error: 'Application has already been reviewed' };
    }

    const updatedApplication = await prisma.scholarshipApplication.update({
      where: { id: applicationId },
      data: {
        status,
        reviewNotes: notes,
        reviewedAt: new Date(),
        reviewedBy: user.id,
      },
    });

    // If approved, increment awards granted
    if (status === 'APPROVED') {
      await prisma.scholarship.update({
        where: { id: application.scholarshipId },
        data: {
          awardsGranted: {
            increment: 1,
          },
        },
      });
    }

    revalidatePath('/scholarships');
    return { success: true, application: updatedApplication };
  } catch (error) {
    console.error("Error reviewing application:", error);
    return { success: false, error: 'Failed to review application' };
  }
}

/**
 * Fetch all applications for a scholarship
 */
export async function getApplicationsForScholarship(scholarshipId: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { applications: [] };
    }

    if (user.role !== 'ADMIN') {
      return { applications: [] };
    }

    const applications = await prisma.scholarshipApplication.findMany({
      where: { scholarshipId },
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        scholarship: true,
      },
      orderBy: { 
        submittedAt: 'desc' 
      },
    });

    return { applications };
  } catch (error) {
    console.error("Error fetching applications for scholarship:", error);
    return { applications: [] };
  }
}
