import Settings from "@/renderer/components/settings/SettingsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welcome/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Settings />;
}
