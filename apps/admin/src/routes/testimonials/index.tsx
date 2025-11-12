import { TestimonialLinkUpsertModal } from "@/modals/testimonial-link-upsert";
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
import { Button } from "@gbakws/ui";

export const Route = createFileRoute("/testimonials/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <TestimonialLinkUpsertModal />
    </div>
  );
}
