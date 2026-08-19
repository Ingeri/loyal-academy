"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { createFullCourse, type DayInput, type QuestionInput } from "./actions";

function emptyQuestion(): QuestionInput {
  return {
    text: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  };
}

function emptyDay(): DayInput {
  return {
    title: "",
    description: "",
    sessions: [{ title: "", content: "" }],
    examTitle: "",
    passingScore: 70,
    questions: [],
  };
}

export function CourseForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [duration, setDuration] = useState("");
  const [conductingType, setConductingType] = useState("Online");
  const [thumbnail, setThumbnail] = useState("");
  const [days, setDays] = useState<DayInput[]>([emptyDay()]);
  const [openDay, setOpenDay] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateDay(index: number, patch: Partial<DayInput>) {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  function addDay() {
    setDays((prev) => [...prev, emptyDay()]);
    setOpenDay(days.length);
  }

  function removeDay(index: number) {
    setDays((prev) => prev.filter((_, i) => i !== index));
  }

  function addSession(dayIndex: number) {
    updateDay(dayIndex, {
      sessions: [...days[dayIndex].sessions, { title: "", content: "" }],
    });
  }

  function removeSession(dayIndex: number, sessionIndex: number) {
    updateDay(dayIndex, {
      sessions: days[dayIndex].sessions.filter((_, i) => i !== sessionIndex),
    });
  }

  function updateSession(
    dayIndex: number,
    sessionIndex: number,
    patch: Partial<{ title: string; content: string }>
  ) {
    updateDay(dayIndex, {
      sessions: days[dayIndex].sessions.map((s, i) =>
        i === sessionIndex ? { ...s, ...patch } : s
      ),
    });
  }

  function addQuestion(dayIndex: number) {
    updateDay(dayIndex, {
      questions: [...days[dayIndex].questions, emptyQuestion()],
    });
  }

  function removeQuestion(dayIndex: number, questionIndex: number) {
    updateDay(dayIndex, {
      questions: days[dayIndex].questions.filter((_, i) => i !== questionIndex),
    });
  }

  function updateQuestionText(dayIndex: number, questionIndex: number, text: string) {
    updateDay(dayIndex, {
      questions: days[dayIndex].questions.map((q, i) =>
        i === questionIndex ? { ...q, text } : q
      ),
    });
  }

  function updateOptionText(
    dayIndex: number,
    questionIndex: number,
    optionIndex: number,
    text: string
  ) {
    updateDay(dayIndex, {
      questions: days[dayIndex].questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((o, oi) => (oi === optionIndex ? { ...o, text } : o)),
            }
          : q
      ),
    });
  }

  function setCorrectOption(dayIndex: number, questionIndex: number, optionIndex: number) {
    updateDay(dayIndex, {
      questions: days[dayIndex].questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((o, oi) => ({ ...o, isCorrect: oi === optionIndex })),
            }
          : q
      ),
    });
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        await createFullCourse({
          title,
          description,
          price: parseFloat(price) || 0,
          duration,
          conductingType,
          thumbnail,
          days,
        });
      } catch (err: any) {
        // NEXT_REDIRECT throws internally on success — only show real errors
        if (err?.message && !err.message.includes("NEXT_REDIRECT")) {
          setError(err.message);
        }
      }
    });
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="p-6">
        <h2 className="mb-4 font-bold text-foreground">Course Details</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
              placeholder="e.g. Career Guidance & Professional Orientation"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 5 Days"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="conductingType">Format</Label>
            <select
              id="conductingType"
              value={conductingType}
              onChange={(e) => setConductingType(e.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="Online">Online</option>
              <option value="OnSite">On-Site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <Label htmlFor="thumbnail">Thumbnail Image URL (optional)</Label>
            <Input
              id="thumbnail"
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      {days.map((day, dayIndex) => (
        <Card key={dayIndex} className="p-6">
          <button
            type="button"
            onClick={() => setOpenDay(openDay === dayIndex ? -1 : dayIndex)}
            className="flex w-full items-center justify-between text-left"
          >
            <h2 className="font-bold text-foreground">
              Day {dayIndex + 1}
              {day.title ? `: ${day.title}` : ""}
            </h2>
            {openDay === dayIndex ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {openDay === dayIndex && (
            <div className="mt-5 space-y-6">
              <div>
                <Label>Day Title</Label>
                <Input
                  value={day.title}
                  onChange={(e) => updateDay(dayIndex, { title: e.target.value })}
                  placeholder="e.g. Understanding Yourself Before Choosing a Career"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Day Description</Label>
                <Textarea
                  value={day.description}
                  onChange={(e) => updateDay(dayIndex, { description: e.target.value })}
                  rows={2}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="mb-2 block">Sessions</Label>
                <div className="space-y-4">
                  {day.sessions.map((session, sessionIndex) => (
                    <div key={sessionIndex} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Session {sessionIndex + 1}
                        </span>
                        {day.sessions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSession(dayIndex, sessionIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <Input
                        value={session.title}
                        onChange={(e) =>
                          updateSession(dayIndex, sessionIndex, { title: e.target.value })
                        }
                        placeholder="Session title"
                        className="mb-2"
                      />
                      <Textarea
                        value={session.content}
                        onChange={(e) =>
                          updateSession(dayIndex, sessionIndex, { content: e.target.value })
                        }
                        placeholder="Session content"
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSession(dayIndex)}
                  className="mt-3 gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Session
                </Button>
              </div>

              <div className="rounded-lg border-2 border-dashed border-accent/40 p-4">
                <Label className="mb-2 block font-semibold">
                  Day {dayIndex + 1} Exam (optional)
                </Label>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <Input
                    value={day.examTitle}
                    onChange={(e) => updateDay(dayIndex, { examTitle: e.target.value })}
                    placeholder={`Exam title (e.g. Day ${dayIndex + 1} Exam)`}
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={day.passingScore}
                    onChange={(e) =>
                      updateDay(dayIndex, { passingScore: parseInt(e.target.value) || 70 })
                    }
                    placeholder="Passing score %"
                  />
                </div>

                <div className="space-y-4">
                  {day.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Question {questionIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeQuestion(dayIndex, questionIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <Input
                        value={question.text}
                        onChange={(e) =>
                          updateQuestionText(dayIndex, questionIndex, e.target.value)
                        }
                        placeholder="Question text"
                        className="mb-3"
                      />
                      <p className="mb-2 text-xs text-muted-foreground">
                        Select the radio button next to the correct answer
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`day${dayIndex}-question${questionIndex}-correct`}
                              checked={option.isCorrect}
                              onChange={() =>
                                setCorrectOption(dayIndex, questionIndex, optionIndex)
                              }
                            />
                            <Input
                              value={option.text}
                              onChange={(e) =>
                                updateOptionText(
                                  dayIndex,
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addQuestion(dayIndex)}
                  className="mt-3 gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Question
                </Button>
              </div>

              {days.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeDay(dayIndex)}
                  className="gap-1 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Remove Day {dayIndex + 1}
                </Button>
              )}
            </div>
          )}
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addDay} className="w-full gap-1">
        <Plus className="h-4 w-4" /> Add Another Day
      </Button>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full py-6 text-base font-semibold"
      >
        {isPending ? "Submitting..." : "Submit Course for Review"}
      </Button>
    </div>
  );
}