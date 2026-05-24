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
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface LearnerStory {
  id?: string;
  name: string;
  role?: string;
  story: string;
  image?: string;
}

interface LearnerStoryFormProps {
  courseId: string;
  courseSlug: string;
  initialStories?: LearnerStory[];
  isEdit?: boolean;
}

export default function LearnerStoryForm({
  courseId,
  courseSlug,
  initialStories,
  isEdit = false,
}: LearnerStoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStories, setExpandedStories] = useState<Set<number>>(new Set([0]));

  const [learnerStories, setLearnerStories] = useState<LearnerStory[]>(
    initialStories
      ? initialStories
      : [
          {
            name: "",
            role: "",
            story: "",
            image: "",
          },
        ]
  );

  const validateForm = (): string | null => {
    for (let index = 0; index < learnerStories.length; index++) {
      const story = learnerStories[index];
      
      if (!story.name.trim()) {
        return `Learner Story ${index + 1}: Name is required`;
      }

      if (!story.story.trim()) {
        return `Learner Story ${index + 1}: Story is required`;
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

      if (isEdit && learnerStories[0]?.id) {
        // Update single learner story
        url = `/api/instructor/courses/${courseId}/learner-stories`;
        method = "PUT";
        body = learnerStories[0];
      } else {
        // Create learner stories
        url = `/api/instructor/courses/${courseId}/learner-stories`;
        method = "POST";
        body = { learnerStories };
      }

      const response = await fetch(url, {
        method,
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save learner stories");
      }

      toast({ title: isEdit ? "Learner story updated successfully" : "Learner stories created successfully" });
      
      router.push(`/instructor/courses/${courseSlug}/learner-stories`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast({ title: "Error", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const addLearnerStory = () => {
    setLearnerStories([
      ...learnerStories,
      {
        name: "",
        role: "",
        story: "",
        image: "",
      },
    ]);
    setExpandedStories(new Set([...expandedStories, learnerStories.length]));
  };

  const removeLearnerStory = (index: number) => {
    setLearnerStories(learnerStories.filter((_, i) => i !== index));
    const newExpanded = new Set(expandedStories);
    newExpanded.delete(index);
    setExpandedStories(newExpanded);
  };

  const updateLearnerStory = (index: number, field: keyof LearnerStory, value: string) => {
    const newStories = [...learnerStories];
    (newStories[index] as any)[field] = value;
    setLearnerStories(newStories);
  };

  const toggleStoryExpanded = (index: number) => {
    const newExpanded = new Set(expandedStories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedStories(newExpanded);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Learner Story" : "Create Learner Stories"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEdit
            ? "Update learner story details"
            : "Create one or more learner stories with testimonials"}
        </p>
      </div>

      <Card className="py-8">
        <CardHeader>
          <CardTitle>Learner Story Information</CardTitle>
          <CardDescription className="py-4">
            Add learner testimonials and success stories
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}

            {learnerStories.map((story, index) => (
              <Collapsible
                key={index}
                open={expandedStories.has(index)}
                onOpenChange={() => toggleStoryExpanded(index)}
              >
                <Card className="border-2 py-8">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {expandedStories.has(index) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                          <UserCircle className="h-4 w-4 text-primary" />
                          <CardTitle className="text-lg">
                            {story.name || `Learner Story ${index + 1}`}
                          </CardTitle>
                        </div>
                        {!isEdit && learnerStories.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeLearnerStory(index);
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
                        <Label htmlFor={`story-name-${index}`}>
                          Name *
                        </Label>
                        <Input
                          id={`story-name-${index}`}
                          value={story.name}
                          onChange={(e) =>
                            updateLearnerStory(index, "name", e.target.value)
                          }
                          required
                          placeholder="e.g., John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`story-role-${index}`}>
                          Role (Optional)
                        </Label>
                        <Input
                          id={`story-role-${index}`}
                          value={story.role || ""}
                          onChange={(e) =>
                            updateLearnerStory(index, "role", e.target.value)
                          }
                          placeholder="e.g., Software Engineer at Google"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`story-image-${index}`}>
                          Image URL (Optional)
                        </Label>
                        <Input
                          id={`story-image-${index}`}
                          value={story.image || ""}
                          onChange={(e) =>
                            updateLearnerStory(index, "image", e.target.value)
                          }
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`story-content-${index}`}>
                          Story *
                        </Label>
                        <Textarea
                          id={`story-content-${index}`}
                          value={story.story}
                          onChange={(e) =>
                            updateLearnerStory(index, "story", e.target.value)
                          }
                          required
                          rows={6}
                          placeholder="Share the learner's success story and experience with the course"
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
                onClick={addLearnerStory}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Learner Story
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
                  "Update Learner Story"
                ) : (
                  "Create Learner Stories"
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
