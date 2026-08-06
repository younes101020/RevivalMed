import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/patient/missions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/patient/missions"!</div>
}
