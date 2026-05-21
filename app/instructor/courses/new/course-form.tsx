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

interface CourseFormProps {
  categories: Category[];
}

export default function CourseForm({ categories }: CourseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: [""],
    thumbnail: "",
    categoryId: "",
    price: "0",
    level: "BEGINNER",
    duration: "",
    hasCertificate: true,
    hasExam: false,
    conductingType: "Online",
    learningOutcomes: [""],
    careerFields: [""],
    hiringSectors: [""],
    growthPercentage: "",
    estimatedSalary: "",
    expectedIncome: "",
    discount: "",
  });

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

  const addListItem = (field: "learningOutcomes" | "careerFields") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeListItem = (
    field: "learningOutcomes" | "careerFields",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateListItem = (
    field: "learningOutcomes" | "careerFields",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/instructor/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          overview: formData.overview.filter(
            (item: string) => item.trim() !== "",
          ),
          learningOutcomes: formData.learningOutcomes.filter(
            (item) => item.trim() !== "",
          ),
          careerFields: formData.careerFields.filter(
            (item) => item.trim() !== "",
          ),
          hiringSectors: formData.hiringSectors?.filter(
            (item: string) => item.trim() !== "",
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create course");
      }

      router.push(`/instructor/courses/${data.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details to create a new course
        </p>
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

            <div className="space-y-2">
              <Label>Course Overview</Label>
              {formData.overview.map((ov: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={ov}
                    onChange={(e) => updateOverviewItem(index, e.target.value)}
                    rows={4}
                    placeholder="Describe this section of the overview"
                  />
                  {formData.overview.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOverviewItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOverviewItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Overview Section
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  aria-label="Upload thumbnail image"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsLoading(true);
                    try {
                      const url = await uploadFile(file);
                      setFormData((prev) => ({ ...prev, thumbnail: url }));
                    } catch (err) {
                      setError(
                        err instanceof Error ? err.message : "Upload failed",
                      );
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                />
                {formData.thumbnail && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Uploaded: {formData.thumbnail}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, categoryId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="" disabled>
                        No categories available
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, level: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  placeholder="e.g., 8 weeks"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="conductingType">Conducting Type</Label>
                <Select
                  value={formData.conductingType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      conductingType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="OnSite">On Site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <Checkbox
                  id="hasCertificate"
                  checked={formData.hasCertificate}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasCertificate: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="hasCertificate">Include Certificate</Label>

                <Checkbox
                  id="hasExam"
                  checked={formData.hasExam}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasExam: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="hasExam">Include Exam</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Learning Outcomes</Label>
              {formData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={outcome}
                    onChange={(e) =>
                      updateListItem("learningOutcomes", index, e.target.value)
                    }
                    placeholder="e.g., Build responsive websites"
                  />
                  {formData.learningOutcomes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeListItem("learningOutcomes", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListItem("learningOutcomes")}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Learning Outcome
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Career Fields</Label>
              {formData.careerFields.map((field, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={field}
                    onChange={(e) =>
                      updateListItem("careerFields", index, e.target.value)
                    }
                    placeholder="e.g., Software Engineering"
                  />
                  {formData.careerFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeListItem("careerFields", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListItem("careerFields")}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Career Field
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Hiring Sectors</Label>
              {formData.hiringSectors.map((sector: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={sector}
                    onChange={(e) => updateHiringSector(index, e.target.value)}
                    placeholder="e.g., Fintech"
                  />
                  {formData.hiringSectors.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeHiringSector(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addHiringSector}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Hiring Sector
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount ($)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discount: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="growthPercentage">Growth %</Label>
                <Input
                  id="growthPercentage"
                  type="number"
                  step="0.1"
                  value={formData.growthPercentage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      growthPercentage: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedSalary">Estimated Salary</Label>
                <Input
                  id="estimatedSalary"
                  value={formData.estimatedSalary}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      estimatedSalary: e.target.value,
                    }))
                  }
                  placeholder="e.g., $40k - $60k"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedIncome">Expected Income</Label>
                <Input
                  id="expectedIncome"
                  value={formData.expectedIncome}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expectedIncome: e.target.value,
                    }))
                  }
                  placeholder="e.g., $200/month"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
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
