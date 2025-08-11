import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { rawReportXNTSchema, RawReportXNTForm } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReportXNT } from "@prisma/client";
import { Button, Flex, TextField, Text } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { convertToRawReportXNTForm } from "./convertToRawReportXNTHeaderForm";

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
    defaultValues: report
      ? {
          ...convertToRawReportXNTForm(report),
          unit: report?.unit ?? "chỉ",
          groupId: report?.groupId?.toString() ?? groupId?.toString() ?? "",
        }
      : {
          unit: "chỉ",
          groupId: groupId?.toString() ?? "",
        },
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
        <Text>Mã sản phẩm trong báo cáo</Text>
        <TextField.Root
          placeholder="Mã sản phẩm"
          {...register("productCode")}
        />
        <ErrorMessage>{errors.id?.message}</ErrorMessage>

        <Text>Tên sản phẩm trong báo cáo</Text>
        <TextField.Root placeholder="Tên sản phẩm" {...register("name")} />
        <ErrorMessage>{errors.name?.message}</ErrorMessage>

        <Text>Số thứ tự sản phẩm trong báo cáo</Text>
        <TextField.Root
          placeholder="STT trong nhóm báo cáo"
          {...register("stt")}
        />
        <ErrorMessage>{errors.stt?.message}</ErrorMessage>

        <Text>Tồn đầu kỳ (trọng lượng)</Text>
        <TextField.Root
          placeholder="Tồn đầu kỳ (trọng lượng)"
          {...register("tonDauKyQuantity")}
        />
        <ErrorMessage>{errors.tonDauKyQuantity?.message}</ErrorMessage>

        <Text>Tồn đầu kỳ (giá trị)</Text>
        <TextField.Root
          placeholder="Tồn đầu kỳ (giá trị)"
          {...register("tonDauKyValue")}
        />
        <ErrorMessage>{errors.tonDauKyValue?.message}</ErrorMessage>

        <Text>Nhập trong kỳ (trọng lượng)</Text>
        <TextField.Root
          placeholder="Nhập trong kỳ (trọng lượng)"
          {...register("nhapQuantity")}
        />
        <ErrorMessage>{errors.nhapQuantity?.message}</ErrorMessage>

        <Text>Nhập trong kỳ (giá trị)</Text>
        <TextField.Root
          placeholder="Nhập trong kỳ (giá trị)"
          {...register("nhapValue")}
        />
        <ErrorMessage>{errors.nhapValue?.message}</ErrorMessage>

        <Text>Xuất trong kỳ (trọng lượng)</Text>
        <TextField.Root
          placeholder="Xuất trong kỳ (trọng lượng)"
          {...register("xuatQuantity")}
        />
        <ErrorMessage>{errors.xuatQuantity?.message}</ErrorMessage>

        <Text>Xuất trong kỳ (giá trị)</Text>
        <TextField.Root
          placeholder="Xuất trong kỳ (giá trị)"
          {...register("xuatValue")}
        />
        <ErrorMessage>{errors.xuatValue?.message}</ErrorMessage>

        <Text>Tồn cuối kỳ (trọng lượng)</Text>
        <TextField.Root
          placeholder="Tồn cuối kỳ (trọng lượng)"
          {...register("tonCuoiKyQuantity")}
        />
        <ErrorMessage>{errors.tonCuoiKyQuantity?.message}</ErrorMessage>

        <Text>Tồn cuối kỳ (giá trị)</Text>
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
