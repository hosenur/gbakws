import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data: members } = useQuery(
    trpc.greeting.queryOptions({ name: "Admin" })
  );
  console.log({ members });

  return <div></div>;
}
