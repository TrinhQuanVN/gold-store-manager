"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import { NumericFormattedField } from "@/app/components/NumericFormattedField";
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
  groupId: number;
  reportXNT?: RawReportXNTForm;
}

const ReportXNTForm = ({ headerId, groupId, reportXNT }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RawReportXNTForm>({
    resolver: zodResolver(rawReportXNTSchema),
    defaultValues: rawReportXNTSchema.parse(reportXNT ?? rawReportXNTSchema),
  });

  const onSubmit = handleSubmit(async (rawData) => {
    try {
      setSubmitting(true);
      const parsed = reportXNTSchema.parse(rawData);

      if (reportXNT) {
        await axios.patch(
          `/api/reportXNTs/${headerId}/group/${groupId}/report/${reportXNT.id}`,
          parsed
        );
      } else {
        await axios.post(
          `/api/reportXNTs/${headerId}/group/${groupId}/report`,
          parsed
        );
      }

      router.push(`/reportXNTs/${headerId}/group/${groupId}`);
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
          <DataList.Label>Mã gộp sản phẩm</DataList.Label>
          <DataList.Value>
            <TextField.Root
              {...register("id")}
              style={{ textAlign: "right" }}
            />
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tên gộp sản phẩm</DataList.Label>
          <DataList.Value>
            <TextField.Root
              {...register("name")}
              style={{ textAlign: "right" }}
            />
            <ErrorMessage>{errors.name?.message}</ErrorMessage>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>STT sản phẩm trong báo cáo</DataList.Label>
          <DataList.Value>
            <TextField.Root
              {...register("stt")}
              style={{ textAlign: "right" }}
            />
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tồn đầu kỳ (trọng lượng)</DataList.Label>
          <DataList.Value>
            <NumericFormattedField
              name="tonDauKyQuantity"
              control={control}
              error={errors.tonDauKyQuantity?.message}
              maximumFractionDigits={4}
            />
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tồn đầu kỳ (giá trị)</DataList.Label>
          <DataList.Value>
            <NumericFormattedField
              name="tonDauKyValue"
              control={control}
              error={errors.tonDauKyValue?.message}
            />
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Nhập trong kỳ (trọng lượng)</DataList.Label>
          <DataList.Value>
            <NumericFormattedField
              name="nhapQuantity"
              control={control}
              error={errors.nhapQuantity?.message}
              maximumFractionDigits={4}
            />
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Nhập trong kỳ (giá trị)</DataList.Label>
          <DataList.Value>
            <NumericFormattedField
              name="nhapValue"
              control={control}
              error={errors.nhapValue?.message}
            />
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Xuất trong kỳ (trọng lượng)</DataList.Label>
          <DataList.Value>
            <NumericFormattedField
              name="xuatQuantity"
              control={control}
              error={errors.xuatQuantity?.message}
              maximumFractionDigits={4}
            />
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Xuất trong kỳ (giá trị)</DataList.Label>
          <DataList.Value>
            <NumericFormattedField
              name="xuatValue"
              control={control}
              error={errors.xuatValue?.message}
            />
          </DataList.Value>
        </DataList.Item>

        {/* <DataList.Item>
          <DataList.Label>Đơn giá xuất</DataList.Label>
          <DataList.Value>
            <NumericFormattedField
              name="xuatDonGia"
              control={control}
              error={errors.xuatDonGia?.message}
            />
          </DataList.Value>
        </DataList.Item> */}

        <DataList.Item>
          <DataList.Label>Tồn cuối kỳ (trọng lượng)</DataList.Label>
          <DataList.Value>
            <NumericFormattedField
              name="tonCuoiKyQuantity"
              control={control}
              error={errors.tonCuoiKyQuantity?.message}
              maximumFractionDigits={4}
            />
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tồn cuối kỳ (giá trị)</DataList.Label>
          <DataList.Value>
            <NumericFormattedField
              name="tonCuoiKyValue"
              control={control}
              error={errors.tonCuoiKyValue?.message}
            />
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>

      <Button type="submit" disabled={isSubmitting} className="mt-4">
        {reportXNT ? "Cập nhật" : "Tạo mới"} {isSubmitting && "⏳"}
      </Button>
    </form>
  );
};

export default ReportXNTForm;
