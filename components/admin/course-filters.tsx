"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { getCourseInstructors } from "@/lib/actions/admin/courses";

const levels = [
  { value: "all", label: "All Levels" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "true", label: "Published" },
  { value: "false", label: "Draft" },
];

function buildQueryString(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "all") {
      searchParams.set(key, value);
    }
  });

  const result = searchParams.toString();
  return result.length ? `?${result}` : "";
}

export default function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialPublished = searchParams.get("published") ?? "all";
  const initialLevel = searchParams.get("level") ?? "all";
  const initialInstructor = searchParams.get("instructor") ?? "all";

  const [q, setQ] = useState(initialQuery);
  const [published, setPublished] = useState(initialPublished);
  const [level, setLevel] = useState(initialLevel);
  const [instructor, setInstructor] = useState(initialInstructor);
  const [instructors, setInstructors] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getCourseInstructors().then((data) => {
      setInstructors(data.map((inst) => ({ id: inst.id, name: inst.name || "Unknown", email: inst.email })));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setQ(initialQuery);
    setPublished(initialPublished);
    setLevel(initialLevel);
    setInstructor(initialInstructor);
  }, [initialQuery, initialPublished, initialLevel, initialInstructor]);

  const applyFilters = (nextParams: Record<string, string | undefined>) => {
    const query = buildQueryString(nextParams);
    router.replace(`/admin/courses${query}`);
  };

  const handleSearchChange = (value: string) => {
    setQ(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      applyFilters({
        q: value || undefined,
        published,
        level,
        instructor,
      });
    }, 250);
  };

  const handlePublishedChange = (value: string) => {
    setPublished(value);
    applyFilters({
      q,
      published: value,
      level,
      instructor,
    });
  };

  const handleLevelChange = (value: string) => {
    setLevel(value);
    applyFilters({
      q,
      published,
      level: value,
      instructor,
    });
  };

  const handleInstructorChange = (value: string) => {
    setInstructor(value);
    applyFilters({
      q,
      published,
      level,
      instructor: value,
    });
  };

  const publishedValue = useMemo(() => published || "all", [published]);
  const levelValue = useMemo(() => level || "all", [level]);
  const instructorValue = useMemo(() => instructor || "all", [instructor]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={q}
          placeholder="Search courses..."
          className="pl-9"
          onChange={(event) => handleSearchChange(event.target.value)}
        />
      </div>

      <div className="flex gap-2 flex-col sm:flex-row">
        <Select value={publishedValue} onValueChange={handlePublishedChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={levelValue} onValueChange={handleLevelChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={instructorValue} onValueChange={handleInstructorChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Instructor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Instructors</SelectItem>
            {instructors.map((inst) => (
              <SelectItem key={inst.id} value={inst.id}>
                {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
