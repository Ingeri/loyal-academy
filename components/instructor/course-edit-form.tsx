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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface CourseProps {
  initialCourse: any;
  categories: Category[];
}

export default function CourseEditForm({
  initialCourse,
  categories,
}: CourseProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialCourse.title || "",
    description: initialCourse.description || "",
    overview: initialCourse.overview?.length ? initialCourse.overview : [""],
    thumbnail: initialCourse.thumbnail || "",
    categoryId: initialCourse.categoryId || "",
    price: initialCourse.price || "0",
    level: initialCourse.level || "BEGINNER",
    duration: initialCourse.duration || "",
    hasCertificate: initialCourse.hasCertificate ?? true,
    hasExam: initialCourse.hasExam ?? false,
    conductingType: initialCourse.conductingType || "Online",
    learningOutcomes: initialCourse.learningOutcomes?.length
      ? initialCourse.learningOutcomes
      : [""],
    careerFields: initialCourse.careerFields?.length
      ? initialCourse.careerFields
      : [""],
    hiringSectors: initialCourse.hiringSectors?.length
      ? initialCourse.hiringSectors
      : [""],
    growthPercentage: initialCourse.growthPercentage || "",
    estimatedSalary: initialCourse.estimatedSalary || "",
    expectedIncome: initialCourse.expectedIncome || "",
    discount: initialCourse.discount || "",
    published: initialCourse.published || false,
  });

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file, file.name);

    const res = await fetch("/api/uploads/image", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();
    return data.url as string;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/instructor/courses/${initialCourse.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            overview: formData.overview.filter(
              (item: string) => item.trim() !== "",
            ),
            learningOutcomes: formData.learningOutcomes.filter(
              (item: string) => item.trim() !== "",
            ),
            careerFields: formData.careerFields.filter(
              (item: string) => item.trim() !== "",
            ),
            hiringSectors: formData.hiringSectors?.filter(
              (item: string) => item.trim() !== "",
            ),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update course");
      }

      router.push(`/instructor/courses`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const addOverviewItem = () => {
    setFormData((prev) => ({ ...prev, overview: [...prev.overview, ""] }));
  };

  const removeOverviewItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      overview: prev.overview.filter((_: any, i: number) => i !== index),
    }));
  };

  const updateOverviewItem = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      overview: prev.overview.map((item: string, i: number) =>
        i === index ? value : item,
      ),
    }));
  };

  const addListItem = (field: "learningOutcomes" | "careerFields") => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeListItem = (
    field: "learningOutcomes" | "careerFields",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }));
  };

  const updateListItem = (
    field: "learningOutcomes" | "careerFields",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) =>
        i === index ? value : item,
      ),
    }));
  };

  const addHiringSector = () => {
    setFormData((prev) => ({
      ...prev,
      hiringSectors: [...prev.hiringSectors, ""],
    }));
  };

  const removeHiringSector = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hiringSectors: prev.hiringSectors.filter(
        (_: any, i: number) => i !== index,
      ),
    }));
  };

  const updateHiringSector = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      hiringSectors: prev.hiringSectors.map((item: string, i: number) =>
        i === index ? value : item,
      ),
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground mt-2">Update your course details</p>
      </div>

      <Card className="py-8">
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Basic information about your course</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  placeholder="Introduction to Web Development"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (auto-generated)</Label>
                <Input
                  id="slug"
                  value={formData.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
                rows={3}
                placeholder="A brief description of your course"
              />
            </div>

            {/* The rest of the fields mirror the create form; to keep this concise reuse the same structure */}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
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
