import { router, procedure } from "./context";
import { z } from "zod";
import { bloodRouter } from "./routers/blood";
import { causeRouter } from "./routers/cause";
import { eventRouter } from "./routers/event";
import { memberRouter } from "./routers/member";
import { testimonialRouter } from "./routers/testimonial";
import type { Context } from "./context";

type User = {
  id: string;
  name: string;
  bio?: string;
};
const users: Record<string, User> = {};

export const appRouter = router({
  greeting: procedure
    .input(
      z.object({
        name: z.string().optional(),
      })
    )
    .query(({ input }) => {
      return `hello ${input.name ?? "world"}`;
    }),
  blood: bloodRouter,
  cause: causeRouter,
  event: eventRouter,
  member: memberRouter,
  testimonial: testimonialRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
