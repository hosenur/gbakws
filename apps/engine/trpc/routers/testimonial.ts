import { router, procedure } from "../context";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";

export const testimonialRouter = router({
  /**
   * Step 1: Create testimonial link
   */
  createLink: procedure
    .input(
      z.object({
        name: z.string().min(1),
        designation: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { name, designation } = input;

      try {
        const token = createId();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await ctx.prisma.testimonialLink.create({
          data: {
            token,
            name,
            designation,
            isUsed: false,
            expiresAt,
          },
        });

        return { success: true, token, expiresIn: "24 hours" };
      } catch (error) {
        console.error("Error creating testimonial link:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create testimonial link",
        });
      }
    }),

  /**
   * Step 2: Verify token
   */
  verifyToken: procedure
    .input(z.object({ token: z.string() }))
    .output(
      // ✅ inline discriminated union with full type safety
      z.discriminatedUnion("valid", [
        z.object({
          valid: z.literal(true),
          payload: z.object({
            name: z.string(),
            designation: z.string().optional(),
          }),
        }),
        z.object({
          valid: z.literal(false),
          payload: z.null(),
          error: z.string(),
        }),
      ]),
    )
    .query(async ({ input, ctx }) => {
      const { token } = input;

      const link = await ctx.prisma.testimonialLink.findUnique({
        where: { token },
      });

      if (!link) {
        return {
          valid: false,
          payload: null,
          error: "Token not found or revoked",
        } as const;
      }

      if (link.isUsed) {
        return {
          valid: false,
          payload: null,
          error: "Token already used",
        } as const;
      }

      if (link.expiresAt < new Date()) {
        return {
          valid: false,
          payload: null,
          error: "Token has expired",
        } as const;
      }

      return {
        valid: true,
        payload: {
          name: link.name,
          designation: link.designation ?? undefined,
        },
      } as const;
    }),

  /**
   * Step 3: Submit testimonial
   */
  submit: procedure
    .input(
      z.object({
        testimonial: z.string().min(1),
        token: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { testimonial, token } = input;

      const result = await ctx.prisma.$transaction(async (tx) => {
        const link = await tx.testimonialLink.findUnique({
          where: { token },
        });

        if (!link || link.isUsed) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Token invalid or already used",
          });
        }

        if (link.expiresAt < new Date()) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Token has expired",
          });
        }

        const testimonialRecord = await tx.testimonial.create({
          data: {
            testimonial,
            name: link.name,
            designation: link.designation,
            status: "PENDING",
          },
        });

        await tx.testimonialLink.update({
          where: { token },
          data: { isUsed: true },
        });

        return testimonialRecord;
      });

      return { success: true, testimonial: result };
    }),
  approved: procedure.query(async ({ ctx }) => {
    const testimonials = await ctx.prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });
    return testimonials;
  }),
  all: procedure.query(async ({ ctx }) => {
    const testimonials = await ctx.prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return testimonials;
  }),
});
