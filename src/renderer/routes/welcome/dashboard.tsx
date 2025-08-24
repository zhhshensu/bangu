import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/renderer/components/dashboard";

export const Route = createFileRoute("/welcome/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Dashboard />;
}
