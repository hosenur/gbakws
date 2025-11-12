import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/donate/clothes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/donate/clothes"!</div>
}
