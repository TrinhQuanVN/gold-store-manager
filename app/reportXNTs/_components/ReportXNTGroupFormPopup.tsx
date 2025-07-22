import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { rawGroup, rawGroupFormData } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReportXNTGroup } from "@prisma/client";
import { Button, Flex, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  onSuccess: (group: rawGroupFormData) => void;
  onCancel?: () => void;
  headerId?: number; // ✅ truyền danh sách nhóm khách hàng
  group?: ReportXNTGroup; // ➕ nếu có → là chỉnh sửa
}

const ReportXNTGroupFormPopup = ({
  onSuccess,
  onCancel,
  headerId,
  group,
}: Props) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<rawGroupFormData>({
    resolver: zodResolver(rawGroup),
    defaultValues: rawGroup.parse(group ?? rawGroup),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const res = group
        ? await axios.patch<ReportXNTGroup>(
            `/api/reportXNTs/${headerId}/group${group.id}`,
            data
          )
        : await axios.post<ReportXNTGroup>(
            `/api/reportXNTs/${headerId}/group`,
            data
          );
      onSuccess({
        name: res.data.name,
        stt: res.data.stt.toString(),
      });
    } catch (err) {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Flex direction="column" gap="3">
        <TextField.Root placeholder="Tên nhóm báo cáo" {...register("name")} />
        <ErrorMessage>{errors.name?.message}</ErrorMessage>

        <TextField.Root placeholder="Số thứ tự" {...register("stt")} />
        <ErrorMessage>{errors.stt?.message}</ErrorMessage>

        <Flex gap="3" mt="3" justify="end">
          <Button type="button" variant="ghost" color="gray" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {group ? "Cập nhật" : "Tạo mới"} {isSubmitting && <Spinner />}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default ReportXNTGroupFormPopup;
