import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { rawReportXNTSchema, RawReportXNTForm } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReportXNT } from "@prisma/client";
import { Button, Flex, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  onSuccess: (report: RawReportXNTForm) => void;
  onCancel?: () => void;
  headerId: number;
  groupId?: number;
  report?: ReportXNT;
}

const ReportXNTFormPopup = ({
  onSuccess,
  onCancel,
  headerId,
  groupId,
  report,
}: Props) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RawReportXNTForm>({
    resolver: zodResolver(rawReportXNTSchema),
    defaultValues: rawReportXNTSchema.parse({
      ...report,
      unit: report?.unit ?? "chỉ",
      groupId: report?.groupId?.toString() ?? groupId?.toString() ?? "",
    }),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const res = report
        ? await axios.patch<ReportXNT>(
            `/api/reportXNTs/${headerId}/group/${data.groupId}/report/${report.id}`,
            data
          )
        : await axios.post<ReportXNT>(
            `/api/reportXNTs/${headerId}/group/${data.groupId}/report`,
            data
          );
      onSuccess(data);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Flex direction="column" gap="3">
        <TextField.Root placeholder="Mã sản phẩm" {...register("id")} />
        <ErrorMessage>{errors.id?.message}</ErrorMessage>

        <TextField.Root placeholder="Tên sản phẩm" {...register("name")} />
        <ErrorMessage>{errors.name?.message}</ErrorMessage>

        <TextField.Root
          placeholder="STT trong nhóm báo cáo"
          {...register("stt")}
        />
        <ErrorMessage>{errors.stt?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Tồn đầu kỳ (trọng lượng)"
          {...register("tonDauKyQuantity")}
        />
        <ErrorMessage>{errors.tonDauKyQuantity?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Tồn đầu kỳ (giá trị)"
          {...register("tonDauKyValue")}
        />
        <ErrorMessage>{errors.tonDauKyValue?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Nhập trong kỳ (trọng lượng)"
          {...register("nhapQuantity")}
        />
        <ErrorMessage>{errors.nhapQuantity?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Nhập trong kỳ (giá trị)"
          {...register("nhapValue")}
        />
        <ErrorMessage>{errors.nhapValue?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Xuất trong kỳ (trọng lượng)"
          {...register("xuatQuantity")}
        />
        <ErrorMessage>{errors.xuatQuantity?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Xuất trong kỳ (giá trị)"
          {...register("xuatValue")}
        />
        <ErrorMessage>{errors.xuatValue?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Tồn cuối kỳ (trọng lượng)"
          {...register("tonCuoiKyQuantity")}
        />
        <ErrorMessage>{errors.tonCuoiKyQuantity?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Tồn cuối kỳ (giá trị)"
          {...register("tonCuoiKyValue")}
        />
        <ErrorMessage>{errors.tonCuoiKyValue?.message}</ErrorMessage>

        <Flex gap="3" mt="3" justify="end">
          <Button type="button" variant="ghost" color="gray" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {report ? "Cập nhật" : "Tạo mới"} {isSubmitting && <Spinner />}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default ReportXNTFormPopup;
