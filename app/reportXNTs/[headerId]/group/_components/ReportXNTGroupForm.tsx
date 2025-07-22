"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import { NumericFormattedField } from "@/app/components/NumericFormattedField";
import {
  rawGroup,
  rawGroupFormData,
  RawReportXNTGroupForm,
  rawReportXNTGroupSchema,
} from "@/app/validationSchemas";
import {
  RawReportXNTForm,
  rawReportXNTSchema,
  reportXNTSchema,
} from "@/app/validationSchemas/reportXNTSchemas";
import { ReportXNTNumber } from "@/prismaRepositories";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReportXNT } from "@prisma/client";
import { Button, Callout, DataList, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  headerId: number;
  groupId?: number;
  group?: rawGroupFormData;
}

const ReportXNTGroupForm = ({ headerId, groupId, group }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm<rawGroupFormData>({
    resolver: zodResolver(rawGroup),
    defaultValues: rawGroup.parse(group ?? rawGroup),
  });

  const onSubmit = handleSubmit(async (rawData) => {
    try {
      setSubmitting(true);
      const parsed = reportXNTSchema.parse(rawData);

      if (group && groupId) {
        await axios.patch(
          `/api/reportXNTs/${headerId}/group/${groupId}`,
          parsed
        );
      } else {
        await axios.post(`/api/reportXNTs/${headerId}/group`, parsed);
      }

      router.push(`/reportXNTs/${headerId}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Lỗi không xác định đã xảy ra.");
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      {error && (
        <Callout.Root color="red">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Tên nhóm sản phẩm</DataList.Label>
          <DataList.Value>
            <TextField.Root
              {...register("name")}
              style={{ textAlign: "right" }}
            />
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Số thứ tự trong báo cáo</DataList.Label>
          <DataList.Value>
            <TextField.Root
              {...register("stt")}
              style={{ textAlign: "right" }}
            />
            <ErrorMessage>{errors.name?.message}</ErrorMessage>
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>

      <Button type="submit" disabled={isSubmitting} className="mt-4">
        {groupId ? "Cập nhật" : "Tạo mới"} {isSubmitting && "⏳"}
      </Button>
    </form>
  );
};

export default ReportXNTGroupForm;
