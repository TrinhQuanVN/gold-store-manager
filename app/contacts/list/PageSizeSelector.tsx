"use client";

import { Select } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ContactQuery } from "./ContactTable";

interface Props {
  searchParams: ContactQuery;
}
const pageSizes = ["10", "20", "50", "100"];

const PageSizeSelector = ({ searchParams }: Props) => {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const currentSize = searchParams.pageSize || "10";

  const handleChange = (value: string) => {
    const params = new URLSearchParams();

    // Preserve existing query values
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val) params.set(key, val.toString());
    });

    // Update pageSize + reset page
    params.set("pageSize", value);
    params.set("page", "1");

    // Use current path and full query
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Select.Root defaultValue={currentSize} onValueChange={handleChange}>
      <Select.Trigger />
      <Select.Content>
        {pageSizes.map((size) => (
          <Select.Item key={size} value={size}>
            {size} / page
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default PageSizeSelector;
