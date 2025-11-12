import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  Checkbox,
  FieldError,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  TextField,
} from "@gbakws/ui";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { z } from "zod";
const bloodDonationSchema = z.object({
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(1, "Name is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  voluntaryDonation: z
    .boolean()
    .refine((val) => val === true, "This field is required"),
  healthDeclaration: z
    .boolean()
    .refine((val) => val === true, "This field is required"),
});

export const bloodGroups = [
  { id: 1, name: "B Positive" },
  { id: 2, name: "B Negative" },
  { id: 3, name: "A Positive" },
  { id: 4, name: "A Negative" },
  { id: 5, name: "AB Positive" },
  { id: 6, name: "AB Negative" },
  { id: 7, name: "O Positive" },
  { id: 8, name: "O Negative" },
];

export const Route = createFileRoute("/donate/blood")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: event } = useQuery(
    trpc.blood.event.queryOptions({ upcoming: true })
  );
  const form = useForm({
    defaultValues: {
      mobileNumber: "",
      name: "",
      bloodGroup: "",
      voluntaryDonation: false,
      healthDeclaration: false,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: bloodDonationSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.voluntaryDonation || !value.healthDeclaration) {
        alert("Please check both checkboxes to continue");
        return;
      }
      console.log("Form submitted:", value);
    },
  });

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      <h1>{event?.title}</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4 w-full"
      >
        {/* 🔹 MOBILE NUMBER FIELD */}
        <form.Field
          name="mobileNumber"
          listeners={{
            onChangeDebounceMs: 1000,
            onChange: async ({ value }) => {
              if (value.length >= 10) {
                try {
                  const res = await fetch(
                    `http://localhost:4000/member?mobile=${value}`
                  );
                  if (!res.ok) throw new Error("Member not found");
                  const data = await res.json();
                  form.setFieldValue("name", data.name);
                } catch (error) {
                  console.error("Error fetching member:", error);
                  form.setFieldValue("name", "");
                } finally {
                }
              } else {
                form.setFieldValue("name", "");
              }
            },
          }}
          children={(field) => (
            <TextField errors={field.state.meta.errors}>
              <Label>Mobile Number</Label>
              <Input
                placeholder="Mobile Number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <FieldError>
                {field.state.meta.errors.map((error) => error?.message)}
              </FieldError>
            </TextField>
          )}
        />

        {/* 🔹 NAME FIELD */}
        <form.Field
          name="name"
          children={(field) => (
            <Input
              placeholder={"Name"}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        />

        <form.Field
          name="bloodGroup"
          children={(field) => (
            <Select
              placeholder="Select Your Blood Group"
              onChange={(key) => field.handleChange(key?.toString() || "")}
            >
              <SelectTrigger />
              <SelectContent items={bloodGroups}>
                {(item) => (
                  <SelectItem id={item.id} textValue={item.name}>
                    {item.name}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        />

        <form.Field
          name="voluntaryDonation"
          children={(field) => (
            <Checkbox
              isSelected={field.state.value}
              onChange={(isSelected) => field.handleChange(isSelected)}
            >
              I am donating blood voluntarily with the understanding that doing
              so does not entitle me to receive blood in return and that any
              future need for blood will depend on its availability.
            </Checkbox>
          )}
        />

        <form.Field
          name="healthDeclaration"
          children={(field) => (
            <Checkbox
              isSelected={field.state.value}
              onChange={(isSelected) => field.handleChange(isSelected)}
            >
              I hereby declare that, to the best of my knowledge, I do not carry
              or suffer from any blood-transmissible or infectious diseases such
              as HIV/AIDS, Hepatitis B, Hepatitis C, Syphilis, or Malaria that
              could affect the safety of my blood donation.
            </Checkbox>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
