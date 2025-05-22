import { createFileRoute } from "@tanstack/react-router";
import ProjectRoute from "@/renderer/components/projects";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProjectRoute />;
}
