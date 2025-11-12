import { router, procedure } from "../context";
import { z } from "zod";

export const causeRouter = router({
  all: procedure.query(async ({ ctx }) => {
    const causes = await ctx.prisma.cause.findMany({
      include: { events: true },
    });
    return causes;
  }),
  create: procedure
    .input(z.object({ title: z.string().min(1), slug: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const newCause = await ctx.prisma.cause.create({
        data: {
          title: input.title,
          slug: input.slug,
        },
      });
      return newCause;
    }),
});
