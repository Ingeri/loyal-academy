"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Download,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  ShieldAlert,
  BookOpen,
  Briefcase,
  Award,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAllReportsData } from "../actions";
import { formatDistanceToNow } from "date-fns";

interface ReportData {
  enrollmentRevenue: {
    data: Array<{
      title: string;
      level: string;
      activeStudents: number;
      totalEnrollments: number;
      price: number;
      estimatedRevenue: number;
      instructorName: string;
      createdAt: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    };
  };
  outsourcingActivity: {
    data: Array<{
      title: string;
      budget: number;
      status: string;
      companyId: string;
      assignedTalentName: string;
      createdAt: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    };
  };
  scholarshipDisbursement: {
    data: Array<{
      scholarshipTitle: string;
      amount: number;
      donorName: string;
      studentName: string;
      studentEmail: string;
      status: string;
      applicationDate: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    };
  };
  alumniCredentials: {
    data: Array<{
      certificateNumber: string;
      studentName: string;
      studentEmail: string;
      courseTitle: string;
      grade: string;
      finalScore: number;
      issueDate: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    };
  };
  auditLogs: Array<{
    type: "SCHOLARSHIP" | "PROJECT" | "CERTIFICATE";
    title: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
}

interface ReportsClientProps {
  initialData: ReportData;
}

export function ReportsClient({ initialData }: ReportsClientProps) {
  const [data, setData] = useState<ReportData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states for each tab
  const [coursesFilters, setCoursesFilters] = useState({
    searchQuery: "",
    levelFilter: "all",
    startDate: null as Date | null,
    endDate: null as Date | null,
    sortBy: "studentNumber",
    sortOrder: "desc" as "asc" | "desc",
    page: 1,
    pageSize: 50,
  });

  const [projectsFilters, setProjectsFilters] = useState({
    searchQuery: "",
    statusFilter: "all",
    startDate: null as Date | null,
    endDate: null as Date | null,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    page: 1,
    pageSize: 50,
  });

  const [scholarshipsFilters, setScholarshipsFilters] = useState({
    searchQuery: "",
    statusFilter: "all",
    startDate: null as Date | null,
    endDate: null as Date | null,
    sortBy: "submittedAt",
    sortOrder: "desc" as "asc" | "desc",
    page: 1,
    pageSize: 50,
  });

  const [certificatesFilters, setCertificatesFilters] = useState({
    searchQuery: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    sortBy: "issueDate",
    sortOrder: "desc" as "asc" | "desc",
    page: 1,
    pageSize: 50,
  });

  // CSV export utility
  const exportToCSV = <T extends Record<string, any>>(
    records: T[],
    filename: string,
    headers: { key: keyof T; label: string }[],
  ) => {
    const csvContent = [
      headers.map((h) => h.label).join(","),
      ...records.map((row) =>
        headers
          .map((h) => {
            const value = row[h.key];
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value ?? "");
            if (stringValue.includes(",") || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Status badge colors
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      IN_PROGRESS: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
      CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
      IN_REVIEW: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      QUALITY_CHECK: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      APPROVED: "bg-green-500/10 text-green-500 border-green-500/20",
      REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
      PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      ISSUED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return (
      <Badge
        variant="outline"
        className={colors[status] || "bg-gray-500/10 text-gray-500"}
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  // Fetch data with filters
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllReportsData({
        courses: {
          searchQuery: coursesFilters.searchQuery || null,
          levelFilter:
            coursesFilters.levelFilter === "all"
              ? null
              : coursesFilters.levelFilter,
          startDate:
            coursesFilters.startDate?.toISOString().split("T")[0] || null,
          endDate: coursesFilters.endDate?.toISOString().split("T")[0] || null,
          sortBy: coursesFilters.sortBy,
          sortOrder: coursesFilters.sortOrder,
          page: coursesFilters.page,
          pageSize: coursesFilters.pageSize,
        },
        projects: {
          searchQuery: projectsFilters.searchQuery || null,
          statusFilter:
            projectsFilters.statusFilter === "all"
              ? null
              : projectsFilters.statusFilter,
          startDate:
            projectsFilters.startDate?.toISOString().split("T")[0] || null,
          endDate: projectsFilters.endDate?.toISOString().split("T")[0] || null,
          sortBy: projectsFilters.sortBy,
          sortOrder: projectsFilters.sortOrder,
          page: projectsFilters.page,
          pageSize: projectsFilters.pageSize,
        },
        scholarships: {
          searchQuery: scholarshipsFilters.searchQuery || null,
          statusFilter:
            scholarshipsFilters.statusFilter === "all"
              ? null
              : scholarshipsFilters.statusFilter,
          startDate:
            scholarshipsFilters.startDate?.toISOString().split("T")[0] || null,
          endDate:
            scholarshipsFilters.endDate?.toISOString().split("T")[0] || null,
          sortBy: scholarshipsFilters.sortBy,
          sortOrder: scholarshipsFilters.sortOrder,
          page: scholarshipsFilters.page,
          pageSize: scholarshipsFilters.pageSize,
        },
        certificates: {
          searchQuery: certificatesFilters.searchQuery || null,
          startDate:
            certificatesFilters.startDate?.toISOString().split("T")[0] || null,
          endDate:
            certificatesFilters.endDate?.toISOString().split("T")[0] || null,
          sortBy: certificatesFilters.sortBy,
          sortOrder: certificatesFilters.sortOrder,
          page: certificatesFilters.page,
          pageSize: certificatesFilters.pageSize,
        },
      });
      setData(result);
    } catch (error) {
      console.error("Error fetching reports data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    coursesFilters.page,
    coursesFilters.pageSize,
    coursesFilters.searchQuery,
    coursesFilters.levelFilter,
    coursesFilters.startDate,
    coursesFilters.endDate,
    coursesFilters.sortBy,
    coursesFilters.sortOrder,
    projectsFilters.page,
    projectsFilters.pageSize,
    projectsFilters.searchQuery,
    projectsFilters.statusFilter,
    projectsFilters.startDate,
    projectsFilters.endDate,
    projectsFilters.sortBy,
    projectsFilters.sortOrder,
    scholarshipsFilters.page,
    scholarshipsFilters.pageSize,
    scholarshipsFilters.searchQuery,
    scholarshipsFilters.statusFilter,
    scholarshipsFilters.startDate,
    scholarshipsFilters.endDate,
    scholarshipsFilters.sortBy,
    scholarshipsFilters.sortOrder,
    certificatesFilters.page,
    certificatesFilters.pageSize,
    certificatesFilters.searchQuery,
    certificatesFilters.startDate,
    certificatesFilters.endDate,
    certificatesFilters.sortBy,
    certificatesFilters.sortOrder,
  ]);

  // Pagination component
  const Pagination = ({
    pagination,
    onPageChange,
    onPageSizeChange,
    currentPageSize,
  }: {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    };
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    currentPageSize: number;
  }) => (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to{" "}
          {Math.min(
            pagination.currentPage * pagination.pageSize,
            pagination.totalCount,
          )}{" "}
          of {pagination.totalCount} results
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(currentPageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Sortable table header
  const SortableHeader = ({
    children,
    field,
    currentSort,
    onSort,
    className,
  }: {
    children: React.ReactNode;
    field: string;
    currentSort: { sortBy: string; sortOrder: "asc" | "desc" };
    onSort: (field: string) => void;
    className?: string;
  }) => (
    <TableHead
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${className || ""}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {currentSort.sortBy === field && (
          <span className="text-xs">
            {currentSort.sortOrder === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </TableHead>
  );

  // Filter header component
  const FilterHeader = ({
    filters,
    setFilters,
    context,
    onApply,
  }: {
    filters: any;
    setFilters: (filters: any) => void;
    context: "courses" | "projects" | "scholarships" | "certificates";
    onApply: () => void;
  }) => (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/5 border-b">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={filters.searchQuery}
          onChange={(e) =>
            setFilters({ ...filters, searchQuery: e.target.value })
          }
          className="pl-9"
        />
      </div>

      {context === "courses" && (
        <Select
          value={filters.levelFilter}
          onValueChange={(value) =>
            setFilters({ ...filters, levelFilter: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
            <SelectItem value="ADVANCED">Advanced</SelectItem>
          </SelectContent>
        </Select>
      )}

      {(context === "projects" || context === "scholarships") && (
        <Select
          value={filters.statusFilter}
          onValueChange={(value) =>
            setFilters({ ...filters, statusFilter: value })
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {context === "projects" ? (
              <>
                <SelectItem value="OPEN">Pending Approvals Only</SelectItem>
                <SelectItem value="IN_PROGRESS">Active Transactions</SelectItem>
                <SelectItem value="COMPLETED">
                  Completed Archive Blocks
                </SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="PENDING">Pending Approvals Only</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            {filters.startDate || filters.endDate
              ? "Date Filtered"
              : "Date Range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <Calendar
              mode="range"
              selected={{
                from: filters.startDate,
                to: filters.endDate,
              }}
              onSelect={(range) =>
                setFilters({
                  ...filters,
                  startDate: range?.from,
                  endDate: range?.to,
                })
              }
              className="rounded-md border"
            />
          </div>
        </PopoverContent>
      </Popover>

      <Button onClick={onApply} disabled={isLoading} size="sm">
        {isLoading ? "Loading..." : "Apply Filters"}
      </Button>
    </div>
  );

  // Audit log icon mapping
  const getAuditIcon = (type: string) => {
    switch (type) {
      case "SCHOLARSHIP":
        return <DollarSign className="h-4 w-4 text-purple-500" />;
      case "PROJECT":
        return <Briefcase className="h-4 w-4 text-blue-500" />;
      case "CERTIFICATE":
        return <Award className="h-4 w-4 text-emerald-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Reports Export
          </h1>
          <p className="mt-1 text-muted-foreground">
            Tabular auditing and structured data extractions for stakeholders,
            donors, and platform controllers
          </p>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <FilterHeader
                filters={coursesFilters}
                setFilters={setCoursesFilters}
                context="courses"
                onApply={fetchData}
              />
              <div className="rounded-md border max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <SortableHeader
                        field="title"
                        currentSort={coursesFilters}
                        onSort={(field) =>
                          setCoursesFilters({
                            ...coursesFilters,
                            sortBy: field,
                            sortOrder:
                              coursesFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                      >
                        Course Title
                      </SortableHeader>
                      <SortableHeader
                        field="level"
                        currentSort={coursesFilters}
                        onSort={(field) =>
                          setCoursesFilters({
                            ...coursesFilters,
                            sortBy: field,
                            sortOrder:
                              coursesFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                      >
                        Level
                      </SortableHeader>
                      <SortableHeader
                        field="studentNumber"
                        currentSort={coursesFilters}
                        onSort={(field) =>
                          setCoursesFilters({
                            ...coursesFilters,
                            sortBy: field,
                            sortOrder:
                              coursesFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                        className="text-right"
                      >
                        Students
                      </SortableHeader>
                      <SortableHeader
                        field="price"
                        currentSort={coursesFilters}
                        onSort={(field) =>
                          setCoursesFilters({
                            ...coursesFilters,
                            sortBy: field,
                            sortOrder:
                              coursesFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                        className="text-right"
                      >
                        Price
                      </SortableHeader>
                      <SortableHeader
                        field="estimatedRevenue"
                        currentSort={coursesFilters}
                        onSort={(field) =>
                          setCoursesFilters({
                            ...coursesFilters,
                            sortBy: field,
                            sortOrder:
                              coursesFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                        className="text-right"
                      >
                        Revenue
                      </SortableHeader>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.enrollmentRevenue.data.map((course, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {course.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.level}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {course.activeStudents}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(course.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(course.estimatedRevenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {data.enrollmentRevenue.data.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                        >
                          No enrollment data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Pagination
                pagination={data.enrollmentRevenue.pagination}
                onPageChange={(page) =>
                  setCoursesFilters({ ...coursesFilters, page })
                }
                onPageSizeChange={(size) =>
                  setCoursesFilters({
                    ...coursesFilters,
                    pageSize: size,
                    page: 1,
                  })
                }
                currentPageSize={coursesFilters.pageSize}
              />
              <div className="p-4 border-t flex justify-end">
                <Button
                  onClick={() =>
                    exportToCSV(
                      data.enrollmentRevenue.data,
                      "enrollment-revenue-report",
                      [
                        { key: "title", label: "Course Title" },
                        { key: "level", label: "Level" },
                        { key: "activeStudents", label: "Active Students" },
                        { key: "totalEnrollments", label: "Total Enrollments" },
                        { key: "price", label: "Price (USD)" },
                        {
                          key: "estimatedRevenue",
                          label: "Estimated Revenue (USD)",
                        },
                      ],
                    )
                  }
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <FilterHeader
                filters={projectsFilters}
                setFilters={setProjectsFilters}
                context="projects"
                onApply={fetchData}
              />
              <div className="rounded-md border max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <SortableHeader
                        field="title"
                        currentSort={projectsFilters}
                        onSort={(field) =>
                          setProjectsFilters({
                            ...projectsFilters,
                            sortBy: field,
                            sortOrder:
                              projectsFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                      >
                        Project Title
                      </SortableHeader>
                      <SortableHeader
                        field="budget"
                        currentSort={projectsFilters}
                        onSort={(field) =>
                          setProjectsFilters({
                            ...projectsFilters,
                            sortBy: field,
                            sortOrder:
                              projectsFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                        className="text-right"
                      >
                        Budget
                      </SortableHeader>
                      <SortableHeader
                        field="status"
                        currentSort={projectsFilters}
                        onSort={(field) =>
                          setProjectsFilters({
                            ...projectsFilters,
                            sortBy: field,
                            sortOrder:
                              projectsFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                      >
                        Status
                      </SortableHeader>
                      <TableHead>Company ID</TableHead>
                      <TableHead>Assigned Talent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.outsourcingActivity.data.map((project, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {project.title}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(project.budget)}
                        </TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {project.companyId}
                        </TableCell>
                        <TableCell>{project.assignedTalentName}</TableCell>
                      </TableRow>
                    ))}
                    {data.outsourcingActivity.data.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                        >
                          No project data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Pagination
                pagination={data.outsourcingActivity.pagination}
                onPageChange={(page) =>
                  setProjectsFilters({ ...projectsFilters, page })
                }
                onPageSizeChange={(size) =>
                  setProjectsFilters({
                    ...projectsFilters,
                    pageSize: size,
                    page: 1,
                  })
                }
                currentPageSize={projectsFilters.pageSize}
              />
              <div className="p-4 border-t flex justify-end">
                <Button
                  onClick={() =>
                    exportToCSV(
                      data.outsourcingActivity.data,
                      "outsourcing-activity-report",
                      [
                        { key: "title", label: "Project Title" },
                        { key: "budget", label: "Budget (USD)" },
                        { key: "status", label: "Status" },
                        { key: "companyId", label: "Company ID" },
                        { key: "assignedTalentName", label: "Assigned Talent" },
                      ],
                    )
                  }
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships" className="space-y-4">
            <Card>
              <FilterHeader
                filters={scholarshipsFilters}
                setFilters={setScholarshipsFilters}
                context="scholarships"
                onApply={fetchData}
              />
              <div className="rounded-md border max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <SortableHeader
                        field="title"
                        currentSort={scholarshipsFilters}
                        onSort={(field) =>
                          setScholarshipsFilters({
                            ...scholarshipsFilters,
                            sortBy: field,
                            sortOrder:
                              scholarshipsFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                      >
                        Scholarship Title
                      </SortableHeader>
                      <SortableHeader
                        field="amount"
                        currentSort={scholarshipsFilters}
                        onSort={(field) =>
                          setScholarshipsFilters({
                            ...scholarshipsFilters,
                            sortBy: field,
                            sortOrder:
                              scholarshipsFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                        className="text-right"
                      >
                        Amount
                      </SortableHeader>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Application Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.scholarshipDisbursement.data.map(
                      (scholarship, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {scholarship.scholarshipTitle}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(scholarship.amount)}
                          </TableCell>
                          <TableCell>{scholarship.donorName}</TableCell>
                          <TableCell>{scholarship.studentName}</TableCell>
                          <TableCell>
                            {getStatusBadge(scholarship.status)}
                          </TableCell>
                          <TableCell>{scholarship.applicationDate}</TableCell>
                        </TableRow>
                      ),
                    )}
                    {data.scholarshipDisbursement.data.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground py-8"
                        >
                          No scholarship data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Pagination
                pagination={data.scholarshipDisbursement.pagination}
                onPageChange={(page) =>
                  setScholarshipsFilters({ ...scholarshipsFilters, page })
                }
                onPageSizeChange={(size) =>
                  setScholarshipsFilters({
                    ...scholarshipsFilters,
                    pageSize: size,
                    page: 1,
                  })
                }
                currentPageSize={scholarshipsFilters.pageSize}
              />
              <div className="p-4 border-t flex justify-end">
                <Button
                  onClick={() =>
                    exportToCSV(
                      data.scholarshipDisbursement.data,
                      "scholarship-disbursement-report",
                      [
                        { key: "scholarshipTitle", label: "Scholarship Title" },
                        { key: "amount", label: "Amount (USD)" },
                        { key: "donorName", label: "Donor Name" },
                        { key: "studentName", label: "Student Name" },
                        { key: "studentEmail", label: "Student Email" },
                        { key: "status", label: "Status" },
                        { key: "applicationDate", label: "Application Date" },
                      ],
                    )
                  }
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-4">
            <Card>
              <FilterHeader
                filters={certificatesFilters}
                setFilters={setCertificatesFilters}
                context="certificates"
                onApply={fetchData}
              />
              <div className="rounded-md border max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <SortableHeader
                        field="certificateNumber"
                        currentSort={certificatesFilters}
                        onSort={(field) =>
                          setCertificatesFilters({
                            ...certificatesFilters,
                            sortBy: field,
                            sortOrder:
                              certificatesFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                      >
                        Certificate Number
                      </SortableHeader>
                      <SortableHeader
                        field="studentName"
                        currentSort={certificatesFilters}
                        onSort={(field) =>
                          setCertificatesFilters({
                            ...certificatesFilters,
                            sortBy: field,
                            sortOrder:
                              certificatesFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                      >
                        Student Name
                      </SortableHeader>
                      <SortableHeader
                        field="courseTitle"
                        currentSort={certificatesFilters}
                        onSort={(field) =>
                          setCertificatesFilters({
                            ...certificatesFilters,
                            sortBy: field,
                            sortOrder:
                              certificatesFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                      >
                        Course Title
                      </SortableHeader>
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <SortableHeader
                        field="issueDate"
                        currentSort={certificatesFilters}
                        onSort={(field) =>
                          setCertificatesFilters({
                            ...certificatesFilters,
                            sortBy: field,
                            sortOrder:
                              certificatesFilters.sortOrder === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                      >
                        Issue Date
                      </SortableHeader>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.alumniCredentials.data.map((cert, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">
                          {cert.certificateNumber}
                        </TableCell>
                        <TableCell className="font-medium">
                          {cert.studentName}
                        </TableCell>
                        <TableCell>{cert.courseTitle}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{cert.grade}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {cert.finalScore}%
                        </TableCell>
                        <TableCell>{cert.issueDate}</TableCell>
                      </TableRow>
                    ))}
                    {data.alumniCredentials.data.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground py-8"
                        >
                          No certificate data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Pagination
                pagination={data.alumniCredentials.pagination}
                onPageChange={(page) =>
                  setCertificatesFilters({ ...certificatesFilters, page })
                }
                onPageSizeChange={(size) =>
                  setCertificatesFilters({
                    ...certificatesFilters,
                    pageSize: size,
                    page: 1,
                  })
                }
                currentPageSize={certificatesFilters.pageSize}
              />
              <div className="p-4 border-t flex justify-end">
                <Button
                  onClick={() =>
                    exportToCSV(
                      data.alumniCredentials.data,
                      "alumni-credentials-report",
                      [
                        {
                          key: "certificateNumber",
                          label: "Certificate Number",
                        },
                        { key: "studentName", label: "Student Name" },
                        { key: "studentEmail", label: "Student Email" },
                        { key: "courseTitle", label: "Course Title" },
                        { key: "grade", label: "Grade" },
                        { key: "finalScore", label: "Final Score" },
                        { key: "issueDate", label: "Issue Date" },
                      ],
                    )
                  }
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit-logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Audit Activity Stream
                </CardTitle>
                <CardDescription>
                  Chronological platform events from scholarships, projects, and
                  certificates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.auditLogs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/5 border"
                    >
                      <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                        {getAuditIcon(log.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">
                            {log.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(log.timestamp), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {log.description}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(log.status)}
                          <Badge variant="outline" className="text-xs">
                            {log.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {data.auditLogs.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No audit log data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  Data Export Guidelines
                </h3>
                <p className="text-sm text-muted-foreground">
                  All reports are generated using our Supabase connection pooler
                  (Port 6543) with optimized Prisma queries. Data is fetched
                  using selective field queries to minimize memory footprint.
                  CSV exports include the complete dataset for each report
                  category.
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted/50">
                    <FileSpreadsheet className="h-3 w-3" />
                    <span>CSV Format</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted/50">
                    <ShieldAlert className="h-3 w-3" />
                    <span>Admin Only</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Actions Timeline Sidebar */}
      <div className="w-80 space-y-4">
        <Card className="sticky py-4 top-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Actions
            </CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.auditLogs.slice(0, 10).map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/5 border"
                >
                  <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                    {getAuditIcon(log.type)}
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {log.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {log.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(log.timestamp), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {data.auditLogs.length === 0 && (
                <div className="text-center text-muted-foreground py-4 text-sm">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
