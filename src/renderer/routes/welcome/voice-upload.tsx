import { createFileRoute } from '@tanstack/react-router'
import VoiceUpload from "@/renderer/components/VoiceUpload";

export const Route = createFileRoute('/welcome/voice-upload')({
  component: RouteComponent,
})

function RouteComponent() {
  return <VoiceUpload/>
}
