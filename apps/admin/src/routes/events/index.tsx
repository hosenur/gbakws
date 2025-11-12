import { trpc } from "@/lib/trpc";
import { EventUpsertModal } from "@/modals/event-upsert";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/events/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: events } = useQuery(trpc.event.all.queryOptions());
  return (
    <div>
      <EventUpsertModal />
    </div>
  );
}
