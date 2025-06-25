"use client";

import { Button, Flex, Select, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ContactQuery } from "./ContactTable";

interface Props {
  searchParams: ContactQuery;
}

const ContactSearchForm = ({ searchParams }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [field, setField] = useState<"name" | "cccd" | "phone">(
    (searchParams.field as "name" | "cccd" | "phone") || "name"
  );
  const [value, setValue] = useState(searchParams.value || "");

  const handleSearch = (formData: FormData) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, val]) => {
      if (val && !["name", "cccd", "phone", "field", "value"].includes(key)) {
        params.set(key, val);
      }
    });

    const field = formData.get("field")?.toString();
    const value = formData.get("value")?.toString().trim();

    if (field && value) {
      params.set("field", field);
      params.set("value", value);
    } else {
      params.delete("field");
      params.delete("value");
      ["name", "cccd", "phone"].forEach((k) => params.delete(k));
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <form action={handleSearch}>
      <Flex gap="3" align="end" wrap="wrap">
        <Select.Root
          name="field"
          defaultValue={field}
          onValueChange={(val) => setField(val as "name" | "cccd" | "phone")}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="name">Tên khách hàng</Select.Item>
            <Select.Item value="cccd">Căn cước</Select.Item>
            <Select.Item value="phone">Số điện thoại</Select.Item>
          </Select.Content>
        </Select.Root>

        <TextField.Root
          name="value"
          placeholder="Nhập từ khóa"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <Button type="submit" disabled={isPending}>
          Tìm kiếm
        </Button>
      </Flex>
    </form>
  );
};

export default ContactSearchForm;
