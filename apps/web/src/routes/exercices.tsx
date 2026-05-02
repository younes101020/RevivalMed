import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exercices')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/exercices"!</div>
}
