import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/change-password/server')({
  component: RouteComponent,
})

function RouteComponent() {
  return "Hello '/api/auth/change-password'!";
}
