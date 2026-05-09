'use server';

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth/session';

/**
 * Get the highest score a user has achieved for a specific quiz across all attempts
 * Uses Prisma aggregation for efficient database query
 * 
 * @param userId - The user ID
 * @param quizId - The quiz ID
 * @returns The highest score for the quiz, or null if no attempts exist
 */
export async function getMaxQuizScore(userId: string, quizId: string): Promise<number | null> {
    const result = await prisma.quizSubmission.aggregate({
        where: {
            userId: userId,
            quizId: quizId,
        },
        _max: {
            score: true,
        },
    });

    return result._max.score;
}

/**
 * Get the highest scores for multiple quizzes for a user in a single query
 * Uses groupBy with aggregation for optimal performance
 * 
 * @param userId - The user ID
 * @param courseId - The course ID (filters submissions for this course)
 * @returns Record mapping quizId to the highest score achieved
 */
export async function getMaxScoresForCourse(userId: string, courseId: string): Promise<Record<string, number>> {
    const results = await prisma.quizSubmission.groupBy({
        by: ['quizId'],
        where: {
            userId: userId,
            courseId: courseId,
        },
        _max: {
            score: true,
        },
    });

    // Transform results into Record<quizId, maxScore>
    const maxScores: Record<string, number> = {};
    results.forEach(result => {
        if (result._max.score !== null) {
            maxScores[result.quizId] = result._max.score;
        }
    });

    return maxScores;
}

/**
 * Get all attempts for a specific quiz by a user (for review purposes)
 * 
 * @param userId - The user ID
 * @param quizId - The quiz ID
 * @returns Array of submissions ordered by creation date descending
 */
