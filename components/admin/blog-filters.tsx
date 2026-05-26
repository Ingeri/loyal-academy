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

interface BlogFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>;
}

export default function BlogFilters({ categories }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialPublished = searchParams.get("published") ?? "all";
  const initialCategory = searchParams.get("category") ?? "all";

  const [q, setQ] = useState(initialQuery);
  const [published, setPublished] = useState(initialPublished);
  const [category, setCategory] = useState(initialCategory);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQ(initialQuery);
    setPublished(initialPublished);
    setCategory(initialCategory);
  }, [initialQuery, initialPublished, initialCategory]);

  const applyFilters = (nextParams: Record<string, string | undefined>) => {
    const query = buildQueryString(nextParams);
    router.replace(`/admin/blogs${query}`);
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
        category,
      });
    }, 250);
  };

  const handlePublishedChange = (value: string) => {
    setPublished(value);
    applyFilters({
      q,
      published: value,
      category,
    });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    applyFilters({
      q,
      published,
      category: value,
    });
  };

  const publishedValue = useMemo(() => published || "all", [published]);
  const categoryValue = useMemo(() => category || "all", [category]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={q}
          placeholder="Search blogs..."
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
        <Select value={categoryValue} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
