import { getCategories } from "@/lib/actions/categories";
import CourseForm from "./course-form";

export default async function NewCoursePage() {
  const categories = await getCategories();

  return <CourseForm categories={categories} />;
}
