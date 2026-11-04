import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor-register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/vendor-register"!</div>
}