export async function getQuizAttempts(userId: string, quizId: string) {
    return await prisma.quizSubmission.findMany({
        where: {
            userId: userId,
            quizId: quizId,
        },
        select: {
            id: true,
            score: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

/**
 * Get statistics for a quiz (min, max, latest, attempt count)
 * 
 * @param userId - The user ID
 * @param quizId - The quiz ID
 * @returns Quiz statistics including best score, worst score, attempts, and latest score
 */
export async function getQuizStatistics(userId: string, quizId: string) {
    const stats = await prisma.quizSubmission.aggregate({
        where: {
            userId: userId,
            quizId: quizId,
        },
        _max: {
            score: true,
        },
        _min: {
            score: true,
        },
        _avg: {
            score: true,
        },
        _count: true,
    });

    const latestAttempt = await prisma.quizSubmission.findFirst({
        where: {
            userId: userId,
            quizId: quizId,
        },
        select: {
            score: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return {
        bestScore: stats._max.score,
        worstScore: stats._min.score,
        averageScore: stats._avg.score ? Math.round(stats._avg.score * 100) / 100 : null,
        totalAttempts: stats._count,
        latestScore: latestAttempt?.score,
        latestAttemptDate: latestAttempt?.createdAt,
    };
}

export async function checkAndIssueCertificate(courseId: string) {
    try {
        const user = await getUser();

        if (!user) {
            return {
                success: false,
                error: 'User not authenticated',
            };
        }

        // 1. Verify all lessons are completed for this course
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                syllabus: {
                    include: {
                        lessons: {
                            select: { id: true },
                        },
                    },
                },
            },
        });

        if (!course) {
            return {
                success: false,
                error: 'Course not found',
            };
        }

        // Calculate total lessons in course
        const totalLessons = course.syllabus.reduce(
            (sum, module) => sum + module.lessons.length,
            0
        );

        // Check completed lessons for this user
        const completedLessons = await prisma.courseProgress.findMany({
            where: {
                userId: user.id,
                courseId: courseId,
                isCompleted: true,
            },
            select: {
                lessonId: true,
            },
        });

        const completedLessonCount = new Set(completedLessons.map(p => p.lessonId)).size;

        if (completedLessonCount < totalLessons) {
            return {
                success: false,
                error: `Not all lessons completed. Completed: ${completedLessonCount}/${totalLessons}`,
                progress: {
                    completed: completedLessonCount,
                    total: totalLessons,
                },
            };
        }

        // 2. Get all QUIZ and EXAM assessments for this course
        const assessments = await prisma.quiz.findMany({
            where: {
                courseId: courseId,
                type: { in: ['QUIZ', 'EXAM'] },
            },
            select: {
                id: true,
                type: true,
                passingScore: true,
            },
        });

        if (assessments.length === 0) {
            return {
                success: false,
                error: 'No assessments found for this course',
            };
        }

        // Separate quizzes and exam
        const quizzes = assessments.filter(a => a.type === 'QUIZ');
        const exams = assessments.filter(a => a.type === 'EXAM');

        // 3. Get best scores for all assessments using optimized aggregation query
        const bestScores = await getMaxScoresForCourse(user.id, courseId);

        // Check if all quizzes have passing scores
        for (const quiz of quizzes) {
            const bestScore = bestScores[quiz.id];
            if (!bestScore || bestScore < quiz.passingScore) {
                return {
                    success: false,
                    error: `Quiz assessment not passed. Required: ${quiz.passingScore}%, Your score: ${bestScore || 0}%`,
                };
            }
        }

        // Check if exam has passing score
        if (exams.length > 0) {
            for (const exam of exams) {
                const bestScore = bestScores[exam.id];
                if (!bestScore || bestScore < exam.passingScore) {
                    return {
                        success: false,
                        error: `Exam not passed. Required: ${exam.passingScore}%, Your score: ${bestScore || 0}%`,
                    };
                }
            }
        }

        // 4. Calculate weighted final score using best scores
        let quizAverageScore = 0;
        let examAverageScore = 0;

        if (quizzes.length > 0) {
            const quizScores = quizzes
                .map(q => bestScores[q.id] || 0)
                .filter(score => score > 0);
            quizAverageScore = quizScores.length > 0
                ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
                : 0;
        }

        if (exams.length > 0) {
            const examScores = exams
                .map(e => bestScores[e.id] || 0)
                .filter(score => score > 0);
            examAverageScore = examScores.length > 0
                ? examScores.reduce((a, b) => a + b, 0) / examScores.length
                : 0;
        }

        // Weighted calculation: 40% quiz + 60% exam
        const finalScore = (quizAverageScore * 0.4) + (examAverageScore * 0.6);

        // 5. Generate unique certificateNumber (LA-YYYY-XXXXXX format)
        const year = new Date().getFullYear();
        const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        const certificateNumber = `LA-${year}-${randomSuffix}`;

        // Determine grade based on final score
        let grade = 'Pass';
        if (finalScore >= 90) {
            grade = 'Distinction';
        } else if (finalScore >= 80) {
            grade = 'Merit';
        }

        // 6. Check if certificate already exists
        const existingCertificate = await prisma.certificate.findFirst({
            where: {
                userId: user.id,
                courseId: courseId,
            },
        });

        if (existingCertificate) {
            return {
                success: false,
                error: 'Certificate already issued for this course',
                certificate: {
                    id: existingCertificate.id,
                    certificateNumber: existingCertificate.certificateNumber,
                    issueDate: existingCertificate.issueDate,
                    grade: existingCertificate.grade,
                    finalScore: existingCertificate.finalScore,
                },
            };
        }

        // 7. Create certificate record
        const certificate = await prisma.certificate.create({
            data: {
                userId: user.id,
                courseId: courseId,
                certificateNumber,
                finalScore: Math.round(finalScore * 100) / 100,
                grade,
                issueDate: new Date(),
            },
        });

        return {
            success: true,
            message: 'Certificate issued successfully',
            certificate: {
                id: certificate.id,
                certificateNumber: certificate.certificateNumber,
                issueDate: certificate.issueDate,
                grade: certificate.grade,
                finalScore: certificate.finalScore,
            },
            scores: {
                quizAverage: Math.round(quizAverageScore * 100) / 100,
                examAverage: Math.round(examAverageScore * 100) / 100,
                finalScore: Math.round(finalScore * 100) / 100,
            },
        };
    } catch (error) {
        console.error('Certificate issuance error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to issue certificate',
        };
    }
}
