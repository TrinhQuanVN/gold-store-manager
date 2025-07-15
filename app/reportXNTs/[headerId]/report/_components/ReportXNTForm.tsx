"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import { NumericFormattedField } from "@/app/components/NumericFormattedField";
import {
  rawReportXNTSchema,
  reportXNTSchema,
} from "@/app/validationSchemas/reportXNTSchemas";
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
  reportXNT?: ReportXNT;
}

const ReportXNTForm = ({ headerId, reportXNT }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof rawReportXNTSchema>>({
    resolver: zodResolver(rawReportXNTSchema),
    defaultValues: {
      headerId: reportXNT?.headerId.toString() ?? headerId.toString(),
      name: reportXNT?.name ?? "",
      unit: reportXNT?.unit ?? "chỉ",
      tonDauKyQuantity: reportXNT?.tonDauKyQuantity.toString(),
      tonDauKyValue: reportXNT?.tonDauKyValue.toString(),
      nhapQuantity: reportXNT?.nhapQuantity.toString(),
      nhapValue: reportXNT?.nhapValue.toString(),
      xuatQuantity: reportXNT?.xuatQuantity.toString(),
      xuatValue: reportXNT?.xuatValue.toString(),
      // xuatDonGia: reportXNT?.xuatDonGia.toString(),
      tonCuoiKyQuantity: reportXNT?.tonCuoiKyQuantity.toString(),
      tonCuoiKyValue: reportXNT?.tonCuoiKyValue.toString(),
    },
  });

  const onSubmit = handleSubmit(async (rawData) => {
    try {
      setSubmitting(true);
      const parsed = reportXNTSchema.parse(rawData);

      if (reportXNT) {
        await axios.patch(
          `/api/reportXNTs/${headerId}/report/${reportXNT.id}`,
          parsed
        );
      } else {
        await axios.post(`/api/reportXNTs/${headerId}/report`, parsed);
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
          <DataList.Label>Đơn vị</DataList.Label>
          <DataList.Value>
            <TextField.Root
              {...register("unit")}
              readOnly
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
