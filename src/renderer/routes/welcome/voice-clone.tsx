import { createFileRoute } from "@tanstack/react-router";
import VoiceClone from "@/renderer/components/VoiceClone";

export const Route = createFileRoute("/welcome/voice-clone")({
  component: RouteComponent,
});

function RouteComponent() {
  return <VoiceClone />;
}
