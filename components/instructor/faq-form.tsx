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
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FAQ {
  id?: string;
  question: string;
  answer: string;
}

interface FAQFormProps {
  courseId: string;
  courseSlug: string;
  initialFAQs?: FAQ[];
  isEdit?: boolean;
}

export default function FAQForm({
  courseId,
  courseSlug,
  initialFAQs,
  isEdit = false,
}: FAQFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedFAQs, setExpandedFAQs] = useState<Set<number>>(new Set([0]));

  const [faqs, setFaqs] = useState<FAQ[]>(
    initialFAQs
      ? initialFAQs
      : [
          {
            question: "",
            answer: "",
          },
        ]
  );

  const validateForm = (): string | null => {
    for (let index = 0; index < faqs.length; index++) {
      const faq = faqs[index];
      
      if (!faq.question.trim()) {
        return `FAQ ${index + 1}: Question is required`;
      }

      if (!faq.answer.trim()) {
        return `FAQ ${index + 1}: Answer is required`;
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

      if (isEdit && faqs[0]?.id) {
        // Update single FAQ
        url = `/api/instructor/courses/${courseId}/faqs`;
        method = "PUT";
        body = faqs[0];
      } else {
        // Create FAQs
        url = `/api/instructor/courses/${courseId}/faqs`;
        method = "POST";
        body = { faqs };
      }

      const response = await fetch(url, {
        method,
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save FAQs");
      }

      toast({ title: isEdit ? "FAQ updated successfully" : "FAQs created successfully" });
      
      router.push(`/instructor/courses/${courseSlug}/faqs`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast({ title: "Error", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const addFAQ = () => {
    setFaqs([
      ...faqs,
      {
        question: "",
        answer: "",
      },
    ]);
    setExpandedFAQs(new Set([...expandedFAQs, faqs.length]));
  };

  const removeFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
    const newExpanded = new Set(expandedFAQs);
    newExpanded.delete(index);
    setExpandedFAQs(newExpanded);
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    const newFaqs = [...faqs];
    (newFaqs[index] as any)[field] = value;
    setFaqs(newFaqs);
  };

  const toggleFAQExpanded = (index: number) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFAQs(newExpanded);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit FAQ" : "Create FAQs"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEdit
            ? "Update FAQ details"
            : "Create one or more FAQs with questions and answers"}
        </p>
      </div>

      <Card className="py-8">
        <CardHeader>
          <CardTitle>FAQ Information</CardTitle>
          <CardDescription className="py-4">
            Add frequently asked questions and their answers
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}

            {faqs.map((faq, index) => (
              <Collapsible
                key={index}
                open={expandedFAQs.has(index)}
                onOpenChange={() => toggleFAQExpanded(index)}
              >
                <Card className="border-2 py-8">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {expandedFAQs.has(index) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                          <HelpCircle className="h-4 w-4 text-primary" />
                          <CardTitle className="text-lg">
                            {faq.question || `FAQ ${index + 1}`}
                          </CardTitle>
                        </div>
                        {!isEdit && faqs.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFAQ(index);
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
                      <div className="space-y-2">
                        <Label htmlFor={`faq-question-${index}`}>
                          Question *
                        </Label>
                        <Textarea
                          id={`faq-question-${index}`}
                          value={faq.question}
                          onChange={(e) =>
                            updateFAQ(index, "question", e.target.value)
                          }
                          required
                          rows={2}
                          placeholder="Enter your question here"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`faq-answer-${index}`}>
                          Answer *
                        </Label>
                        <Textarea
                          id={`faq-answer-${index}`}
                          value={faq.answer}
                          onChange={(e) =>
                            updateFAQ(index, "answer", e.target.value)
                          }
                          required
                          rows={4}
                          placeholder="Enter the answer here"
                        />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}

            {!isEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={addFAQ}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another FAQ
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
                  "Update FAQ"
                ) : (
                  "Create FAQs"
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
