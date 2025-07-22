"use client";

import {
  RawReportXNTHeaderForm,
  rawReportXNTHeaderSchema,
} from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Callout, Flex, Select, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { ReportXNTHeader } from "@prisma/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  taxPayers: { id: number; name: string }[];
  reportHeader?: RawReportXNTHeaderForm;
}

const ReportXNTHeaderForm = ({ taxPayers, reportHeader }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const now = new Date();
  const defaultQuarter = (Math.floor(now.getMonth() / 3) + 1).toString();
  const defaultYear = now.getFullYear().toString();
  const defaultStartDate = new Date(
    now.getFullYear(),
    (parseInt(defaultQuarter) - 1) * 3,
    1
  ).toISOString();
  const defaultEndDate = new Date(
    now.getFullYear(),
    parseInt(defaultQuarter) * 3,
    0
  ).toISOString();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RawReportXNTHeaderForm>({
    resolver: zodResolver(rawReportXNTHeaderSchema),
    defaultValues: rawReportXNTHeaderSchema.parse({
      quarter: defaultQuarter,
      year: defaultYear,
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      ...(reportHeader ?? {}), // nếu có reportHeader sẽ override mặc định
    }),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (reportHeader) {
        await axios.patch("/api/reportXNTs/" + reportHeader.id, data);
      } else {
        await axios.post("/api/reportXNTs", data);
      }
      router.push("/reportXNTs/list");
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
        <Flex direction="column" gap="3">
          <TextField.Root placeholder="Tên báo cáo" {...register("name")} />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>

          <Controller
            name="quarter"
            control={control}
            render={({ field }) => (
              <Select.Root
                value={field.value?.toString()}
                onValueChange={(value) => {
                  field.onChange(value);
                  const q = parseInt(value);
                  const y = parseInt(watch("year"));
                  if (!isNaN(q) && !isNaN(y)) {
                    const newStart = new Date(y, (q - 1) * 3, 1);
                    const newEnd = new Date(y, q * 3, 0);
                    setValue("startDate", newStart.toISOString());
                    setValue("endDate", newEnd.toISOString());
                  }
                }}
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

          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <TextField.Root
                placeholder="Năm (yyyy)"
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(e);
                  const y = parseInt(e.target.value);
                  const q = parseInt(watch("quarter"));
                  if (!isNaN(q) && !isNaN(y)) {
                    const newStart = new Date(y, (q - 1) * 3, 1);
                    const newEnd = new Date(y, q * 3, 0);
                    setValue("startDate", newStart.toISOString());
                    setValue("endDate", newEnd.toISOString());
                  }
                }}
              />
            )}
          />
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

          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                locale="vi"
                dateFormat="dd/MM/yyyy"
                placeholderText="Ngày bắt đầu"
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => {
                  if (date) field.onChange(date.toISOString());
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50" // để styling giống TextField
              />
            )}
          />
          <ErrorMessage>{errors.startDate?.message}</ErrorMessage>

          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                locale="vi"
                dateFormat="dd/MM/yyyy"
                placeholderText="Ngày kết thúc"
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => {
                  if (date) field.onChange(date.toISOString());
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            )}
          />
          <ErrorMessage>{errors.endDate?.message}</ErrorMessage>

          <Button type="submit" disabled={isSubmitting}>
            {reportHeader ? "Sửa báo cáo" : "Tạo báo cáo"}
            {isSubmitting && <Spinner />}
          </Button>
        </Flex>
      </form>
    </div>
  );
};

export default ReportXNTHeaderForm;
