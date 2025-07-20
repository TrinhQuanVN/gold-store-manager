"use client";

import { Button, Checkbox, Flex, Select, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { JewelryQuery } from "./JewelryTable";
import { JewelryCategory, JewelryType } from "@prisma/client";
import { JewelryCategoryNumber, JewelryTypeNumber } from "@/prismaRepositories";

interface Props {
  searchParams: JewelryQuery;
  categories: JewelryCategory[];
  types: JewelryType[];
}

const JewelrySearchForm = ({ searchParams, categories, types }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [field, setField] = useState<"id" | "supplierId">(
    (searchParams.field as "id" | "supplierId") || "id"
  );
  const [value, setValue] = useState(searchParams.value || "");

  const [categoryId, setCategoryId] = useState(searchParams.categoryId || "");
  const [jewelryTypeId, setJewelryTypeId] = useState(
    searchParams.jewelryTypeId || ""
  );
  const [inStock, setInStock] = useState(
    searchParams.inStock !== "false" // default to true
  );

  const handleSearch = (formData: FormData) => {
    const params = new URLSearchParams();

    const field = formData.get("field")?.toString();
    const value = formData.get("value")?.toString().trim();
    const categoryId = formData.get("categoryId")?.toString();
    const jewelryTypeId = formData.get("typeId")?.toString();
    const inStock = formData.get("inStock") === "on" ? "true" : "false";

    if (field && value) {
      params.set("field", field);
      params.set("value", value);
    } else {
      // only filter by category & type if not searching
      if (categoryId) params.set("categoryId", categoryId);
      if (jewelryTypeId) params.set("typeId", jewelryTypeId);
    }

    params.set("inStock", inStock);
    params.set("orderBy", "totalWeight");
    params.set("orderDirection", "asc");
    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <form action={handleSearch}>
      <Flex gap="3" align="end" wrap="wrap">
        {/* DK1: Search by ID or SupplierID */}
        <Select.Root
          name="field"
          defaultValue={field}
          onValueChange={(val) => setField(val as "id" | "supplierId")}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="id">ID</Select.Item>
            <Select.Item value="supplierId">Mã</Select.Item>
          </Select.Content>
        </Select.Root>
        <TextField.Root
          name="value"
          placeholder="Nhập từ khóa"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {/* DK2: Filter by category and type (only if no search) */}
        {!value && (
          <>
            <Select.Root
              name="categoryId"
              defaultValue={categoryId}
              onValueChange={setCategoryId}
            >
              <Select.Trigger placeholder="Chọn loại trang sức" />
              <Select.Content>
                {categories.map((c) => (
                  <Select.Item key={c.id} value={c.id.toString()}>
                    {c.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <Select.Root
              name="typeId"
              defaultValue={jewelryTypeId}
              onValueChange={setJewelryTypeId}
            >
              <Select.Trigger placeholder="Chọn loại vàng" />
              <Select.Content>
                {types.map((t) => (
                  <Select.Item key={t.id} value={t.id.toString()}>
                    {t.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </>
        )}
        <Button type="submit" disabled={isPending}>
          Tìm kiếm
        </Button>
      </Flex>
    </form>
  );
};

export default JewelrySearchForm;
