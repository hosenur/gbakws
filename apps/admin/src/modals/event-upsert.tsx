import { useForm, revalidateLogic } from "@tanstack/react-form";
import {
  DatePicker,
  DatePickerTrigger,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@gbakws/ui";
import { Button } from "@gbakws/ui";
import { Input, TextField } from "@gbakws/ui";
import { Label, FieldError } from "@gbakws/ui";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@gbakws/ui";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

interface EventFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  event?: {
    id?: string;
    causeId?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
  };
  causes?: Array<{ id: string; title: string }>;
}

const eventSchema = z.object({
  causeId: z.string().min(1, "Cause is required"),
  title: z.string().min(1, "Title is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(),
  location: z.string(),
});

export function EventUpsertModal({ isOpen, onClose, event }: EventFormProps) {
  console.log("renderd");
  const { data: causes } = useQuery(trpc.cause.all.queryOptions());
  const form = useForm({
    defaultValues: {
      causeId: event?.causeId || "",
      title: event?.title || "",
      startDate: event?.startDate || "",
      endDate: event?.endDate || "",
      location: event?.location || "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: eventSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
      // TODO: Implement API call to save event
      onClose?.();
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <Button>{event?.id ? "Edit Event" : "Add Event"}</Button>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>{event?.id ? "Edit Event" : "Add New Event"}</ModalTitle>
          <ModalDescription>
            Fill in the event details below. Cause, title, and start date are
            required.
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
            <form.Field name="causeId">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>Cause</Label>
                  <Select name={field.name}>
                    <SelectTrigger />
                    <SelectContent items={causes}>
                      {(item) => (
                        <SelectItem id={item.id} textValue={item.title}>
                          {item.title}
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

            <form.Field name="title">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter event title"
                    onBlur={field.handleBlur}
                  />
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="startDate">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <DatePicker>
                    <Label>Event date</Label>
                    <DatePickerTrigger />
                  </DatePicker>
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="endDate">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>End Date (Optional)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="datetime-local"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError>
                    {field.state.meta.errors.map((error) => error?.message)}
                  </FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field name="location">
              {(field) => (
                <TextField errors={field.state.meta.errors}>
                  <Label htmlFor={field.name}>Location (Optional)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter event location"
                    onBlur={field.handleBlur}
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
            {event?.id ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
