import { useParams } from "react-router-dom";
import DCApp from "./pages/dc/src/app/App";
import "./pages/dc/src/styles/index.css";

export default function DesignCourseApp() {
  const { courseId } = useParams<{ courseId: string }>();
  return <DCApp courseId={courseId || ""} />;
}