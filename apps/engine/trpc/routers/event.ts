import { router, procedure } from "../context";
import { z } from "zod";

export const eventRouter = router({
  all: procedure.query(async ({ ctx }) => {
    const events = await ctx.prisma.event.findMany();
    return events;
  }),
});
