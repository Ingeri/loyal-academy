"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AssessmentType } from "@prisma/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Option {
  id?: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id?: string;
  text: string;
  options: Option[];
}

interface Quiz {
  id?: string;
  title: string;
  type: AssessmentType;
  passingScore: number;
  questions: Question[];
}

interface QuizFormProps {
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  courseSlug: string;
  level: "course" | "module" | "lesson";
  initialQuiz?: Quiz;
  isEdit?: boolean;
}

const ASSESSMENT_TYPE_OPTIONS: Record<
  string,
  { value: AssessmentType; label: string }[]
> = {
  course: [
    { value: "EXAM", label: "Exam" },
    { value: "TEST", label: "Test" },
    { value: "QUIZ", label: "Quiz" },
    { value: "EXERCISE", label: "Exercise" },
  ],
  module: [
    { value: "QUIZ", label: "Quiz" },
    { value: "TEST", label: "Test" },
    { value: "EXAM", label: "Exam" },
    { value: "EXERCISE", label: "Exercise" },
  ],
  lesson: [
    { value: "EXERCISE", label: "Exercise" },
    { value: "QUIZ", label: "Quiz" },
    { value: "TEST", label: "Test" },
    { value: "EXAM", label: "Exam" },
  ],
};

const DEFAULT_TYPE: Record<string, AssessmentType> = {
  course: "EXAM",
  module: "QUIZ",
  lesson: "EXERCISE",
};

