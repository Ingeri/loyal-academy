"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { checkAndIssueCertificate } from "../actions";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Circle,
  Play,
  FileText,
  HelpCircle,
  Award,
  BookOpen,
  Clock,
  ChevronRight,
  ChevronDown,
  Lock,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface ContentBlock {
  type:
    | "heading"
    | "paragraph"
    | "list"
    | "image"
    | "video"
    | "table"
    | "callout"
    | "code"
    | "quiz"
    | "exam";
  level?: number;
  text?: string;
  url?: string;
  caption?: string;
  platform?: string;
  alt?: string;
  style?: "unordered" | "ordered";
  items?: string[];
  headers?: string[];
  rows?: string[][];
  intent?: "info" | "warning" | "success" | "error";
  language?: string;
  code?: string;
  quizId?: string;
}

interface Lesson {
  id: string;
  title: string;
  content: string | ContentBlock[] | null;
  duration: number | null;
  order: number;
  quizzes: Quiz[];
  isCompleted?: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
  Quiz: Quiz[];
  isCompleted?: boolean;
  progress: number;
}

interface Quiz {
  id: string;
  title: string;
  type: "EXERCISE" | "QUIZ" | "TEST" | "EXAM";
  passingScore: number;
  isCompleted?: boolean;
  bestScore?: number;
  attempts?: number;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  slug: string;
  syllabus: Module[];
}

interface QuizScore {
  bestScore: number;
  attempts: number;
}

