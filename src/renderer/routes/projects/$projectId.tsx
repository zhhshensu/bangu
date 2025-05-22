import ProjectDetail from "@/renderer/components/projects/detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ProjectDetail />
    </div>
  );
}
