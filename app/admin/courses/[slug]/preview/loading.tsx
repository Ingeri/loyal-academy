import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCoursePreviewLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Course Overview Skeleton */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="grid gap-2 min-w-[220px]">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-muted/10 bg-muted/5 p-4">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </Card>

      {/* Instructor Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </Card>

      {/* Modules Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-7 w-56 mb-4" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-muted rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-8 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quizzes Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-7 w-64 mb-4" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                {[...Array(2)].map((_, j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* FAQs Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-7 w-24 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-muted rounded-lg p-4 space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </Card>

      {/* Learner Stories Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-muted rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </Card>

      {/* Reviews Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-7 w-24 mb-4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </Card>

      {/* Tags Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-7 w-20 mb-4" />
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
      </Card>
    </div>
  );
}
