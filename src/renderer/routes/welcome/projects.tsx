import { createFileRoute } from '@tanstack/react-router'
import Projects from '@/renderer/components/projects'

export const Route = createFileRoute('/welcome/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Projects />
}
