"use client";

import { TextField, Flex, Button, Select } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { ContactQuery } from "./ContactTable";

interface Props {
  searchParams: ContactQuery;
}
const validFields = ["name", "cccd", "phone"] as const;
type SearchField = (typeof validFields)[number];

const ContactSearchForm = ({ searchParams }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [field, setField] = useState<SearchField>("name");
  const [value, setValue] = useState(
    searchParams[field as keyof ContactQuery] ?? ""
  );

  const handleSearch = (formData: FormData) => {
    const params = new URLSearchParams();

    // Preserve existing params except the search fields
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val && !["name", "cccd", "phone", "field", "value"].includes(key)) {
        params.set(key, val);
      }
    });

    const field = formData.get("field")?.toString();
    const value = formData.get("value")?.toString().trim();

    if (field && value) {
      params.set("field", field); // lưu tiêu chí tìm
      params.set("value", value); // lưu giá trị tìm
      params.set(field, value); // để giữ giá trị TextField khi reload (UI sync)
    } else {
      // nếu không nhập gì thì xóa
      params.delete("field");
      params.delete("value");
      ["name", "cccd", "phone"].forEach((k) => params.delete(k));
    }

    // reset về page 1
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
          onValueChange={(val) => setField(val as SearchField)}
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
        ></TextField.Root>

        <Button type="submit" disabled={isPending}>
          Tìm kiếm
        </Button>
      </Flex>
    </form>
  );
};

export default ContactSearchForm;
