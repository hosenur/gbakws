import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import {
  Card,
  CardContent,
  Button,
  Textarea,
  Label,
  FieldError,
  TextField,
} from "@gbakws/ui";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";

const testimonialSchema = z.object({
  testimonial: z
    .string()
    .min(10, "Testimonial must be at least 10 characters long."),
});

export const Route = createFileRoute("/testimonial/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { token } = useSearch({ from: "/testimonial/" }) as { token?: string };

  // ✅ Handle missing token early
  if (!token) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h3 className="text-lg font-medium text-red-800">
          Missing Testimonial Token
        </h3>
        <p className="text-sm text-muted-fg mt-2">
          The link you used is invalid or incomplete. Please check with the
          sender.
        </p>
      </div>
    );
  }

  // ✅ Verify token via TRPC (CUID-based)
  const { data, isLoading, isError, error } = useQuery(
    trpc.testimonial.verifyToken.queryOptions({ token }, { enabled: !!token })
  );
  console.log({ error });

  // ✅ Submit testimonial mutation (CUID-based)
  const submit = useMutation(
    trpc.testimonial.submit.mutationOptions({
      onSuccess: () => {
        toast.success("Testimonial submitted successfully!");
        navigate({ to: "/testimonial/thanks" });
      },
      onError: () => {
        toast.error("Failed to submit testimonial");
      },
    })
  );

  // ✅ TanStack Form with Zod integration
  const form = useForm({
    defaultValues: { testimonial: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onSubmit: testimonialSchema,
    },
    onSubmit: async ({ value }) => {
      if (!data?.valid || !token) {
        toast.error("Invalid or expired testimonial link");
        return;
      }

      await submit.mutateAsync({
        testimonial: value.testimonial,
        token,
      });
      form.reset();
    },
  });

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium">
              Verifying testimonial link...
            </h3>

            <p className="text-sm text-muted-fg mt-1">
              Please wait while we verify your access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Invalid token state
  if (!data?.valid) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-800">
          Invalid Testimonial Link
        </h3>
        <p className="text-sm text-muted-fg mt-2">{data?.error}</p>
        <p className="text-sm text-muted-fg mt-2">
          Please contact the person who sent you this link for a new one.
        </p>
      </div>
    );
  }

  const { name, designation } = data.payload;

  // ✅ Main Form
  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col gap-4">
      <div>
        <h1 className="font-medium">
          Namaste, <span className="text-primary">{name}</span>
        </h1>
        <p className="text-muted-fg text-sm">
          Galsi Burdwan Abdul Kalam Welfare Society has invited you to submit a
          testimonial. Please note this invitation is personal and should not be
          shared. The testimonial will be publicly visible on our website.
        </p>
      </div>

      <div className="flex flex-row items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-200" />
        <div>
          <h1>{name}</h1>
          <p className="text-muted-fg text-sm">{designation}</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="testimonial">
          {(field) => (
            <TextField>
              <Label htmlFor={field.name}>Your Testimonial</Label>
              <Textarea
                id={field.name}
                name={field.name}
                rows={6}
                placeholder="Start typing your testimonial here..."
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={!!field.state.meta.errors.length}
              />
              <FieldError>
                {field.state.meta.errors.map((err) => err?.message)}
              </FieldError>
            </TextField>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              isDisabled={
                !canSubmit || isSubmitting || submit.isPending || !data?.valid
              }
            >
              {isSubmitting || submit.isPending ? "Submitting..." : "Submit"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