interface LearningData {
  course: Course;
  progress: {
    completedLessons: string[];
    totalLessons: number;
    completedCount: number;
    percentage: number;
  };
  quizScores: Record<string, QuizScore>;
  certificate: {
    id: string;
    issueDate: string;
    grade: string;
  } | null;
  courseExams: Quiz[];
}

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LearningData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Navigation state
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );

  // Certificate state
  const [certificateLoading, setCertificateLoading] = useState(false);

  const fetchLearningData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/courses/${slug}/learn`);

      if (!res.ok) {
        if (res.status === 401) {
          router.push(
            "/auth/login?redirect=" + encodeURIComponent(`/learn/${slug}`),
          );
          return;
        }
        if (res.status === 403) {
          setError("You are not enrolled in this course. Please enroll first.");
          return;
        }
        if (res.status === 404) {
          setError("Course not found.");
          return;
        }
        throw new Error("Failed to fetch course data");
      }

      const learningData = await res.json();

      // Enhance data with completion status
      const completedLessonsSet = new Set(
        learningData.progress.completedLessons,
      );

      const enhancedCourse = {
        ...learningData.course,
        syllabus: learningData.course.syllabus.map((module: Module) => {
          const moduleLessons = module.lessons.map((lesson: Lesson) => ({
            ...lesson,
            isCompleted: completedLessonsSet.has(lesson.id),
            quizzes:
              lesson.quizzes?.map((quiz: Quiz) => ({
                ...quiz,
                isCompleted:
                  learningData.quizScores[quiz.id]?.bestScore >=
                  quiz.passingScore,
                bestScore: learningData.quizScores[quiz.id]?.bestScore,
                attempts: learningData.quizScores[quiz.id]?.attempts,
              })) || [],
          }));

          const completedModuleLessons = moduleLessons.filter(
            (l: Lesson) => l.isCompleted,
          ).length;

          return {
            ...module,
            lessons: moduleLessons,
            progress:
              moduleLessons.length > 0
                ? Math.round(
                    (completedModuleLessons / moduleLessons.length) * 100,
                  )
                : 0,
            Quiz:
              module.Quiz?.map((quiz: Quiz) => ({
                ...quiz,
                isCompleted:
                  learningData.quizScores[quiz.id]?.bestScore >=
                  quiz.passingScore,
                bestScore: learningData.quizScores[quiz.id]?.bestScore,
                attempts: learningData.quizScores[quiz.id]?.attempts,
              })) || [],
          };
        }),
      };

      setData({
        ...learningData,
        course: enhancedCourse,
        courseExams: learningData.courseExams.map((exam: Quiz) => ({
          ...exam,
          isCompleted:
            learningData.quizScores[exam.id]?.bestScore >= exam.passingScore,
          bestScore: learningData.quizScores[exam.id]?.bestScore,
          attempts: learningData.quizScores[exam.id]?.attempts,
        })),
      });

      // Auto-expand first incomplete module
      const firstIncompleteModule = enhancedCourse.syllabus.find(
        (m: Module) => (m.progress ?? 0) < 100,
      );
      if (firstIncompleteModule) {
        setExpandedModules(new Set([firstIncompleteModule.id]));

        // Find first incomplete lesson
        const firstIncompleteLesson = firstIncompleteModule.lessons.find(
          (l: Lesson) => !l.isCompleted,
        );
        if (firstIncompleteLesson) {
          setActiveModuleId(firstIncompleteModule.id);
          setActiveLessonId(firstIncompleteLesson.id);
        } else {
          // All lessons complete, show first lesson
          setActiveModuleId(firstIncompleteModule.id);
          setActiveLessonId(firstIncompleteModule.lessons[0]?.id);
        }
      } else if (enhancedCourse.syllabus.length > 0) {
        // All complete, show first module
        setExpandedModules(new Set([enhancedCourse.syllabus[0].id]));
        setActiveModuleId(enhancedCourse.syllabus[0].id);
        setActiveLessonId(enhancedCourse.syllabus[0].lessons[0]?.id);
      }
    } catch (err) {
      console.error("Learn page error:", err);
      setError(err instanceof Error ? err.message : "Failed to load course");
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    setMounted(true);
    fetchLearningData();
  }, [slug, fetchLearningData]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const selectLesson = (moduleId: string, lessonId: string) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
    setActiveQuizId(null);
    setActiveExamId(null);
  };

  const selectQuiz = (moduleId: string, quizId: string) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(null);
    setActiveQuizId(quizId);
    setActiveExamId(null);
  };

  const selectExam = (moduleId: string, examId: string) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(null);
    setActiveQuizId(null);
    setActiveExamId(examId);
  };

  const markLessonComplete = async () => {
    if (!activeLessonId || !data || !activeModuleId) {
      toast.error("Cannot save progress: Missing module or lesson");
      return;
    }

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: data.course.id,
          lessonId: activeLessonId,
          moduleId: activeModuleId,
          isCompleted: true,
        }),
      });

      if (res.ok) {
        toast.success("Lesson completed!");
        fetchLearningData(); // Refresh data
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Progress save error:", res.status, errorData);
        toast.error(
          errorData.error || `Failed to save progress (${res.status})`,
        );
      }
    } catch (err) {
      console.error("Progress save exception:", err);
      toast.error("Failed to save progress");
    }
  };

  const handleCheckAndIssueCertificate = async () => {
    if (!data) {
      toast.error("Course data not loaded");
      return;
    }

    setCertificateLoading(true);
    try {
      const result = await checkAndIssueCertificate(data.course.id);

      if (result.success && result.certificate) {
        toast.success(
          `🎉 Certificate issued! Grade: ${result.certificate.grade}`,
        );
        fetchLearningData(); // Refresh to show certificate
      } else {
        toast.error(result.error || "Failed to issue certificate");
      }
    } catch (err) {
      console.error("Certificate issuance error:", err);
      toast.error("Failed to check certificate eligibility");
    } finally {
      setCertificateLoading(false);
    }
  };

  const getActiveLesson = () => {
    if (!data || !activeModuleId || !activeLessonId) return null;
    const module = data.course.syllabus.find((m) => m.id === activeModuleId);
    return module?.lessons.find((l) => l.id === activeLessonId);
  };

  const getActiveModule = () => {
    if (!data || !activeModuleId) return null;
    return data.course.syllabus.find((m) => m.id === activeModuleId);
  };

  const getActiveQuiz = () => {
    if (!data || !activeModuleId || !activeQuizId) return null;
    const module = data.course.syllabus.find((m) => m.id === activeModuleId);
    return module?.Quiz?.find((q) => q.id === activeQuizId);
  };

  const getActiveExam = () => {
    if (!data || !activeExamId) return null;

    // First check course-level exams
    if (data.courseExams) {
      const courseExam = data.courseExams.find((q) => q.id === activeExamId);
      if (courseExam) return courseExam;
    }

    // Then check module-level exams
    if (!activeModuleId) return null;
    const module = data.course.syllabus.find((m) => m.id === activeModuleId);
    return module?.Quiz?.find(
      (q) => q.id === activeExamId && q.type === "EXAM",
    );
  };

  const goToNext = () => {
    if (!data) return;

    const currentModule = getActiveModule();
    if (!currentModule) return;

    const currentLessonIndex = currentModule.lessons.findIndex(
      (l) => l.id === activeLessonId,
    );

    // Try next lesson in same module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      selectLesson(
        currentModule.id,
        currentModule.lessons[currentLessonIndex + 1].id,
      );
      return;
    }

    // Try next module
    const currentModuleIndex = data.course.syllabus.findIndex(
      (m) => m.id === activeModuleId,
    );
    if (currentModuleIndex < data.course.syllabus.length - 1) {
      const nextModule = data.course.syllabus[currentModuleIndex + 1];
      setExpandedModules((prev) => new Set([...prev, nextModule.id]));
      if (nextModule.lessons.length > 0) {
        selectLesson(nextModule.id, nextModule.lessons[0].id);
      }
    }
  };

  if (!mounted) return null;

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Unable to Load Course
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  const activeLesson = getActiveLesson();
  const activeModule = getActiveModule();
  const activeQuiz = getActiveQuiz();
  const activeExam = getActiveExam();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Link>
              </Button>
              {loading ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <div>
                  <h1 className="font-semibold text-foreground line-clamp-1">
                    {data?.course.title}
                  </h1>
                  {data && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{data.progress.percentage}% complete</span>
                      <span>•</span>
                      <span>
                        {data.progress.completedCount}/
                        {data.progress.totalLessons} lessons
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {data?.certificate && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                  <Award className="h-3 w-3 mr-1" />
                  Certified
                </Badge>
              )}
              {!data?.certificate &&
                data &&
                data.progress.percentage === 100 && (
                  <Button
                    size="sm"
                    onClick={handleCheckAndIssueCertificate}
                    disabled={certificateLoading}
                    className="gap-2"
                  >
                    {certificateLoading ? (
                      <>
                        <RotateCcw className="h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4" />
                        Get Certificate
                      </>
                    )}
                  </Button>
                )}
              {data && (
                <div className="hidden sm:block w-32">
                  <Progress value={data.progress.percentage} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - Curriculum */}
        <aside className="hidden lg:block w-80 border-r bg-card sticky top-[4rem] h-[calc(100vh-4rem)] overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
            <div className="p-4">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                Course Content
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {data?.course.syllabus.map((module, moduleIndex) => (
                    <div
                      key={module.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          {module.progress === 100 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium text-sm">
                            Module {moduleIndex + 1}: {module.title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            expandedModules.has(module.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Module Content */}
                      {expandedModules.has(module.id) && (
                        <div className="border-t">
                          {/* Lessons */}
                          {module.lessons.map((lesson, lessonIndex) => (
                            <button
                              key={lesson.id}
                              onClick={() => selectLesson(module.id, lesson.id)}
                              className={`w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors ${
                                activeLessonId === lesson.id
                                  ? "bg-primary/5 border-l-2 border-l-primary"
                                  : ""
                              }`}
                            >
                              {lesson.isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <Play className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm ${lesson.isCompleted ? "text-muted-foreground" : "text-foreground"}`}
                                >
                                  {lessonIndex + 1}. {lesson.title}
                                </p>
                                {lesson.duration && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    <Clock className="h-3 w-3 inline mr-1" />
                                    {lesson.duration} min
                                  </p>
                                )}
                              </div>
                            </button>
                          ))}

                          {/* Module Quizzes - Only show QUIZ type (not exercises) */}
                          {module.Quiz?.filter((q) => q.type === "QUIZ")
                            .length > 0 && (
                            <div className="border-t border-dashed">
                              <p className="text-xs text-muted-foreground px-3 py-2 bg-muted/30">
                                Quizzes & Tests
                              </p>
                              {module.Quiz.filter((q) => q.type === "QUIZ").map(
                                (quiz, quizIndex) => (
                                  <button
                                    key={quiz.id}
                                    onClick={() =>
                                      selectQuiz(module.id, quiz.id)
                                    }
                                    className={`w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors ${
                                      activeQuizId === quiz.id
                                        ? "bg-primary/5 border-l-2 border-l-primary text-foreground"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm">{quiz.title}</p>
                                        {quiz.isCompleted && (
                                          <Badge
                                            variant="secondary"
                                            className="text-[10px] px-2 py-1"
                                          >
                                            Completed
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground/70 mt-0.5">
                                        Quiz
                                      </p>
                                    </div>
                                  </button>
                                ),
                              )}
                            </div>
                          )}

                          {/* Module Exam - Show below lessons */}
                          {module.Quiz?.filter((q) => q.type === "EXAM")
                            .length > 0 && (
                            <div className="border-t border-dashed bg-amber-50/30">
                              {module.Quiz.filter((q) => q.type === "EXAM").map(
                                (exam) => (
                                  <button
                                    key={exam.id}
                                    onClick={() =>
                                      selectExam(module.id, exam.id)
                                    }
                                    className={`w-full flex items-start gap-3 p-3 text-left hover:bg-amber-100/30 transition-colors ${
                                      activeExamId === exam.id
                                        ? "bg-amber-100/50 border-l-2 border-l-amber-500"
                                        : ""
                                    }`}
                                  >
                                    <Award className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium text-amber-900">
                                          {exam.title}
                                        </p>
                                        {exam.isCompleted && (
                                          <Badge
                                            variant="secondary"
                                            className="text-[10px] px-2 py-1 bg-green-100 text-green-800"
                                          >
                                            Passed
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-amber-700/70 mt-0.5">
                                        Module Exam
                                      </p>
                                    </div>
                                  </button>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {data?.courseExams && data.courseExams.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                        Exams
                      </p>
                      <div className="space-y-2">
                        {data.courseExams.map((exam) => (
                          <button
                            key={exam.id}
                            onClick={() => {
                              setActiveModuleId(null);
                              setActiveLessonId(null);
                              setActiveQuizId(null);
                              setActiveExamId(exam.id);
                            }}
                            className={`w-full flex items-start gap-3 p-3 text-left rounded-lg border border-border bg-background/80 hover:bg-amber-50 transition-colors ${
                              activeExamId === exam.id
                                ? "bg-amber-100/50 border-amber-500"
                                : ""
                            }`}
                          >
                            <Award className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-amber-900">
                                  {exam.title}
                                </p>
                                {exam.isCompleted && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] px-2 py-1 bg-green-100 text-green-800"
                                  >
                                    Passed
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-amber-700/70 mt-0.5">
                                Final Exam
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-h-[calc(100vh-8rem)]">
          {loading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : activeLesson ? (
            <LessonView
              lesson={activeLesson}
              module={activeModule!}
              course={data!.course}
              onComplete={markLessonComplete}
              onQuizComplete={fetchLearningData}
              onNext={goToNext}
              isLastLesson={
                activeModule?.lessons.indexOf(activeLesson) ===
                (activeModule?.lessons.length || 0) - 1
              }
            />
          ) : activeQuiz ? (
            <QuizView
              quiz={activeQuiz}
              module={activeModule!}
              course={data!.course}
              onComplete={async () => {
                toast.success("Quiz completed!");
                await fetchLearningData();
                // Go back to first lesson of module
                if (activeModule?.lessons[0]) {
                  selectLesson(activeModule.id, activeModule.lessons[0].id);
                }
              }}
            />
          ) : activeExam ? (
            <ExamView
              exam={activeExam}
              module={activeModule || undefined}
              course={data!.course}
              onComplete={async () => {
                toast.success("Exam completed!");
                await fetchLearningData();
                // Go back to first lesson of module if available
                if (activeModule?.lessons[0]) {
                  selectLesson(activeModule.id, activeModule.lessons[0].id);
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <Card className="p-8 text-center max-w-md">
                <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Select a Lesson</h3>
                <p className="text-muted-foreground">
                  Choose a lesson from the sidebar to start learning
                </p>
              </Card>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </main>
  );
}

// Collapsible Exercise Component
function CollapsibleExercise({
  quiz,
  courseId,
  onComplete,
  exerciseNumber,
}: {
  quiz: Quiz;
  courseId?: string;
  onComplete: () => void;
  exerciseNumber: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = () => {
    onComplete();
  };

  const isPassed = quiz.isCompleted;
  const hasAttempts = (quiz.attempts || 0) > 0;

  return (
    <div className="my-6 border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isPassed
                ? "bg-green-100"
                : hasAttempts
                  ? "bg-amber-100"
                  : "bg-primary/10"
            }`}
          >
            {isPassed ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : hasAttempts ? (
              <XCircle className="h-4 w-4 text-amber-600" />
            ) : (
              <HelpCircle className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">Exercise {exerciseNumber}</p>
            <p className="text-sm text-muted-foreground">{quiz.title}</p>
            {hasAttempts && (
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    isPassed
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {quiz.bestScore}% {isPassed ? "(Passed)" : "(Failed)"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {quiz.attempts} attempt{quiz.attempts !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPassed && (
            <span className="text-sm text-green-600 font-medium">
              Completed
            </span>
          )}
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="border-t">
          <div className="p-4">
            {isPassed ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">
                  Exercise Completed
                </h3>
                <p className="text-muted-foreground mb-4">
                  You scored {quiz.bestScore}% on this exercise.
                </p>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Passed (Passing score: {quiz.passingScore}%)
                </Badge>
              </div>
            ) : (
              <InlineQuiz quiz={quiz} onComplete={handleComplete} type="quiz" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Content Renderer Component
function ContentRenderer({
  content,
  lessonQuizzes,
  courseId,
  onQuizComplete,
}: {
  content: string | ContentBlock[] | null;
  lessonQuizzes: Quiz[];
  courseId?: string;
  onQuizComplete: () => void;
}) {
  // Parse content if it's a string
  let blocks: ContentBlock[] = [];
  if (typeof content === "string") {
    try {
      blocks = JSON.parse(content);
    } catch {
      // If not valid JSON, treat as HTML
      return (
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
  } else if (Array.isArray(content)) {
    blocks = content;
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <p className="text-muted-foreground">
          No content available for this lesson
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            // 1. Explicitly define the tag type as a valid HTML element
            const level = block.level || 2;
            const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;

            // 2. Use a Record type for the classes to prevent "implicit any" or "undefined" errors
            const headingClasses: Record<number, string> = {
              1: "text-3xl font-bold",
              2: "text-2xl font-semibold",
              3: "text-xl font-semibold",
              4: "text-lg font-medium",
              5: "text-base font-medium",
              6: "text-sm font-medium",
            };

            return (
              <HeadingTag
                key={index}
                className={`${headingClasses[level] || headingClasses[2]} text-foreground mt-8 mb-4`}
              >
                {block.text}
              </HeadingTag>
            );
          }

          case "paragraph":
            return (
              <p key={index} className="text-foreground leading-relaxed">
                {block.text}
              </p>
            );

          case "list":
            const ListTag = block.style === "ordered" ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={`${block.style === "ordered" ? "list-decimal" : "list-disc"} pl-6 space-y-2 text-foreground`}
              >
                {block.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ListTag>
            );

          case "image":
            return (
              <figure key={index} className="my-6">
                <img
                  src={block.url}
                  alt={block.alt || ""}
                  className="rounded-lg max-w-full h-auto"
                />
                {block.caption && (
                  <figcaption className="text-sm text-muted-foreground text-center mt-2">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "video":
            return (
              <figure key={index} className="my-6">
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  {block.platform === "youtube" ? (
                    <iframe
                      src={block.url}
                      title={block.caption || "Video"}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <video src={block.url} controls className="w-full h-full" />
                  )}
                </div>
                {block.caption && (
                  <figcaption className="text-sm text-muted-foreground text-center mt-2">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "table":
            return (
              <div key={index} className="overflow-x-auto my-6">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      {block.headers?.map((header, i) => (
                        <th
                          key={i}
                          className="border border-border px-4 py-2 text-left font-semibold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows?.map((row, i) => (
                      <tr key={i} className="even:bg-muted/50">
                        {Array.isArray(row) ? (
                          row.map((cell, j) => (
                            <td
                              key={j}
                              className="border border-border px-4 py-2"
                            >
                              {cell}
                            </td>
                          ))
                        ) : (
                          <td
                            key={0}
                            className="border border-border px-4 py-2"
                          >
                            {row}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "callout":
            const calloutStyles = {
              info: "bg-blue-50 border-blue-200 text-blue-800",
              warning: "bg-amber-50 border-amber-200 text-amber-800",
              success: "bg-green-50 border-green-200 text-green-800",
              error: "bg-red-50 border-red-200 text-red-800",
            }[block.intent || "info"];
            return (
              <div
                key={index}
                className={`${calloutStyles} border rounded-lg p-4 my-6`}
              >
                <p>{block.text}</p>
              </div>
            );

          case "code":
            return (
              <div key={index} className="my-6">
                <div className="bg-muted rounded-t-lg px-4 py-2 text-xs text-muted-foreground border-b">
                  {block.language}
                </div>
                <pre className="bg-muted rounded-b-lg p-4 overflow-x-auto">
                  <code className="text-sm font-mono">{block.code}</code>
                </pre>
              </div>
            );

          case "quiz":
          case "exam":
            // Find the quiz by ID from lessonQuizzes
            const quiz = lessonQuizzes.find((q) => q.id === block.quizId);
            if (quiz) {
              // For exercises (quiz type), use collapsible component
              // For exams, show inline
              if (block.type === "quiz") {
                return (
                  <CollapsibleExercise
                    key={index}
                    quiz={quiz}
                    onComplete={onQuizComplete}
                    exerciseNumber={(() => {
                      // Calculate exercise number based on index in content
                      let count = 0;
                      for (let i = 0; i <= index; i++) {
                        if (blocks[i].type === "quiz") count++;
                      }
                      return count;
                    })()}
                  />
                );
              }
              return (
                <div key={index} className="my-8">
                  <InlineQuiz
                    quiz={quiz}
                    onComplete={onQuizComplete}
                    type={block.type}
                    courseId={courseId}
                  />
                </div>
              );
            }
            return null;

          default:
            return null;
        }
      })}
    </div>
  );
}

// Inline Quiz Component
function InlineQuiz({
  quiz,
  onComplete,
  type,
  courseId,
}: {
  quiz: Quiz;
  onComplete: () => void;
  type: string;
  courseId?: string;
}) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    questions?: any[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const shuffleArray = <T,>(items: T[]) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // If quiz is already completed, show completion status
  if (quiz.isCompleted) {
    return (
      <Card className="p-6">
        <div className="text-center py-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">
            {type === "exam" ? "Exam" : "Exercise"} Completed
          </h3>
          <p className="text-muted-foreground mb-4">
            You scored {quiz.bestScore}% on this {type}.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Passed (Passing score: {quiz.passingScore}%)
            </Badge>
            <Badge variant="outline">
              {quiz.attempts} attempt{quiz.attempts !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </Card>
    );
  }

  const fetchQuizQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/quizzes/${quiz.id}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Quiz fetch error:", res.status, errorData);
        setError(errorData.error || `Failed to load quiz (${res.status})`);
        setQuestions([]);
        return;
      }

      const data = await res.json();
      console.log(
        "[InlineQuiz] Loaded questions:",
        data.questions?.length || 0,
      );
      setQuestions(
        (data.questions || []).map((q: any) => ({
          ...q,
          options: shuffleArray(q.options || []),
        })),
      );
    } catch (err) {
      console.error("Failed to fetch quiz questions:", err);
      setError("Failed to load quiz questions");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [quiz.id]);

  useEffect(() => {
    fetchQuizQuestions();
  }, [fetchQuizQuestions]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          answers: Object.entries(answers).map(([questionId, optionId]) => ({
            questionId,
            optionId,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult({
          score: data.score,
          passed: data.passed,
          questions: data.questions,
        });
        toast.success(
          `${type === "exam" ? "Exam" : "Exercise"} completed! Score: ${data.score}%`,
        );
        if (data.passed) {
          onComplete();
        }
      } else {
        toast.error(`Failed to submit ${type}`);
      }
    } catch (err) {
      toast.error(`Failed to submit ${type}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-32 w-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <HelpCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 mb-3">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchQuizQuestions}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </Card>
    );
  }

  if (result) {
    return (
      <Card className="p-6">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            result.passed ? "bg-green-100" : "bg-amber-100"
          }`}
        >
          {result.passed ? (
            <CheckCircle className="h-8 w-8 text-green-600" />
          ) : (
            <HelpCircle className="h-8 w-8 text-amber-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-center mb-2">
          {result.passed ? "Completed!" : "Keep Learning"}
        </h3>
        <p className="text-muted-foreground text-center mb-4">
          You scored {result.score}% (Passing: {quiz.passingScore}%)
        </p>
        <Button
          variant="outline"
          onClick={() => setShowResults(!showResults)}
          className="w-full mb-3"
        >
          {showResults ? "Hide" : "View"} Results
        </Button>

        {showResults && result.questions && (
          <div className="space-y-4 mt-4 text-left">
            <h4 className="font-semibold text-sm">Detailed Results:</h4>
            {result.questions.map((q, idx) => (
              <div key={q.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  {q.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">
                    {idx + 1}. {q.text}
                  </span>
                </div>
                <div className="pl-7 space-y-1">
                  {q.options.map((opt: any) => {
                    const isSelected = q.userSelectedOptionId === opt.id;
                    const isCorrect = opt.isCorrect;
                    let className = "text-sm px-2 py-1 rounded ";
                    if (isCorrect) {
                      className += "bg-green-100 text-green-800";
                    } else if (isSelected && !isCorrect) {
                      className += "bg-red-100 text-red-800";
                    } else {
                      className += "text-muted-foreground";
                    }
                    return (
                      <div key={opt.id} className={className}>
                        {opt.text} {isCorrect && "(Correct)"}{" "}
                        {isSelected && !isCorrect && "(Your answer)"}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {!result.passed && (
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
            }}
            className="w-full mt-3"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </Card>
    );
  }

  // Handle case where no questions loaded
  if (!loading && !error && questions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <HelpCircle className="h-12 w-12 text-amber-400 mx-auto mb-3" />
        <p className="text-amber-600 mb-3">
          No questions available for this quiz
        </p>
        <Button variant="outline" size="sm" onClick={fetchQuizQuestions}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <Card className="p-6 border-l-4 border-l-primary">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={type === "exam" ? "destructive" : "secondary"}>
          <HelpCircle className="h-3 w-3 mr-1" />
          {type === "exam" ? "Exam" : "Exercise"}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <Progress
        value={((currentQuestion + 1) / questions.length) * 100}
        className="h-2 mb-4"
      />

      {currentQ && (
        <div className="space-y-4">
          <h4 className="font-medium">{currentQ.text}</h4>
          <div className="space-y-2">
            {currentQ.options.map((option: any, idx: number) => (
              <button
                key={idx}
                onClick={() =>
                  handleAnswer(currentQ.id, option.id || option.text)
                }
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                  answers[currentQ.id] === (option.id || option.text)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQ.id] === (option.id || option.text)
                      ? "border-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {answers[currentQ.id] === (option.id || option.text) && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-sm">{option.text || option}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <Button
          variant="ghost"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {currentQuestion < questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestion((prev) => prev + 1)}
            disabled={!answers[currentQ?.id]}
            size="sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={
              submitting || Object.keys(answers).length < questions.length
            }
            size="sm"
          >
            {submitting ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Submit {type === "exam" ? "Exam" : "Exercise"}
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}

// Quiz View Component (for sidebar-selected quizzes)
function QuizView({
  quiz,
  module,
  course,
  onComplete,
}: {
  quiz: Quiz;
  module: Module;
  course: Course;
  onComplete: () => void;
}) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-muted-foreground">Module: {module.title}</p>
      </div>
      <InlineQuiz
        quiz={quiz}
        onComplete={onComplete}
        type="quiz"
        courseId={course.id}
      />
    </div>
  );
}

// Exam View Component (for sidebar-selected exams)
function ExamView({
  exam,
  module,
  course,
  onComplete,
}: {
  exam: Quiz;
  module?: Module;
  course: Course;
  onComplete: () => void;
}) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-amber-600" />
          <h1 className="text-2xl font-bold">{exam.title}</h1>
        </div>
        {module && (
          <p className="text-muted-foreground">Module: {module.title}</p>
        )}
        <p className="text-sm text-amber-700 mt-2">
          Passing Score: {exam.passingScore}%
        </p>
      </div>
      <InlineQuiz
        quiz={exam}
        onComplete={onComplete}
        type="exam"
        courseId={course.id}
      />
    </div>
  );
}

// Lesson View Component
function LessonView({
  lesson,
  module,
  course,
  onComplete,
  onQuizComplete,
  onNext,
  isLastLesson,
}: {
  lesson: Lesson;
  module: Module;
  course: Course;
  onComplete: () => void;
  onQuizComplete: () => Promise<void>;
  onNext: () => void;
  isLastLesson: boolean;
}) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [showExam, setShowExam] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    await onComplete();
    setIsCompleting(false);
  };

  const handleQuizComplete = async () => {
    setIsCompleting(true);
    await onQuizComplete();
    setIsCompleting(false);
  };

  // Separate exercises (regular quizzes) and exam
  const exercises = lesson.quizzes?.filter((q) => q.type !== "EXAM") || [];
  const exam = lesson.quizzes?.find((q) => q.type === "EXAM");

  // Check if lesson content has inline quiz/exam blocks
  let contentBlocks: ContentBlock[] = [];
  if (typeof lesson.content === "string") {
    try {
      contentBlocks = JSON.parse(lesson.content);
    } catch {
      // Not JSON, will be rendered as HTML
    }
  } else if (Array.isArray(lesson.content)) {
    contentBlocks = lesson.content;
  }

  // Check if content already has inline exercises
  const hasInlineQuiz = contentBlocks.some((b) => b.type === "quiz");
  const hasInlineExam = contentBlocks.some((b) => b.type === "exam");

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>{course.title}</span>
        <ChevronRight className="h-4 w-4" />
        <span>{module.title}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{lesson.title}</span>
      </div>

      {/* Lesson Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">
            <FileText className="h-3 w-3 mr-1" />
            Lesson
          </Badge>
          {lesson.duration && (
            <span className="text-sm text-muted-foreground">
              <Clock className="h-3 w-3 inline mr-1" />
              {lesson.duration} minutes
            </span>
          )}
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          {lesson.title}
        </h1>
      </div>

      {/* Lesson Content */}
      <Card className="p-6 lg:p-8 mb-6">
        <ContentRenderer
          content={lesson.content}
          lessonQuizzes={lesson.quizzes || []}
          courseId={course.id}
          onQuizComplete={handleQuizComplete}
        />
      </Card>

      {/* Exercises Section (if not inline) */}
      {!hasInlineQuiz && exercises.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Exercises
          </h3>
          <div className="space-y-4">
            {exercises.map((quiz, index) => (
              <CollapsibleExercise
                key={quiz.id}
                quiz={quiz}
                courseId={course.id}
                onComplete={handleQuizComplete}
                exerciseNumber={index + 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Exam Section (if not inline) */}
      {!hasInlineExam && exam && (
        <div className="mb-6">
          {exam.isCompleted ? (
            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    Final Exam - Completed
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    You scored {exam.bestScore}% on this exam.
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Passed (Passing score: {exam.passingScore}%)
                    </Badge>
                    <Badge variant="outline">
                      {exam.attempts} attempt{exam.attempts !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ) : !showExam ? (
            <Card className="p-6 border-l-4 border-l-red-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Final Exam</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Complete this exam to test your knowledge. You need{" "}
                    {exam.passingScore}% to pass.
                  </p>
                  <Button onClick={() => setShowExam(true)} variant="default">
                    Start Exam
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <InlineQuiz
              quiz={exam}
              onComplete={() => {
                handleQuizComplete();
                setShowExam(false);
              }}
              type="exam"
              courseId={course.id}
            />
          )}
        </div>
      )}

      {/* Lesson Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={handleComplete}
          disabled={lesson.isCompleted || isCompleting}
        >
          {lesson.isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Completed
            </>
          ) : isCompleting ? (
            <>
              <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Complete
            </>
          )}
        </Button>

        <Button onClick={onNext} variant="default">
          {isLastLesson ? "Next Module" : "Next Lesson"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
