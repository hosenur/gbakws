import { trpc } from "@/lib/trpc";
import { CauseUpsertModal } from "@/modals/cause-upsert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@gbakws/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/causes/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: causes } = useQuery(trpc.cause.all.queryOptions());
  return (
    <div className="flex flex-col gap-4">
      <div>
        <CauseUpsertModal />
      </div>
      <Card className="[--card-spacing:var(--gutter)]">
        <CardHeader>
          <CardTitle>Causes</CardTitle>
          <CardDescription>Manage users, groups, and roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table
            bleed
            className="[--gutter:var(--card-spacing)] sm:[--gutter:var(--card-spacing)]"
            aria-label="Users"
          >
            <TableHeader>
              <TableColumn isRowHeader>Name</TableColumn>
              <TableColumn>Total Events</TableColumn>
            </TableHeader>
            <TableBody items={causes}>
              {(item) => (
                <TableRow id={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.events.length}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
