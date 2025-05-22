import Merger from "@/renderer/components/projects/merger";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/merger/$orgId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Merger />;
}
