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
} from "@gbakws/ui";
import { Button, Checkbox } from "@gbakws/ui";
import { Input, TextField } from "@gbakws/ui";
import { Label, FieldError } from "@gbakws/ui";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@gbakws/ui";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

interface MemberFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  member?: {
    id?: string;
    name?: string;
    mobile?: string;
    adhaar?: string;
    bloodGroup?: string;
    locality?: string;
    district?: string;
    state?: string;
    zip?: string;
  };
}

const BLOOD_GROUP_VALUES = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const;

const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  adhaar: z
    .string()
    .min(12, "Adhaar number must be 12 digits")
    .regex(/^\d{12}$/, "Please enter a valid 12-digit Adhaar number"),
  bloodGroup: z
    .string()
    .refine((val) => BLOOD_GROUP_VALUES.includes(val as any), {
      message: "Invalid blood group",
    }),
  locality: z.string().min(1, "Locality is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  zip: z
    .string()
    .min(6, "ZIP code must be at least 6 digits")
    .regex(/^\d{6}$/, "Please enter a valid 6-digit ZIP code"),
  sendWelcomeMessage: z.boolean(),
});

const BLOOD_GROUPS = [
  { id: "A_POSITIVE", name: "A+" },
  { id: "A_NEGATIVE", name: "A-" },
  { id: "B_POSITIVE", name: "B+" },
  { id: "B_NEGATIVE", name: "B-" },
  { id: "AB_POSITIVE", name: "AB+" },
  { id: "AB_NEGATIVE", name: "AB-" },
  { id: "O_POSITIVE", name: "O+" },
  { id: "O_NEGATIVE", name: "O-" },
];

export function MemberUpsertModal({
  isOpen,
  onClose,
  member,
}: MemberFormProps) {
  const create = useMutation(trpc.member.create.mutationOptions());

  const form = useForm({
    defaultValues: {
      name: member?.name || "",
      mobile: member?.mobile || "",
      adhaar: member?.adhaar || "",
      bloodGroup: member?.bloodGroup || "",
      locality: member?.locality || "",
      district: member?.district || "",
      state: member?.state || "",
      zip: member?.zip || "",
      sendWelcomeMessage: false,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: memberSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
      await create.mutateAsync(value);
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <ModalTrigger>
        <Button>{member?.id ? "Edit Member" : "Add Member"}</Button>
      </ModalTrigger>
      <ModalContent size="xl">
        <ModalHeader>
          <ModalTitle>
            {member?.id ? "Edit Member" : "Add New Member"}
          </ModalTitle>
          <ModalDescription>
            Fill in the member details below. All fields are required.
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
            <form.Field name="name">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter full name"
                    onBlur={field.handleBlur}
                  />
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="mobile">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>Mobile Number</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    onBlur={field.handleBlur}
                  />
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="adhaar">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>Adhaar Number</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter 12-digit Adhaar number"
                    maxLength={12}
                    onBlur={field.handleBlur}
                  />
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="bloodGroup">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>Blood Group</Label>
                  <Select
                    name={field.name}
                    onChange={(key) => {
                      if (
                        typeof key !== "string" ||
                        !BLOOD_GROUP_VALUES.includes(key as any)
                      )
                        return;
                      field.handleChange(key);
                    }}
                  >
                    <SelectTrigger />
                    <SelectContent items={BLOOD_GROUPS}>
                      {(item) => (
                        <SelectItem id={item.id} textValue={item.name}>
                          {item.name}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="locality">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>Locality</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter locality"
                    onBlur={field.handleBlur}
                  />
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="district">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>District</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter district"
                    onBlur={field.handleBlur}
                  />
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="state">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>State</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter state"
                    onBlur={field.handleBlur}
                  />
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="zip">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>ZIP Code</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter 6-digit ZIP code"
                    maxLength={6}
                    onBlur={field.handleBlur}
                  />
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="sendWelcomeMessage">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Checkbox
                    isSelected={field.state.value}
                    onChange={(isSelected) => field.handleChange(isSelected)}
                  >
                    Send welcome message to the member
                  </Checkbox>
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
            {member?.id ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
