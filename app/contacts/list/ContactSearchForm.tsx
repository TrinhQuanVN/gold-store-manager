"use client";

import { Button, Flex, TextField } from "@radix-ui/themes";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ContactSearchQuery } from "./ContactSearchQuery";

const ContactSearchForm = ({
  searchParams,
}: {
  searchParams: ContactSearchQuery;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit } = useForm<ContactSearchQuery>({
    defaultValues: {
      id: searchParams.id ?? "",
      name: searchParams.name ?? "",
      cccd: searchParams.cccd ?? "",
      phone: searchParams.phone ?? "",
    },
  });

  const watched = useWatch({ control });

  // Kiểm tra xem có trường chính nào đã nhập chưa
  const hasMainField =
    !!watched.id || !!watched.name || !!watched.cccd || !!watched.phone;

  const onSubmit = (data: ContactSearchQuery) => {
    const params = new URLSearchParams();

    for (const [key, val] of Object.entries({ ...searchParams, ...data })) {
      if (val !== undefined && val !== "") {
        params.set(key, String(val));
      }
    }

    params.set("page", "1");

    startTransition(() => {
      router.push("/contacts/list?" + params.toString());
    });
  };

  const fieldPlaceholders: Record<"id" | "name" | "cccd" | "phone", string> = {
    id: "Tìm theo ID",
    name: "Tìm theo tên",
    cccd: "Tìm theo CCCD",
    phone: "Tìm theo số ĐT",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex gap="3" wrap="wrap" align="end">
        {(["id", "name", "cccd", "phone"] as const).map((field) => (
          <Controller
            key={field}
            name={field}
            control={control}
            render={({ field: f }) => (
              <TextField.Root
                {...f}
                placeholder={fieldPlaceholders[field]}
                disabled={hasMainField && !f.value}
                style={{ width: "200px" }}
              />
            )}
          />
        ))}

        <Button type="submit" disabled={isPending}>
          Tìm kiếm
        </Button>
      </Flex>
    </form>
  );
};

export default ContactSearchForm;
