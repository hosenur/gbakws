import { useForm, revalidateLogic } from "@tanstack/react-form";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Note,
} from "@gbakws/ui";
import { Button } from "@gbakws/ui";
import { Input, TextField } from "@gbakws/ui";
import { Label, FieldError } from "@gbakws/ui";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface TestimonialLinkFormProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const testimonialLinkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, " Designation is required"),
});

export function TestimonialLinkUpsertModal({
  isOpen,
  onClose,
}: TestimonialLinkFormProps) {
  const create = useMutation(trpc.testimonial.createLink.mutationOptions());
  const [token, setToken] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      designation: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: testimonialLinkSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await create.mutateAsync(value);
      setToken(result.token);
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Token copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy token");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <ModalTrigger>
        <Button>Create Testimonial Link</Button>
      </ModalTrigger>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>Create Testimonial Link</ModalTitle>
          <ModalDescription>
            Generate a secure link for someone to submit their testimonial.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          {token ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mb-4">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800">
                    Testimonial Link Created!
                  </h3>
                  <p className="text-sm text-muted-fg mt-1">
                    Share this secure link with the person to submit their
                    testimonial.
                  </p>
                </div>

                <div className="">
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      value={`${window.location.origin}/testimonial?token=${token}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `${window.location.origin}/testimonial?token=${token}`
                        )
                      }
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <Note intent="info">
                  The Link Will Expire in 24 Hours for Security Reasons.
                </Note>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field name="name">
                {(field) => (
                  <TextField errors={field.state.meta.errors}>
                    <Label htmlFor={field.name}>Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter person's full name"
                      onBlur={field.handleBlur}
                    />
                    <FieldError>
                      {field.state.meta.errors.map((error) => error?.message)}
                    </FieldError>
                  </TextField>
                )}
              </form.Field>

              <form.Field name="designation">
                {(field) => (
                  <TextField errors={field.state.meta.errors}>
                    <Label htmlFor={field.name}>Designation</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter job title or role (optional)"
                      onBlur={field.handleBlur}
                    />
                    <FieldError>
                      {field.state.meta.errors.map((error) => error?.message)}
                    </FieldError>
                  </TextField>
                )}
              </form.Field>
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          {token ? (
            <ModalClose>Done</ModalClose>
          ) : (
            <>
              <ModalClose>Cancel</ModalClose>
              <Button
                type="submit"
                onClick={() => form.handleSubmit()}
                isDisabled={!form.state.canSubmit || create.isPending}
              >
                {create.isPending ? "Creating..." : "Create Link"}
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
