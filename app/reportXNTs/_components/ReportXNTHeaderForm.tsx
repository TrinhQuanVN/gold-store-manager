"use client";

import { rawReportXNTHeaderSchema } from "@/app/validationSchemas/reportXNTHeaderSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Callout, Select, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

interface Props {
  taxPayers: { id: number; name: string }[];
}

const ReportXNTHeaderForm = ({ taxPayers }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const quarter = Math.floor(new Date().getMonth() / 3) + 1;
  const year = new Date().getFullYear();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof rawReportXNTHeaderSchema>>({
    resolver: zodResolver(rawReportXNTHeaderSchema),
    defaultValues: {
      quarter: quarter.toString(),
      year: year.toString(),
      taxPayerId: taxPayers[taxPayers.length - 1]?.id.toString() ?? "",
      startDate: new Date(year, (quarter - 1) * 3, 1)
        .toISOString()
        .split("T")[0],
      endDate: new Date(year, (quarter - 1) * 3 + 3, 1)
        .toISOString()
        .split("T")[0],
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      await axios.post("/api/report-xnt-headers", data);
      router.push("/reportXNTs");
      router.refresh();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setError("Lỗi không xác định đã xảy ra.");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-4">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <TextField.Root placeholder="Tên báo cáo" {...register("name")} />
        <ErrorMessage>{errors.name?.message}</ErrorMessage>

        <Controller
          name="quarter"
          control={control}
          render={({ field }) => (
            <Select.Root
              value={field.value?.toString()}
              onValueChange={field.onChange}
            >
              <Select.Trigger placeholder="Chọn quý" />
              <Select.Content>
                {[1, 2, 3, 4].map((q) => (
                  <Select.Item key={q} value={q.toString()}>
                    Quý {q}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          )}
        />
        <ErrorMessage>{errors.quarter?.message}</ErrorMessage>

        <TextField.Root placeholder="Năm (yyyy)" {...register("year")} />
        <ErrorMessage>{errors.year?.message}</ErrorMessage>

        <Controller
          name="taxPayerId"
          control={control}
          render={({ field }) => (
            <Select.Root
              value={field.value?.toString()}
              onValueChange={field.onChange}
            >
              <Select.Trigger placeholder="Người nộp thuế" />
              <Select.Content>
                {taxPayers.map((payer) => (
                  <Select.Item key={payer.id} value={payer.id.toString()}>
                    {payer.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          )}
        />
        <ErrorMessage>{errors.taxPayerId?.message}</ErrorMessage>

        <TextField.Root
          type="date"
          placeholder="Ngày bắt đầu"
          {...register("startDate")}
        />
        <ErrorMessage>{errors.startDate?.message}</ErrorMessage>

        <TextField.Root
          type="date"
          placeholder="Ngày kết thúc"
          {...register("endDate")}
        />
        <ErrorMessage>{errors.startDate?.message}</ErrorMessage>

        <Button type="submit" disabled={isSubmitting}>
          Tạo báo cáo {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default ReportXNTHeaderForm;
