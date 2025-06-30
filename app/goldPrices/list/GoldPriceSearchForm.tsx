"use client";

import { Button, Flex, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { GoldPriceSearchQuery } from "./GoldPriceSearchQuery";

// Hàm định dạng yyyy-mm-dd để gán vào input type="date"
function formatDateForInput(date: Date) {
  return date.toISOString().split("T")[0];
}

const GoldPriceSearchForm = ({
  searchParams,
}: {
  searchParams: GoldPriceSearchQuery;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [startDate, setStartDate] = useState(
    searchParams.startDate ||
      formatDateForInput(new Date(Date.now() - 30 * 86400000)) // mặc định -30 ngày
  );

  const [endDate, setEndDate] = useState(
    searchParams.endDate || formatDateForInput(new Date()) // mặc định hôm nay
  );

  const handleSearch = (formData: FormData) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, val]) => {
      if (val && !["startDate", "endDate"].includes(key)) {
        params.set(key, val);
      }
    });

    const start = formData.get("startDate")?.toString();
    const end = formData.get("endDate")?.toString();

    if (start) params.set("startDate", start);
    else params.delete("startDate");

    if (end) params.set("endDate", end);
    else params.delete("endDate");

    params.set("page", "1");

    startTransition(() => {
      router.push("?" + params.toString());
    });
  };

  return (
    <form action={handleSearch}>
      <Flex gap="3" align="end" wrap="wrap">
        <TextField.Root
          type="date"
          name="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField.Root
          type="date"
          name="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button type="submit" disabled={isPending}>
          Tìm theo ngày
        </Button>
      </Flex>
    </form>
  );
};

export default GoldPriceSearchForm;
