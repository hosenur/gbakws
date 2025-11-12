import { router, procedure } from "../context";
import { z } from "zod";

const BloodGroup = {
  A_POSITIVE: "A_POSITIVE",
  A_NEGATIVE: "A_NEGATIVE",
  B_POSITIVE: "B_POSITIVE",
  B_NEGATIVE: "B_NEGATIVE",
  AB_POSITIVE: "AB_POSITIVE",
  AB_NEGATIVE: "AB_NEGATIVE",
  O_POSITIVE: "O_POSITIVE",
  O_NEGATIVE: "O_NEGATIVE",
} as const;

type BloodGroupType = (typeof BloodGroup)[keyof typeof BloodGroup];

export const memberRouter = router({
  all: procedure.query(async ({ ctx }) => {
    const members = await ctx.prisma.member.findMany();
    return members;
  }),
  create: procedure
    .input(
      z.object({
        name: z.string().min(1),
        mobile: z
          .string()
          .min(10)
          .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
        adhaar: z
          .string()
          .min(12)
          .regex(/^\d{12}$/, "Please enter a valid 12-digit Adhaar number"),
        bloodGroup: z
          .string()
          .refine(
            (val) =>
              [
                "A_POSITIVE",
                "A_NEGATIVE",
                "B_POSITIVE",
                "B_NEGATIVE",
                "AB_POSITIVE",
                "AB_NEGATIVE",
                "O_POSITIVE",
                "O_NEGATIVE",
              ].includes(val),
            {
              message: "Invalid blood group",
            },
          ),
        locality: z.string().min(1),
        district: z.string().min(1),
        state: z.string().min(1),
        zip: z
          .string()
          .min(6)
          .regex(/^\d{6}$/, "Please enter a valid 6-digit ZIP code"),
        sendWelcomeMessage: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log("Creating member with data:", input);

      const newMember = await ctx.prisma.member.create({
        data: {
          name: input.name,
          mobile: input.mobile,
          adhaar: input.adhaar,
          bloodGroup: input.bloodGroup as BloodGroupType,
          locality: input.locality,
          district: input.district,
          state: input.state,
          zip: input.zip,
          sendWelcomeMessage: input.sendWelcomeMessage,
        },
      });

      console.log("Member created successfully:", newMember);
      return newMember;
    }),
  check: procedure
    .input(
      z
        .object({
          mobile: z
            .string()
            .min(10)
            .regex(
              /^[6-9]\d{9}$/,
              "Please enter a valid 10-digit mobile number",
            )
            .optional(),
          adhaar: z
            .string()
            .min(12)
            .regex(/^\d{12}$/, "Please enter a valid 12-digit Adhaar number")
            .optional(),
        })
        .refine((data) => data.mobile || data.adhaar, {
          message: "Either mobile or adhaar number must be provided",
        }),
    )
    .query(async ({ input, ctx }) => {
      let member = null;

      if (input.mobile) {
        member = await ctx.prisma.member.findUnique({
          where: { mobile: input.mobile },
        });
      } else if (input.adhaar) {
        member = await ctx.prisma.member.findUnique({
          where: { adhaar: input.adhaar },
        });
      }

      return { duplicate: !!member };
    }),
});
