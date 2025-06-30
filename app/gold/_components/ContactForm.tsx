"use client";

import { rawContactSchema } from "@/app/validationSchemas/contactSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, ContactGroup } from "@prisma/client";
import { Button, Callout, Select, TextArea, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

interface Props {
  contact?: Contact;
  groups: ContactGroup[]; // List of available groups
}

const ContactForm = ({ contact, groups }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof rawContactSchema>>({
    resolver: zodResolver(rawContactSchema),
    defaultValues: {
      name: contact?.name || "",
      groupId: contact?.groupId?.toString() || "1", // Default to first group
      phone: contact?.phone || "",
      cccd: contact?.cccd || "",
      taxcode: contact?.taxcode || "",
      address: contact?.address || "",
      note: contact?.note || "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (contact) {
        await axios.patch("/api/contacts/" + contact.id, data);
      } else {
        await axios.post("/api/contacts", data);
      }
      router.push("/contacts/list");
      router.refresh();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setError("Lỗi không xác định đã xảy ra.");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-4">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <TextField.Root
          placeholder="Tên"
          {...register("name")}
        ></TextField.Root>
        <ErrorMessage>{errors.name?.message}</ErrorMessage>

        <Controller
          name="groupId"
          control={control}
          render={({ field }) => (
            <Select.Root value={field.value} onValueChange={field.onChange}>
              <Select.Trigger placeholder="Nhóm khách hàng" />
              <Select.Content>
                {groups.map((group) => (
                  <Select.Item key={group.id} value={group.id.toString()}>
                    {group.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          )}
        />
        <ErrorMessage>{errors.groupId?.message}</ErrorMessage>

        <TextField.Root
          className="mt4"
          placeholder="Số điện thoại"
          {...register("phone")}
        ></TextField.Root>
        <TextField.Root placeholder="CCCD" {...register("cccd")}>
          <TextField.Slot></TextField.Slot>
        </TextField.Root>

        <TextField.Root
          placeholder="Mã số thuế"
          {...register("taxcode")}
        ></TextField.Root>

        <TextField.Root
          placeholder="Địa chỉ"
          {...register("address")}
        ></TextField.Root>

        <TextField.Root placeholder="Ghi chú" {...register("note")} />

        <Button type="submit" disabled={isSubmitting}>
          {contact ? "Cập nhật" : "Tạo mới"} {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
