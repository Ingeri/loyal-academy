import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function CourseSlugLayout({ children }: Props) {
  return <>{children}</>;
}
