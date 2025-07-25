"use client";

import {
  RawContactDataForm,
  rawContactSchema,
} from "@/app/validationSchemas/contactSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, ContactGroup } from "@prisma/client";
import { Button, Callout, Flex, Select, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

interface Props {
  contact?: Contact & { group: ContactGroup };
  groups: ContactGroup[]; // List of available groups
  redirectTo?: string; // Optional redirect URL after form submission
}

const ContactForm = ({ contact, groups, redirectTo }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RawContactDataForm>({
    resolver: zodResolver(rawContactSchema),
    mode: "onChange",
    defaultValues: {
      name: contact?.name ?? "",
      groupId: contact?.group?.id?.toString() ?? "1",
      address: contact?.address,
      phone: contact?.phone ?? "",
      cccd: contact?.cccd ?? "",
      note: contact?.note ?? "",
      group:
        contact && contact.group
          ? {
              id: contact.group.id.toString(),
              name: contact.group.name,
              color: contact.group.color ?? "gray",
              description: contact.group.description ?? "",
            }
          : null,
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
      setSubmitting(false);

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/contacts/list"); // fallback cho route mặc định
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setError("Lỗi không xác định đã xảy ra.");
    }
  });

  return (
    <div className="max-w-xl">
      {/* {Object.entries(errors).length > 0 && (
        <Callout.Root color="red" className="mb-4">
          <Callout.Text>Vui lòng kiểm tra các lỗi sau:</Callout.Text>
          <ul className="list-disc list-inside space-y-1 pl-4 text-sm text-red-700">
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>{(error as any).message}</li>
            ))}
          </ul>
        </Callout.Root>
      )} */}
      {error && (
        <Callout.Root color="red" className="mb-4">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form onSubmit={onSubmit}>
        <Flex className="gap-3" direction="column">
          <TextField.Root
            placeholder="Tên"
            {...register("name")}
          ></TextField.Root>
          <ErrorMessage>{errors.name?.message}</ErrorMessage>

          <TextField.Root placeholder="CCCD" {...register("cccd")}>
            <TextField.Slot></TextField.Slot>
          </TextField.Root>

          <TextField.Root
            placeholder="Địa chỉ"
            {...register("address")}
          ></TextField.Root>

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

          <TextField.Root
            placeholder="Mã số thuế"
            {...register("taxcode")}
          ></TextField.Root>

          <TextField.Root placeholder="Ghi chú" {...register("note")} />

          <Button type="submit" disabled={isSubmitting}>
            {contact ? "Cập nhật" : "Tạo mới"} {isSubmitting && <Spinner />}
          </Button>
        </Flex>
      </form>
    </div>
  );
};

export default ContactForm;
