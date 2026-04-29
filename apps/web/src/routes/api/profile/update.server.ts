import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/profile/update/server')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/profile/update"!</div>
}
