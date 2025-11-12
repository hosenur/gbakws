import { useForm, revalidateLogic } from "@tanstack/react-form";
import {
  InputGroup,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle
} from "@gbakws/ui";
import { Button } from "@gbakws/ui";
import { Input, TextField } from "@gbakws/ui";
import { Label, FieldError } from "@gbakws/ui";
import { z } from "zod";
import { BoltIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

interface CauseFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  cause?: {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
  };
}

const causeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z.string(),
});

export function CauseUpsertModal({ isOpen, onClose, cause }: CauseFormProps) {
  const create = useMutation(trpc.cause.create.mutationOptions());
  const form = useForm({
    defaultValues: {
      title: cause?.title || "",
      slug: cause?.slug || "",
      description: cause?.description || "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: causeSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
      create.mutate(value);
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <Button>{cause?.id ? "Edit Cause" : "Add Cause"}</Button>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{cause?.id ? "Edit Cause" : "Add New Cause"}</ModalTitle>
          <ModalDescription>
            Fill in the cause details below. Title and slug are required.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="title">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                    }}
                    placeholder="Enter cause title"
                    onBlur={field.handleBlur}
                  />
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field
              validators={{
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }) => {
                  try {
                    const res = await fetch(
                      `http://localhost:4000/cause?slug=${value}`
                    );
                    if (!res.ok) throw new Error("Member not found");
                    const data = await res.json();
                    if (data.exists) {
                      return [{ message: "Slug already exists" }];
                    }
                  } catch (error) {
                    console.error("Error fetching member:", error);
                  } finally {
                  }
                },
              }}
              name="slug"
            >
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>Slug</Label>
                  <InputGroup className="[--input-gutter-end:--spacing(12)]">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter URL-friendly slug"
                      onBlur={field.handleBlur}
                    />
                    <Button
                      onClick={() =>
                        form.setFieldValue(
                          "slug",
                          generateSlug(form.getFieldValue("title"))
                        )
                      }
                      type="button"
                      intent="plain"
                    >
                      <BoltIcon />
                    </Button>
                  </InputGroup>
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>Description</Label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter cause description (optional)"
                    onBlur={field.handleBlur}
                    className="w-full min-h-[100px] rounded-lg border border-input px-3 py-2 text-sm focus:border-ring/70 focus:outline-hidden focus:ring-3 focus:ring-ring/20 resize-none"
                  />
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>
          </form>
        </ModalBody>
        <ModalFooter>
          <ModalClose>Cancel</ModalClose>
          <Button
            type="submit"
            onClick={() => form.handleSubmit()}
            isDisabled={!form.state.canSubmit}
          >
            {cause?.id ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
