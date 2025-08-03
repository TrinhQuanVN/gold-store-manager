"use client";

import { Button, Flex, RadioGroup, Text } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { TransactionSearchQuery } from "./TransactionTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  searchParams: TransactionSearchQuery;
}

const TransactionSearchForm = ({ searchParams }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit } = useForm<TransactionSearchQuery>({
    defaultValues: {
      isExport: searchParams.isExport ?? "all",
      startDate: searchParams.startDate ?? "",
      endDate: searchParams.endDate ?? "",
    },
  });

  const onSubmit = (data: TransactionSearchQuery) => {
    const params = new URLSearchParams();

    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined && val !== "") {
        if (key === "isExport" && val === "all") continue; // bỏ isExport nếu là all
        params.set(key, val.toString());
      }
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`/transactions/list?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="4">
        {/* Row 1: Xuất / Nhập */}
        <Flex align="center" gap="4">
          <Text>Loại giao dịch:</Text>
          <Controller
            name="isExport"
            control={control}
            render={({ field }) => (
              <RadioGroup.Root
                {...field}
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <Flex gap="4">
                  <label>
                    <RadioGroup.Item value="all" /> Tất cả
                  </label>
                  <label>
                    <RadioGroup.Item value="true" /> Xuất
                  </label>
                  <label>
                    <RadioGroup.Item value="false" /> Nhập
                  </label>
                </Flex>
              </RadioGroup.Root>
            )}
          />
        </Flex>

        {/* Row 2: Date pickers */}
        <Flex gap="4">
          <Flex gap="4" align="center" wrap="wrap">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    if (date) {
                      const start = new Date(date);
                      start.setHours(0, 0, 0, 0); // 00:00:00
                      field.onChange(start.toISOString());
                    } else {
                      field.onChange("");
                    }
                  }}
                  placeholderText="Từ ngày"
                  dateFormat="dd/MM/yyyy"
                  className="rounded-md border px-3 py-2 text-sm shadow-sm"
                />
              )}
            />

            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    if (date) {
                      const start = new Date(date);
                      start.setHours(23, 59, 59, 999); // 00:00:00
                      field.onChange(start.toISOString());
                    } else {
                      field.onChange("");
                    }
                  }}
                  placeholderText="Đến ngày"
                  dateFormat="dd/MM/yyyy"
                  className="rounded-md border px-3 py-2 text-sm shadow-sm"
                />
              )}
            />
          </Flex>

          {/* Submit */}
          <Flex justify="end">
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
      </Flex>
    </form>
  );
};

export default TransactionSearchForm;
