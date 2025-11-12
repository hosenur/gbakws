import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/testimonial/thanks')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/testimonial/thanks"!</div>
}
