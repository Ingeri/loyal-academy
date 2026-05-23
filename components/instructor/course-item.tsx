"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function CourseItem({ course }: { course: any }) {
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(Boolean(course.published));
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/instructor/courses/${course.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Delete failed");
      toast({ title: "Course deleted", description: data?.message || "" });
      router.refresh();
    } catch (err: any) {
      toast({ title: "Error", description: String(err.message || err) });
      setLoading(false);
    }
  };

  const togglePublish = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/instructor/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");
      setPublished(Boolean(data.course?.published));
      toast({ title: data.message || "Course updated" });
      router.refresh();
    } catch (err: any) {
      toast({ title: "Error", description: String(err.message || err) });
      setLoading(false);
    }
  };

  const editHref = course.slug
    ? `/instructor/courses/${course.slug}/edit`
    : "/instructor/courses";
  const modulesHref = course.slug
    ? `/instructor/courses/${course.slug}/modules`
    : "/instructor/courses";

  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <Button size="sm" asChild>
          <Link href={modulesHref}>Modules</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={editHref}>Edit</Link>
        </Button>
        <Button
          size="sm"
          onClick={togglePublish}
          disabled={loading || !course.id}
        >
          {published ? "Unpublish" : "Publish"}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete course</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this course? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <CourseCard course={course} />
    </div>
  );
}
