import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { defineHandler, handleCors } from "nitro/h3";
import { appRouter } from "~/trpc/root";
import { createContext } from "~/trpc/context";

export default defineHandler((event) => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: event.req,
    router: appRouter,
    createContext,
  });
});
