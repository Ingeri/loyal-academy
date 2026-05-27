'use server';

import { prisma } from '@/lib/prisma';
import { checkAdminAccess } from '@/lib/actions/admin';
import { z } from 'zod';

/**
 * Zod schema for filter parameters
 * Handles null, empty, and malformed inputs safely
 */
const filterSchema = z.object({
  searchQuery: z.string().nullable().optional(),
  statusFilter: z.string().nullable().optional(),
  levelFilter: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  sortBy: z.string().nullable().optional(),
  sortOrder: z.enum(['asc', 'desc']).nullable().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(50),
});

/**
 * Enrollment & Revenue Dataset
 * Fetches Course entities with title, level, student count, price,
 * and programmatically calculates total estimated revenue
 * Supports filtering, sorting, and pagination
 */
export async function getEnrollmentRevenueReport(filters?: {
  searchQuery?: string | null;
  levelFilter?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  page?: number;
  pageSize?: number;
}) {
  await checkAdminAccess();

  try {
    // Validate filters
    const validatedFilters = filterSchema.parse(filters || {});
    const { searchQuery, levelFilter, startDate, endDate, sortBy, sortOrder, page, pageSize } = validatedFilters;

    // Build where clause
    const where: any = {};
    if (levelFilter && levelFilter !== 'all') {
      where.level = levelFilter;
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { instructor: { name: { contains: searchQuery, mode: 'insensitive' } } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    const sortField = sortBy || 'studentNumber';
    const sortDir = sortOrder || 'desc';

    if (sortField === 'title') orderBy.title = sortDir;
    else if (sortField === 'level') orderBy.level = sortDir;
    else if (sortField === 'price') orderBy.price = sortDir;
    else if (sortField === 'estimatedRevenue') orderBy.studentNumber = sortDir; // Proxy for revenue
    else orderBy.studentNumber = sortDir;

    // Pagination
    const take = pageSize || 50;
    const skip = (page - 1) * take;

    const courses = await prisma.course.findMany({
      where,
      select: {
        title: true,
        level: true,
        studentNumber: true,
        price: true,
        createdAt: true,
        instructor: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy,
      take,
      skip,
    });

    // Get total count for pagination
    const totalCount = await prisma.course.count({ where });

    // Calculate estimated revenue for each course
    const reportData = courses.map((course) => ({
      title: course.title,
      level: course.level,
      activeStudents: course.studentNumber,
      totalEnrollments: course._count.enrollments,
      price: Number(course.price),
      estimatedRevenue: Number(course.price) * course.studentNumber,
      instructorName: course.instructor.name || 'Unknown',
      createdAt: course.createdAt.toISOString().split('T')[0],
    }));

    return {
      data: reportData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        pageSize: take,
      },
    };
  } catch (error) {
    console.error('Error fetching enrollment revenue report:', error);
    throw new Error('Failed to fetch enrollment revenue report');
  }
}

/**
 * Outsourcing Activity Log
 * Queries Project model fetching title, budget, status,
 * and includes linked Client Company or assigned Talent student's name
 * Supports filtering, sorting, and pagination
 */
export async function getOutsourcingActivityReport(filters?: {
  searchQuery?: string | null;
  statusFilter?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  page?: number;
  pageSize?: number;
}) {
  await checkAdminAccess();

  try {
    // Validate filters
    const validatedFilters = filterSchema.parse(filters || {});
    const { searchQuery, statusFilter, startDate, endDate, sortBy, sortOrder, page, pageSize } = validatedFilters;

    // Build where clause
    const where: any = {};
    if (statusFilter && statusFilter !== 'all') {
      where.status = statusFilter;
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    const sortField = sortBy || 'createdAt';
    const sortDir = sortOrder || 'desc';

    if (sortField === 'title') orderBy.title = sortDir;
    else if (sortField === 'budget') orderBy.budget = sortDir;
    else if (sortField === 'status') orderBy.status = sortDir;
    else orderBy.createdAt = sortDir;

    // Pagination
    const take = pageSize || 50;
    const skip = (page - 1) * take;

    const projects = await prisma.project.findMany({
      where,
      select: {
        title: true,
        budget: true,
        status: true,
        companyId: true,
        assignedTalentId: true,
        createdAt: true,
      },
      orderBy,
      take,
      skip,
    });

    // Get total count for pagination
    const totalCount = await prisma.project.count({ where });

    // Fetch user names for assigned talents in batch
    const talentIds = projects
      .map((p) => p.assignedTalentId)
      .filter((id): id is string => id !== null);

    const talents = await prisma.user.findMany({
      where: {
        id: {
          in: talentIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const talentMap = new Map(talents.map((t) => [t.id, t.name]));

    // Map project data with talent names
    const reportData = projects.map((project) => ({
      title: project.title,
      budget: Number(project.budget),
      status: project.status,
      companyId: project.companyId,
      assignedTalentName: project.assignedTalentId
        ? talentMap.get(project.assignedTalentId) || 'Unknown'
        : 'Unassigned',
      createdAt: project.createdAt.toISOString().split('T')[0],
    }));

    return {
      data: reportData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        pageSize: take,
      },
    };
  } catch (error) {
    console.error('Error fetching outsourcing activity report:', error);
    throw new Error('Failed to fetch outsourcing activity report');
  }
}

/**
 * Scholarship Disbursement Audit
 * Fetches Scholarship and ScholarshipApplication data grids
 * mapping scholarship fields alongside student identifiers
 * Supports filtering, sorting, and pagination
 */
export async function getScholarshipDisbursementReport(filters?: {
  searchQuery?: string | null;
  statusFilter?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  page?: number;
  pageSize?: number;
}) {
  await checkAdminAccess();

  try {
    // Validate filters
    const validatedFilters = filterSchema.parse(filters || {});
    const { searchQuery, statusFilter, startDate, endDate, sortBy, sortOrder, page, pageSize } = validatedFilters;

    // Build where clause
    const where: any = {};
    if (statusFilter && statusFilter !== 'all') {
      where.status = statusFilter;
    }
    if (startDate || endDate) {
      where.submittedAt = {};
      if (startDate) where.submittedAt.gte = new Date(startDate);
      if (endDate) where.submittedAt.lte = new Date(endDate);
    }
    if (searchQuery) {
      where.OR = [
        { scholarship: { title: { contains: searchQuery, mode: 'insensitive' } } },
        { scholarship: { donorName: { contains: searchQuery, mode: 'insensitive' } } },
        { applicant: { name: { contains: searchQuery, mode: 'insensitive' } } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    const sortField = sortBy || 'submittedAt';
    const sortDir = sortOrder || 'desc';

    if (sortField === 'title') orderBy.scholarship = { title: sortDir };
    else if (sortField === 'amount') orderBy.scholarship = { amount: sortDir };
    else if (sortField === 'donorName') orderBy.scholarship = { donorName: sortDir };
    else orderBy.submittedAt = sortDir;

    // Pagination
    const take = pageSize || 50;
    const skip = (page - 1) * take;

    const applications = await prisma.scholarshipApplication.findMany({
      where,
      select: {
        id: true,
        submittedAt: true,
        status: true,
        applicantId: true,
        scholarship: {
          select: {
            title: true,
            amount: true,
            donorName: true,
          },
        },
        applicant: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy,
      take,
      skip,
    });

    // Get total count for pagination
    const totalCount = await prisma.scholarshipApplication.count({ where });

    const reportData = applications.map((app) => ({
      scholarshipTitle: app.scholarship.title,
      amount: Number(app.scholarship.amount),
      donorName: app.scholarship.donorName,
      studentName: app.applicant.name || 'Unknown',
      studentEmail: app.applicant.email,
      status: app.status,
      applicationDate: app.submittedAt.toISOString().split('T')[0],
    }));

    return {
      data: reportData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        pageSize: take,
      },
    };
  } catch (error) {
    console.error('Error fetching scholarship disbursement report:', error);
    throw new Error('Failed to fetch scholarship disbursement report');
  }
}

/**
 * Alumni Credentials Log
 * Fetches issued Certificate records mapping certificateNumber,
 * student recipient names, matching Course title, and issueDate
 * Supports filtering, sorting, and pagination
 */
export async function getAlumniCredentialsReport(filters?: {
  searchQuery?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  page?: number;
  pageSize?: number;
}) {
  await checkAdminAccess();

  try {
    // Validate filters
    const validatedFilters = filterSchema.parse(filters || {});
    const { searchQuery, startDate, endDate, sortBy, sortOrder, page, pageSize } = validatedFilters;

    // Build where clause
    const where: any = {};
    if (startDate || endDate) {
      where.issueDate = {};
      if (startDate) where.issueDate.gte = new Date(startDate);
      if (endDate) where.issueDate.lte = new Date(endDate);
    }
    if (searchQuery) {
      where.OR = [
        { user: { name: { contains: searchQuery, mode: 'insensitive' } } },
        { course: { title: { contains: searchQuery, mode: 'insensitive' } } },
        { certificateNumber: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    const sortField = sortBy || 'issueDate';
    const sortDir = sortOrder || 'desc';

    if (sortField === 'certificateNumber') orderBy.certificateNumber = sortDir;
    else if (sortField === 'studentName') orderBy.user = { name: sortDir };
    else if (sortField === 'courseTitle') orderBy.course = { title: sortDir };
    else orderBy.issueDate = sortDir;

    // Pagination
    const take = pageSize || 50;
    const skip = (page - 1) * take;

    const certificates = await prisma.certificate.findMany({
      where,
      select: {
        certificateNumber: true,
        issueDate: true,
        grade: true,
        finalScore: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy,
      take,
      skip,
    });

    // Get total count for pagination
    const totalCount = await prisma.certificate.count({ where });

    const reportData = certificates.map((cert) => ({
      certificateNumber: cert.certificateNumber,
      studentName: cert.user.name || 'Unknown',
      studentEmail: cert.user.email,
      courseTitle: cert.course.title,
      grade: cert.grade,
      finalScore: cert.finalScore,
      issueDate: cert.issueDate.toISOString().split('T')[0],
    }));

    return {
      data: reportData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        pageSize: take,
      },
    };
  } catch (error) {
    console.error('Error fetching alumni credentials report:', error);
    throw new Error('Failed to fetch alumni credentials report');
  }
}

/**
 * Audit Log Stream
 * Aggregates programmatic audit events from ScholarshipApplication, Project, and Certificate
 * Transforms into standardized audit records sorted chronologically
 */
export async function getAuditLogStream(filters?: {
  startDate?: string | null;
  endDate?: string | null;
}) {
  await checkAdminAccess();

  try {
    // Validate date range
    const validatedFilters = filterSchema.parse(filters || {});
    const { startDate, endDate } = validatedFilters;

    // Build date filter for each entity type
    const scholarshipDateFilter: any = {};
    const projectDateFilter: any = {};
    const certificateDateFilter: any = {};

    if (startDate || endDate) {
      if (startDate) {
        scholarshipDateFilter.submittedAt = { gte: new Date(startDate) };
        projectDateFilter.createdAt = { gte: new Date(startDate) };
        certificateDateFilter.issueDate = { gte: new Date(startDate) };
      }
      if (endDate) {
        scholarshipDateFilter.submittedAt = { ...scholarshipDateFilter.submittedAt, lte: new Date(endDate) };
        projectDateFilter.createdAt = { ...projectDateFilter.createdAt, lte: new Date(endDate) };
        certificateDateFilter.issueDate = { ...certificateDateFilter.issueDate, lte: new Date(endDate) };
      }
    }

    // Query all three entities in parallel
    const [scholarshipApps, projects, certificates] = await Promise.all([
      prisma.scholarshipApplication.findMany({
        where: {
          status: { in: ['APPROVED', 'REJECTED'] },
          ...(Object.keys(scholarshipDateFilter).length > 0 && { submittedAt: scholarshipDateFilter.submittedAt }),
        },
        select: {
          id: true,
          status: true,
          submittedAt: true,
          scholarship: {
            select: {
              title: true,
            },
          },
          applicant: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
        take: 50,
      }),
      prisma.project.findMany({
        where: Object.keys(projectDateFilter).length > 0 ? projectDateFilter : undefined,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.certificate.findMany({
        where: Object.keys(certificateDateFilter).length > 0 ? certificateDateFilter : undefined,
        select: {
          id: true,
          certificateNumber: true,
          issueDate: true,
          user: {
            select: {
              name: true,
            },
          },
          course: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { issueDate: 'desc' },
        take: 50,
      }),
    ]);

    // Transform into standardized audit records
    const scholarshipEvents = scholarshipApps.map((app) => ({
      type: 'SCHOLARSHIP' as const,
      title: `Scholarship ${app.status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      description: `${app.scholarship.title} for ${app.applicant.name || 'Unknown'}`,
      timestamp: app.submittedAt.toISOString(),
      status: app.status,
    }));

    const projectEvents = projects.map((project) => ({
      type: 'PROJECT' as const,
      title: `Project ${project.status.replace('_', ' ')}`,
      description: project.title,
      timestamp: project.createdAt.toISOString(),
      status: project.status,
    }));

    const certificateEvents = certificates.map((cert) => ({
      type: 'CERTIFICATE' as const,
      title: 'Certificate Issued',
      description: `${cert.course.title} for ${cert.user.name || 'Unknown'}`,
      timestamp: cert.issueDate.toISOString(),
      status: 'ISSUED',
    }));

    // Merge and sort by timestamp descending
    const allEvents = [...scholarshipEvents, ...projectEvents, ...certificateEvents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Limit to 50 most recent
    return allEvents.slice(0, 50);
  } catch (error) {
    console.error('Error fetching audit log stream:', error);
    throw new Error('Failed to fetch audit log stream');
  }
}

/**
 * Get all report data in a single call
 * Optimized for parallel execution with filter support
 */
export async function getAllReportsData(filters?: {
  courses?: {
    searchQuery?: string | null;
    levelFilter?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    sortBy?: string | null;
    sortOrder?: 'asc' | 'desc' | null;
    page?: number;
    pageSize?: number;
  };
  projects?: {
    searchQuery?: string | null;
    statusFilter?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    sortBy?: string | null;
    sortOrder?: 'asc' | 'desc' | null;
    page?: number;
    pageSize?: number;
  };
  scholarships?: {
    searchQuery?: string | null;
    statusFilter?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    sortBy?: string | null;
    sortOrder?: 'asc' | 'desc' | null;
    page?: number;
    pageSize?: number;
  };
  certificates?: {
    searchQuery?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    sortBy?: string | null;
    sortOrder?: 'asc' | 'desc' | null;
    page?: number;
    pageSize?: number;
  };
  auditLogs?: {
    startDate?: string | null;
    endDate?: string | null;
  };
}) {
  await checkAdminAccess();

  try {
    const [
      enrollmentRevenue,
      outsourcingActivity,
      scholarshipDisbursement,
      alumniCredentials,
      auditLogs,
    ] = await Promise.all([
      getEnrollmentRevenueReport(filters?.courses),
      getOutsourcingActivityReport(filters?.projects),
      getScholarshipDisbursementReport(filters?.scholarships),
      getAlumniCredentialsReport(filters?.certificates),
      getAuditLogStream(filters?.auditLogs),
    ]);

    return {
      enrollmentRevenue,
      outsourcingActivity,
      scholarshipDisbursement,
      alumniCredentials,
      auditLogs,
    };
  } catch (error) {
    console.error('Error fetching all reports data:', error);
    throw new Error('Failed to fetch reports data');
  }
}
