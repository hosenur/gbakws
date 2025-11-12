import { router, procedure } from "../context";
import { z } from "zod";

export const bloodRouter = router({
  event: procedure
    .input(
      z.object({ id: z.string().optional(), upcoming: z.boolean().optional() }),
    )
    .query(async ({ input, ctx }) => {
      // Example: Get events related to blood donation
      const events = await ctx.prisma.event.findMany({
        where: input.id ? { id: input.id } : undefined,
        include: {
          cause: true,
        },
      });
      return events;
    }),
});
