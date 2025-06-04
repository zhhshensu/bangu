import { createFileRoute } from "@tanstack/react-router";
import VoiceLibrary from "@/renderer/components/VoiceLibrary";

export const Route = createFileRoute("/welcome/voice-library")({
  component: RouteComponent,
});

function RouteComponent() {
  return <VoiceLibrary />;
}
