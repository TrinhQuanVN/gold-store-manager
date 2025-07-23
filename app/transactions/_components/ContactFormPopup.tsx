import {
  RawContactDataForm,
  rawContactSchema,
} from "@/app/validationSchemas/contactSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Select, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { Contact, ContactGroup } from "@prisma/client";
import { ContactWithGroup } from "@/types";
import { raw } from "@prisma/client/runtime/library";

interface Props {
  onSuccess: (contact: RawContactDataForm) => void;
  onCancel?: () => void;
  groups: ContactGroup[]; // ✅ truyền danh sách nhóm khách hàng
  contact?: RawContactDataForm; // ➕ nếu có → là chỉnh sửa
}

const ContactFormPopup = ({ onSuccess, onCancel, groups, contact }: Props) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RawContactDataForm>({
    resolver: zodResolver(rawContactSchema),
    defaultValues: rawContactSchema.parse(contact ?? rawContactSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const res = contact
        ? await axios.patch<RawContactDataForm>(
            `/api/contacts/${contact.id}`,
            data
          )
        : await axios.post<RawContactDataForm>("/api/contacts", data);
      onSuccess(res.data);
    } catch (err) {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Flex direction="column" gap="3">
        <TextField.Root placeholder="Tên" {...register("name")} />
        <ErrorMessage>{errors.name?.message}</ErrorMessage>

        <TextField.Root placeholder="CCCD" {...register("cccd")} />

        <TextField.Root placeholder="Địa chỉ" {...register("address")} />

        <TextField.Root placeholder="Số điện thoại" {...register("phone")} />

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
        <ErrorMessage>{errors.group?.message}</ErrorMessage>

        <TextField.Root placeholder="Ghi chú" {...register("note")} />

        <Flex gap="3" mt="3" justify="end">
          <Button type="button" variant="ghost" color="gray" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {contact ? "Cập nhật" : "Tạo mới"} {isSubmitting && <Spinner />}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default ContactFormPopup;
