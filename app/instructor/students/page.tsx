"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Award, TrendingUp, Loader2 } from "lucide-react";

interface Enrollment {
  courseId: string;
  courseTitle: string;
  progress: number;
  enrolledAt: string;
  lastUpdated: string;
}

interface QuizScore {
  quizId: string;
  quizTitle: string;
  score: number;
  passingScore: number;
  submittedAt: string;
  courseId: string;
}

interface Certificate {
  courseId: string;
  grade: string;
  finalScore: number;
  issueDate: string;
  certificateNumber: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  enrollments: Enrollment[];
  quizScores: QuizScore[];
  certificates: Certificate[];
}

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/instructor/students");
      
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data.students || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getOverallProgress = (student: Student) => {
    if (student.enrollments.length === 0) return 0;
    const totalProgress = student.enrollments.reduce((sum, e) => sum + e.progress, 0);
    return Math.round(totalProgress / student.enrollments.length);
  };

  const getAverageQuizScore = (student: Student) => {
    if (student.quizScores.length === 0) return 0;
    const totalScore = student.quizScores.reduce((sum, q) => sum + q.score, 0);
    return Math.round(totalScore / student.quizScores.length);
  };

  const getCompletedCourses = (student: Student) => {
    return student.certificates.length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchStudents}>Retry</Button>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Users className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No students enrolled in your courses yet</p>
      </div>
    );
  }

  const totalStudents = students.length;
  const averageProgress = Math.round(
    students.reduce((sum, s) => sum + getOverallProgress(s), 0) / totalStudents
  );
  const totalCertificates = students.reduce((sum, s) => sum + getCompletedCourses(s), 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground mt-2">
          View and manage students enrolled in your courses
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCertificates}</div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card className="py-4">
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
          <CardDescription>
            Students currently enrolled in your courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Courses Enrolled</TableHead>
                <TableHead>Overall Progress</TableHead>
                <TableHead>Avg Quiz Score</TableHead>
                <TableHead>Certificates</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{student.enrollments.length}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{getOverallProgress(student)}%</span>
                      </div>
                      <Progress value={getOverallProgress(student)} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getAverageQuizScore(student) >= 70
                          ? "default"
                          : "secondary"
                      }
                    >
                      {getAverageQuizScore(student)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>{getCompletedCourses(student)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl py-4 w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {selectedStudent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedStudent.name}</CardTitle>
                    <CardDescription>{selectedStudent.email}</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudent(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="enrollments" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
                  <TabsTrigger value="quizzes">Quiz Scores</TabsTrigger>
                  <TabsTrigger value="certificates">Certificates</TabsTrigger>
                </TabsList>

                <TabsContent value="enrollments" className="space-y-4">
                  {selectedStudent.enrollments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No enrollments found
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Enrolled</TableHead>
                          <TableHead>Last Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStudent.enrollments.map((enrollment) => (
                          <TableRow key={enrollment.courseId}>
                            <TableCell className="font-medium">
                              {enrollment.courseTitle}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span>{Math.round(enrollment.progress)}%</span>
                                </div>
                                <Progress
                                  value={enrollment.progress}
                                  className="h-2"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(enrollment.enrolledAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(enrollment.lastUpdated).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="quizzes" className="space-y-4">
                  {selectedStudent.quizScores.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No quiz submissions found
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quiz</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Passing Score</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStudent.quizScores.map((quiz) => (
                          <TableRow key={quiz.quizId}>
                            <TableCell className="font-medium">
                              {quiz.quizTitle}
                            </TableCell>
                            <TableCell>{Math.round(quiz.score)}%</TableCell>
                            <TableCell>{quiz.passingScore}%</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  quiz.score >= quiz.passingScore
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {quiz.score >= quiz.passingScore
                                  ? "Passed"
                                  : "Failed"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(quiz.submittedAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="certificates" className="space-y-4">
                  {selectedStudent.certificates.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No certificates earned yet
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Grade</TableHead>
                          <TableHead>Final Score</TableHead>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Certificate Number</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStudent.certificates.map((cert, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {cert.grade}
                            </TableCell>
                            <TableCell>{Math.round(cert.finalScore)}%</TableCell>
                            <TableCell>
                              {new Date(cert.issueDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {cert.certificateNumber}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
