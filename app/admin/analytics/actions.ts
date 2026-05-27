'use server';

import { prisma } from '@/lib/prisma';
import { checkAdminAccess } from '@/lib/actions/admin';
import { z } from 'zod';

/**
 * Financial Growth Metrics
 * Computes total platform revenue from actual enrollments (price * enrollment count - discount),
 * total project budgets, and related financial indicators
 */
export async function getFinancialMetrics() {
  await checkAdminAccess();

  try {
    // Fetch courses with price and discount, then count actual enrollments per course
    const coursesWithEnrollments = await prisma.course.findMany({
      select: {
        id: true,
        price: true,
        discount: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    // Calculate total revenue: sum of (price * actual enrollment count - discount)
    const totalRevenue = coursesWithEnrollments.reduce((sum, course) => {
      const courseRevenue = Number(course.price) * course._count.enrollments;
      const discountAmount = course.discount ? Number(course.discount) : 0;
      return sum + (courseRevenue - discountAmount);
    }, 0);

    // Calculate total discount value
    const totalDiscounts = coursesWithEnrollments.reduce((sum, course) => {
      return sum + (course.discount ? Number(course.discount) : 0);
    }, 0);

    // Sum all project budgets
    const projectBudgets = await prisma.project.aggregate({
      _sum: {
        budget: true,
      },
    });

    const totalProjectBudgets = Number(projectBudgets._sum.budget || 0);

    return {
      totalRevenue,
      totalDiscounts,
      totalProjectBudgets,
      courseCount: coursesWithEnrollments.length,
    };
  } catch (error) {
    console.error('Error fetching financial metrics:', error);
    throw new Error('Failed to fetch financial metrics');
  }
}

/**
 * Academic Performance Metrics
 * Calculates global average course ratings, certificate counts,
 * and total active students across the ecosystem using actual database records
 */
export async function getAcademicMetrics() {
  await checkAdminAccess();

  try {
    // Average course rating
    const ratingAgg = await prisma.course.aggregate({
      _avg: {
        avgRating: true,
      },
    });

    // Total certificates issued
    const certificateCount = await prisma.certificate.count();

    // Total students (users with STUDENT role)
    const studentCount = await prisma.user.count({
      where: {
        role: 'STUDENT',
      },
    });

    // Total active students (students with actual enrollments)
    const activeStudents = await prisma.user.count({
      where: {
        role: 'STUDENT',
        enrollments: {
          some: {},
        },
      },
    });

    // Total courses
    const courseCount = await prisma.course.count();

    // Total enrollments from database
    const totalEnrollments = await prisma.enrollment.count();

    return {
      averageRating: ratingAgg._avg.avgRating || 0,
      certificateCount,
      studentCount,
      activeStudents,
      courseCount,
      totalEnrollments,
    };
  } catch (error) {
    console.error('Error fetching academic metrics:', error);
    throw new Error('Failed to fetch academic metrics');
  }
}

/**
 * Outsourcing & Engagement Metrics
 * Aggregates project distributions filtered by their status
 * (OPEN, IN_PROGRESS, COMPLETED, etc.)
 */
export async function getOutsourcingMetrics() {
  await checkAdminAccess();

  try {
    // Group projects by status
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
      _sum: {
        budget: true,
      },
    });

    // Format the data for easier consumption
    const statusDistribution = projectsByStatus.map((item) => ({
      status: item.status,
      count: item._count.id,
      totalBudget: Number(item._sum.budget || 0),
    }));

    // Calculate active projects (OPEN, IN_PROGRESS)
    const activeProjectsCount = await prisma.project.count({
      where: {
        status: {
          in: ['OPEN', 'IN_PROGRESS'],
        },
      },
    });

    // Total projects
    const totalProjects = await prisma.project.count();

    return {
      statusDistribution,
      activeProjectsCount,
      totalProjects,
    };
  } catch (error) {
    console.error('Error fetching outsourcing metrics:', error);
    throw new Error('Failed to fetch outsourcing metrics');
  }
}

/**
 * Scholarship Overview Metrics
 * Tracks total scholarship monetary balances and application
 * request weights grouped by workflow state
 */
export async function getScholarshipMetrics() {
  await checkAdminAccess();

  try {
    // Sum all scholarship amounts
    const scholarshipAgg = await prisma.scholarship.aggregate({
      _sum: {
        amount: true,
        awardsGranted: true,
      },
      _count: {
        id: true,
      },
    });

    // Group scholarship applications by status
    const applicationsByStatus = await prisma.scholarshipApplication.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    // Format application status data
    const statusDistribution = applicationsByStatus.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    // Total scholarships
    const totalScholarships = scholarshipAgg._count.id;
    const totalScholarshipAmount = Number(scholarshipAgg._sum.amount || 0);
    const totalAwardsGranted = scholarshipAgg._sum.awardsGranted || 0;

    return {
      totalScholarships,
      totalScholarshipAmount,
      totalAwardsGranted,
      statusDistribution,
    };
  } catch (error) {
    console.error('Error fetching scholarship metrics:', error);
    throw new Error('Failed to fetch scholarship metrics');
  }
}

/**
 * Course Enrollment Data
 * Fetches actual enrollment data from the database for visualization
 */
export async function getCourseEnrollmentData() {
  await checkAdminAccess();

  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        avgRating: true,
        category: {
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
      orderBy: {
        enrollments: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      enrollments: course._count.enrollments,
      rating: course.avgRating,
      category: course.category.name,
    }));
  } catch (error) {
    console.error('Error fetching course enrollment data:', error);
    throw new Error('Failed to fetch course enrollment data');
  }
}

/**
 * Get all analytics metrics in a single call
 * Optimized for parallel execution
 */
export async function getAllAnalyticsMetrics() {
  await checkAdminAccess();

  try {
    const [
      financialMetrics,
      academicMetrics,
      outsourcingMetrics,
      scholarshipMetrics,
      courseEnrollmentData,
    ] = await Promise.all([
      getFinancialMetrics(),
      getAcademicMetrics(),
      getOutsourcingMetrics(),
      getScholarshipMetrics(),
      getCourseEnrollmentData(),
    ]);

    return {
      financial: financialMetrics,
      academic: academicMetrics,
      outsourcing: outsourcingMetrics,
      scholarship: scholarshipMetrics,
      courseEnrollment: courseEnrollmentData,
    };
  } catch (error) {
    console.error('Error fetching all analytics metrics:', error);
    throw new Error('Failed to fetch analytics metrics');
  }
}
