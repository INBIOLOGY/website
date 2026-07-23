import { CoursesView } from "@/components/courses-view";
import { courses } from "@/data/mock";

export default function CoursesPage() {
  return <main><CoursesView courses={courses} /></main>;
}