export default function QuizForm({
  courseId,
  moduleId,
  lessonId,
  courseSlug,
  level,
  initialQuiz,
  isEdit = false,
}: QuizFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuizzes, setExpandedQuizzes] = useState<Set<number>>(new Set([0]));
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const [quizzes, setQuizzes] = useState<Quiz[]>(
    initialQuiz
      ? [initialQuiz]
      : [
          {
            title: "",
            type: DEFAULT_TYPE[level],
            passingScore: 70,
            questions: [
              {
                text: "",
                options: [
                  { text: "", isCorrect: false },
                  { text: "", isCorrect: false },
                ],
              },
            ],
          },
        ]
  );

  const validateForm = (): string | null => {
    for (let qIndex = 0; qIndex < quizzes.length; qIndex++) {
      const quiz = quizzes[qIndex];
      
      if (!quiz.title.trim()) {
        return `Quiz ${qIndex + 1}: Title is required`;
      }

      if (quiz.questions.length === 0) {
        return `Quiz "${quiz.title}": At least one question is required`;
      }

      for (let qnIndex = 0; qnIndex < quiz.questions.length; qnIndex++) {
        const question = quiz.questions[qnIndex];
        
        if (!question.text.trim()) {
          return `Quiz "${quiz.title}", Question ${qnIndex + 1}: Question text is required`;
        }

        if (question.options.length < 2) {
          return `Quiz "${quiz.title}", Question ${qnIndex + 1}: At least 2 options are required`;
        }

        if (question.options.length > 5) {
          return `Quiz "${quiz.title}", Question ${qnIndex + 1}: Maximum 5 options allowed`;
        }

        const correctCount = question.options.filter((opt) => opt.isCorrect).length;
        if (correctCount !== 1) {
          return `Quiz "${quiz.title}", Question ${qnIndex + 1}: Exactly one option must be marked as correct`;
        }

        for (let optIndex = 0; optIndex < question.options.length; optIndex++) {
          if (!question.options[optIndex].text.trim()) {
            return `Quiz "${quiz.title}", Question ${qnIndex + 1}, Option ${optIndex + 1}: Option text is required`;
          }
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast({ title: "Validation Error", description: validationError });
      setIsLoading(false);
      return;
    }

    try {
      let url: string;
      let method: string;
      let body: unknown;

      if (isEdit && initialQuiz?.id) {
        url = `/api/instructor/quizzes/${initialQuiz.id}`;
        method = "PUT";
        body = quizzes[0];
      } else {
        if (lessonId) {
          url = `/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes`;
        } else if (moduleId) {
          url = `/api/instructor/courses/${courseId}/modules/${moduleId}/quizzes`;
        } else {
          url = `/api/instructor/courses/${courseId}/quizzes`;
        }
        method = "POST";
        body = { quizzes };
      }

      const response = await fetch(url, {
        method,
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save quiz");
      }

      toast({ title: isEdit ? "Quiz updated successfully" : "Quizzes created successfully" });
      
      if (isEdit) {
        // Redirect based on quiz level
        if (lessonId) {
          router.push(`/instructor/courses/${courseSlug}/modules/${moduleId}/lessons/${lessonId}`);
        } else if (moduleId) {
          router.push(`/instructor/courses/${courseSlug}/modules/${moduleId}`);
        } else {
          router.push(`/instructor/courses/${courseSlug}`);
        }
      } else {
        router.back();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast({ title: "Error", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const addQuiz = () => {
    setQuizzes([
      ...quizzes,
      {
        title: "",
        type: DEFAULT_TYPE[level],
        passingScore: 70,
        questions: [
          {
            text: "",
            options: [
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
            ],
          },
        ],
      },
    ]);
    setExpandedQuizzes(new Set([...expandedQuizzes, quizzes.length]));
  };

  const removeQuiz = (index: number) => {
    setQuizzes(quizzes.filter((_, i) => i !== index));
    const newExpanded = new Set(expandedQuizzes);
    newExpanded.delete(index);
    setExpandedQuizzes(newExpanded);
  };

  const updateQuiz = (index: number, field: keyof Quiz, value: unknown) => {
    const newQuizzes = [...quizzes];
    (newQuizzes[index] as any)[field] = value;
    setQuizzes(newQuizzes);
  };

  const addQuestion = (quizIndex: number) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].questions.push({
      text: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
    setQuizzes(newQuizzes);
  };

  const removeQuestion = (quizIndex: number, questionIndex: number) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].questions = newQuizzes[quizIndex].questions.filter(
      (_, i) => i !== questionIndex
    );
    setQuizzes(newQuizzes);
  };

  const updateQuestion = (quizIndex: number, questionIndex: number, text: string) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].questions[questionIndex].text = text;
    setQuizzes(newQuizzes);
  };

  const addOption = (quizIndex: number, questionIndex: number) => {
    const newQuizzes = [...quizzes];
    if (newQuizzes[quizIndex].questions[questionIndex].options.length < 5) {
      newQuizzes[quizIndex].questions[questionIndex].options.push({
        text: "",
        isCorrect: false,
      });
      setQuizzes(newQuizzes);
    }
  };

  const removeOption = (quizIndex: number, questionIndex: number, optionIndex: number) => {
    const newQuizzes = [...quizzes];
    if (newQuizzes[quizIndex].questions[questionIndex].options.length > 2) {
      newQuizzes[quizIndex].questions[questionIndex].options = newQuizzes[
        quizIndex
      ].questions[questionIndex].options.filter((_, i) => i !== optionIndex);
      setQuizzes(newQuizzes);
    }
  };

  const updateOption = (
    quizIndex: number,
    questionIndex: number,
    optionIndex: number,
    text: string
  ) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].questions[questionIndex].options[optionIndex].text = text;
    setQuizzes(newQuizzes);
  };

  const setCorrectOption = (
    quizIndex: number,
    questionIndex: number,
    optionIndex: number
  ) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].questions[questionIndex].options = newQuizzes[
      quizIndex
    ].questions[questionIndex].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === optionIndex,
    }));
    setQuizzes(newQuizzes);
  };

  const toggleQuizExpanded = (index: number) => {
    const newExpanded = new Set(expandedQuizzes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuizzes(newExpanded);
  };

  const toggleQuestionExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const availableTypes = ASSESSMENT_TYPE_OPTIONS[level];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Quiz" : "Create Quizzes"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEdit
            ? "Update quiz details, questions, and options"
            : "Create one or more quizzes with questions and options"}
        </p>
      </div>

      <Card className="py-8">
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
          <CardDescription className="py-4">
            Target: 5 questions per quiz, 5 options per question
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}

            {quizzes.map((quiz, quizIndex) => {
              const questionIdPrefix = quiz.id ? `edit-${quiz.id}` : `new-${quizIndex}`;
              return (
                <Collapsible
                  key={quizIndex}
                  open={expandedQuizzes.has(quizIndex)}
                  onOpenChange={() => toggleQuizExpanded(quizIndex)}
                >
                  <Card className="border-2 py-8">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {expandedQuizzes.has(quizIndex) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                            <CardTitle className="text-lg">
                              {quiz.title || `Quiz ${quizIndex + 1}`}
                            </CardTitle>
                          </div>
                          {!isEdit && quizzes.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeQuiz(quizIndex);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`quiz-title-${quizIndex}`}>
                              Quiz Title *
                            </Label>
                            <Input
                              id={`quiz-title-${quizIndex}`}
                              value={quiz.title}
                              onChange={(e) =>
                                updateQuiz(quizIndex, "title", e.target.value)
                              }
                              required
                              placeholder="e.g., Module 1 Assessment"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`quiz-type-${quizIndex}`}>
                              Type *
                            </Label>
                            <Select
                              value={quiz.type}
                              onValueChange={(value: AssessmentType) =>
                                updateQuiz(quizIndex, "type", value)
                              }
                            >
                              <SelectTrigger id={`quiz-type-${quizIndex}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTypes.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`quiz-passing-${quizIndex}`}>
                            Passing Score (%)
                          </Label>
                          <Input
                            id={`quiz-passing-${quizIndex}`}
                            type="number"
                            min="0"
                            max="100"
                            value={quiz.passingScore}
                            onChange={(e) =>
                              updateQuiz(
                                quizIndex,
                                "passingScore",
                                parseInt(e.target.value) || 70
                              )
                            }
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Questions ({quiz.questions.length})</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addQuestion(quizIndex)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Question
                            </Button>
                          </div>

                          {quiz.questions.map((question, questionIndex) => {
                            const qId = `${questionIdPrefix}-q${questionIndex}`;
                            const isExpanded = expandedQuestions.has(qId);
                            return (
                              <Collapsible
                                key={questionIndex}
                                open={isExpanded}
                                onOpenChange={() => toggleQuestionExpanded(qId)}
                              >
                                <Card className="border">
                                  <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50 py-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          {isExpanded ? (
                                            <ChevronUp className="h-4 w-4" />
                                          ) : (
                                            <ChevronDown className="h-4 w-4" />
                                          )}
                                          <span className="text-sm font-medium">
                                            {question.text ||
                                              `Question ${questionIndex + 1}`}
                                          </span>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeQuestion(quizIndex, questionIndex);
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </CardHeader>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <CardContent className="space-y-4 pt-4">
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`question-${quizIndex}-${questionIndex}`}
                                        >
                                          Question Text *
                                        </Label>
                                        <Textarea
                                          id={`question-${quizIndex}-${questionIndex}`}
                                          value={question.text}
                                          onChange={(e) =>
                                            updateQuestion(
                                              quizIndex,
                                              questionIndex,
                                              e.target.value
                                            )
                                          }
                                          required
                                          rows={2}
                                          placeholder="Enter your question here"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <Label>
                                            Options ({question.options.length}/5)
                                          </Label>
                                          {question.options.length < 5 && (
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                addOption(quizIndex, questionIndex)
                                              }
                                            >
                                              <Plus className="h-4 w-4 mr-2" />
                                              Add Option
                                            </Button>
                                          )}
                                        </div>

                                        <div className="space-y-2">
                                          <p className="text-sm text-muted-foreground">
                                            Select the radio button next to the correct answer
                                          </p>
                                          <RadioGroup
                                            value={
                                              question.options.findIndex(
                                                (opt) => opt.isCorrect
                                              ).toString()
                                            }
                                            onValueChange={(value) =>
                                              setCorrectOption(
                                                quizIndex,
                                                questionIndex,
                                                parseInt(value)
                                              )
                                            }
                                          >
                                            {question.options.map(
                                              (option, optionIndex) => (
                                                <div
                                                  key={optionIndex}
                                                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                                                    option.isCorrect
                                                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                                                      : "border-border"
                                                  }`}
                                                >
                                                  <RadioGroupItem
                                                    value={optionIndex.toString()}
                                                    id={`option-${quizIndex}-${questionIndex}-${optionIndex}`}
                                                  />
                                                  <Input
                                                    id={`option-${quizIndex}-${questionIndex}-${optionIndex}`}
                                                    value={option.text}
                                                    onChange={(e) =>
                                                      updateOption(
                                                        quizIndex,
                                                        questionIndex,
                                                        optionIndex,
                                                        e.target.value
                                                      )
                                                    }
                                                    required
                                                    placeholder={`Option ${
                                                      optionIndex + 1
                                                    }`}
                                                    className="flex-1"
                                                  />
                                                  {option.isCorrect && (
                                                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                                                      Correct
                                                    </span>
                                                  )}
                                                  {question.options.length > 2 && (
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() =>
                                                        removeOption(
                                                          quizIndex,
                                                          questionIndex,
                                                          optionIndex
                                                        )
                                                      }
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  )}
                                                </div>
                                              )
                                            )}
                                          </RadioGroup>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </CollapsibleContent>
                                </Card>
                              </Collapsible>
                            );
                          })}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}

            {!isEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={addQuiz}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Quiz
              </Button>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEdit ? (
                  "Update Quiz"
                ) : (
                  "Create Quizzes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
