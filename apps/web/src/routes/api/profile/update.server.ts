import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/profile/update/server')({
  component: RouteComponent,
})

function RouteComponent() {
  return "Hello '/api/profile/update'!";
}
