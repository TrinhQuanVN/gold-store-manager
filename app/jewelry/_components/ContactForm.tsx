"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/app/validationSchemas";
import { z } from "zod";
import { Contact } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller } from "react-hook-form";
import axios from "axios";
import {
  Button,
  Callout,
  TextField,
  TextArea,
  Select,
  Flex,
  Text,
} from "@radix-ui/themes";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

type ContactFormData = z.infer<typeof contactSchema>;

interface Props {
  contact?: Contact;
  groups: { id: number; name: string }[]; // List of available groups
}

const ContactForm = ({ contact, groups }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control, // 👈 cần thêm dòng này
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      ...contact,
      groupId: contact?.groupId?.toString(), // convert to string for <select>
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
              <Select.Trigger placeholder="Nhóm liên hệ" />
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

        <TextArea placeholder="Ghi chú" {...register("note")} />

        <Button type="submit" disabled={isSubmitting}>
          {contact ? "Cập nhật liên hệ" : "Tạo mới"}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
