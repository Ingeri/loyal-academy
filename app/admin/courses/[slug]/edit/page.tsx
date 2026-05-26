import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { redirect } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

async function updateCourseAction(formData: FormData) {
  "use server";

  await checkAdminAccess();

  const slug = formData.get("slug");
  if (typeof slug !== "string") {
    throw new Error("Course slug is required");
  }

  // Checkbox/switch form inputs can be encoded differently depending on the UI component.
  // Treat any presence of the field as checked for robustness.
  const published = formData.get("published") !== null;
  const discountValue = formData.get("discount");
  const priceValue = formData.get("price");
  const conductingType = formData.get("conductingType");
  const hasCertificate = formData.get("hasCertificate") !== null;
  const hasExam = formData.get("hasExam") !== null;

  const updateData: any = {
    published,
    hasCertificate,
    hasExam,
  };

  if (typeof priceValue === "string" && priceValue.trim() !== "") {
    updateData.price = priceValue;
  }

  if (typeof discountValue === "string" && discountValue.trim() !== "") {
    updateData.discount = discountValue;
  } else {
    updateData.discount = null;
  }

  if (typeof conductingType === "string" && conductingType.trim() !== "") {
    updateData.conductingType = conductingType;
  }

  await prisma.course.update({
    where: { slug },
    data: updateData,
  });

  redirect("/admin/courses");
}

type Props = { params: Promise<{ slug?: string }> };

export default async function AdminCourseEditPage({ params }: Props) {
  await checkAdminAccess();

  const resolved = await params;
  const slug = resolved?.slug;

  if (!slug) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Course not found</h1>
        <p className="mt-2 text-muted-foreground">
          Course slug is missing from the URL.
        </p>
        <Link href="/admin/courses">
          <Button className="mt-6">Back to courses</Button>
        </Link>
      </div>
    );
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      published: true,
      discount: true,
      hasCertificate: true,
      hasExam: true,
      price: true,
      conductingType: true,
    },
  });

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Course not found</h1>
        <p className="mt-2 text-muted-foreground">
          The requested course does not exist.
        </p>
        <Link href="/admin/courses">
          <Button className="mt-6">Back to courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <p className="mt-1 text-muted-foreground">
            Only published status, price, discount, certificate, exam and
            conducting type can be updated here.
          </p>
        </div>
        <Link href="/admin/courses">
          <Button variant="outline">Back to Courses</Button>
        </Link>
      </div>

      <Card className="p-6">
        <form action={updateCourseAction} className="space-y-6">
          <input type="hidden" name="slug" value={course.slug} />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={course.price.toString()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                step="0.01"
                defaultValue={course.discount ? course.discount.toString() : ""}
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="conductingType">Conducting Type</Label>
              <Select
                defaultValue={course.conductingType}
                name="conductingType"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select conducting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="OnSite">OnSite</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="published">Publish Status</Label>
              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  name="published"
                  defaultChecked={course.published}
                />
                <span>{course.published ? "Published" : "Draft"}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Switch
                id="hasCertificate"
                name="hasCertificate"
                defaultChecked={course.hasCertificate}
              />
              <Label htmlFor="hasCertificate">Has Certificate</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="hasExam"
                name="hasExam"
                defaultChecked={course.hasExam}
              />
              <Label htmlFor="hasExam">Has Exam</Label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="capitalize">
              Price: ${course.price.toString()}
            </Badge>
            {course.discount && (
              <Badge variant="secondary">
                Discount: ${course.discount.toString()}
              </Badge>
            )}
            <Badge variant={course.published ? "default" : "secondary"}>
              {course.published ? (
                <>
                  <Eye className="inline h-4 w-4 mr-1" /> Published
                </>
              ) : (
                <>
                  <EyeOff className="inline h-4 w-4 mr-1" /> Draft
                </>
              )}
            </Badge>
          </div>

          <Button type="submit">Save changes</Button>
        </form>
      </Card>
    </div>
  );
}
