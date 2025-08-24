import Profile from "@/renderer/components/profile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welcome/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Profile />;
}
