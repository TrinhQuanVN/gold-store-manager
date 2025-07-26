"use client";

import {
  Button,
  Flex,
  RadioGroup,
  TextField,
  Select,
  Text,
} from "@radix-ui/themes";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { JewelryQuery } from "./JewelryTable";
import { JewelryCategory, JewelryType } from "@prisma/client";

interface Props {
  searchParams: JewelryQuery;
  categories: JewelryCategory[];
  types: JewelryType[];
}

const JewelrySearchForm = ({ searchParams, categories, types }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, watch, getValues, setValue } =
    useForm<JewelryQuery>({
      defaultValues: {
        id: searchParams.id ?? "",
        supplierId: searchParams.supplierId ?? "",
        weight: searchParams.weight ?? "",
        reportProductCode: searchParams.reportProductCode ?? "",
        categoryId: searchParams.categoryId ?? "",
        jewelryTypeId: searchParams.jewelryTypeId ?? "",
        inStock: searchParams.inStock ?? "true",
      },
    });

  const watched = useWatch({ control });

  // Chỉ cho phép điền 1 trong 4 trường tìm kiếm chính
  const hasMainField =
    !!watched.id ||
    !!watched.supplierId ||
    !!watched.weight ||
    !!watched.reportProductCode;

  const onSubmit = (data: JewelryQuery) => {
    const params = new URLSearchParams();

    for (const [key, val] of Object.entries({ ...searchParams, ...data })) {
      if (val !== undefined && val !== "" && val !== "all") {
        params.set(key, String(val));
      }
    }

    params.set("page", "1");
    params.set("orderBy", "totalWeight");
    params.set("orderDirection", "asc");

    startTransition(() => {
      router.push(`/jewelry/list?${params.toString()}`);
    });
  };

  const fieldPlaceholders: Record<
    "id" | "supplierId" | "weight" | "reportProductCode",
    string
  > = {
    id: "Tìm theo ID",
    supplierId: "Tìm theo mã nhà cung cấp",
    weight: "Tìm theo trọng lượng",
    reportProductCode: "Tìm theo mã báo cáo",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="4">
        {/* Row 1: Main search fields */}
        <Flex gap="3" wrap="wrap">
          {(["id", "supplierId", "weight", "reportProductCode"] as const).map(
            (field) => (
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
            )
          )}
        </Flex>

        {/* Row 2: Category + Type */}
        <Flex gap="4" align="center" wrap="wrap">
          <Flex align="center" gap="2">
            <Text size="2">Loại trang sức:</Text>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select.Root
                  value={field.value || "all"}
                  onValueChange={(val) =>
                    field.onChange(val === "all" ? "" : val)
                  }
                >
                  <Select.Trigger placeholder="Loại trang sức" />
                  <Select.Content>
                    <Select.Item value="all">Tất cả</Select.Item>
                    {categories.map((c) => (
                      <Select.Item key={c.id} value={c.id.toString()}>
                        {c.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}
            />
          </Flex>

          <Flex align="center" gap="2">
            <Text size="2">Loại vàng:</Text>
            <Controller
              name="jewelryTypeId"
              control={control}
              render={({ field }) => (
                <Select.Root
                  value={field.value || "all"}
                  onValueChange={(val) =>
                    field.onChange(val === "all" ? "" : val)
                  }
                >
                  <Select.Trigger placeholder="Loại vàng" />
                  <Select.Content>
                    <Select.Item value="all">Tất cả</Select.Item>
                    {types.map((t) => (
                      <Select.Item key={t.id} value={t.id.toString()}>
                        {t.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}
            />
          </Flex>
        </Flex>

        {/* Row 3: Stock status + Button */}
        <Flex align="center" justify="between" wrap="wrap">
          <Flex align="center" gap="4">
            <Text>Trạng thái tồn kho:</Text>
            <Controller
              name="inStock"
              control={control}
              render={({ field }) => (
                <RadioGroup.Root
                  {...field}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <Flex gap="4">
                    <RadioGroup.Item value="all" /> Tất cả
                    <RadioGroup.Item value="true" /> Còn hàng
                    <RadioGroup.Item value="false" /> Hết hàng
                  </Flex>
                </RadioGroup.Root>
              )}
            />
          </Flex>

          <Button
            type="submit"
            disabled={isPending}
            color="violet"
            highContrast
          >
            Tìm kiếm
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default JewelrySearchForm;
