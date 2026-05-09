import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/exercices/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Helddlo "/_auth/exercices/"!</div>
}
