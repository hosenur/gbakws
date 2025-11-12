import { MemberUpsertModal } from "@/modals/member-upsert";
import { trpc } from "@/lib/trpc";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gbakws/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@gbakws/ui";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/members/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: members, isLoading } = useQuery(trpc.member.all.queryOptions());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-6">
        <MemberUpsertModal />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
          <CardDescription>
            A list of all registered members including their contact information
            and blood group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader
              columns={[
                { key: "name", title: "Name" },
                { key: "mobile", title: "Mobile" },
                { key: "bloodGroup", title: "Blood Group" },
                { key: "locality", title: "Locality" },
                { key: "district", title: "District" },
                { key: "state", title: "State" },
              ]}
            >
              <TableColumn>Name</TableColumn>
              <TableColumn>Mobile</TableColumn>
              <TableColumn>Blood Group</TableColumn>
              <TableColumn>Locality</TableColumn>
              <TableColumn>District</TableColumn>
              <TableColumn>State</TableColumn>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow
                  key={member.id}
                  columns={[
                    { key: "name", title: "Name" },
                    { key: "mobile", title: "Mobile" },
                    { key: "bloodGroup", title: "Blood Group" },
                    { key: "locality", title: "Locality" },
                    { key: "district", title: "District" },
                    { key: "state", title: "State" },
                  ]}
                >
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.mobile}</TableCell>
                  <TableCell>{member.bloodGroup.replace("_", " ")}</TableCell>
                  <TableCell>{member.locality}</TableCell>
                  <TableCell>{member.district}</TableCell>
                  <TableCell>{member.state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
