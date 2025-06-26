"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { rawJewelrySchema } from "@/app/validationSchemas/jewelrySchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Jewelry, JewelryCategory, JewelryType } from "@prisma/client";
import {
  Button,
  Checkbox,
  Flex,
  Select,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type JewelryFormData = z.infer<typeof rawJewelrySchema>;

interface Props {
  jewelry?: Jewelry;
  types: JewelryType[];
  categories: JewelryCategory[];
}

const JewelryForm = ({ jewelry, types, categories }: Props) => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JewelryFormData>({
    resolver: zodResolver(rawJewelrySchema),
    defaultValues: {
      ...jewelry,
      goldWeight: jewelry?.goldWeight?.toString() ?? "",
      gemWeight: jewelry?.gemWeight?.toString() ?? "",
      totalWeight: jewelry?.totalWeight?.toString() ?? "",
      supplierId: jewelry?.supplierId?.toString() ?? "",
      categoryId: jewelry?.categoryId?.toString(),
      jewelryTypeId: jewelry?.jewelryTypeId?.toString(),
      inStock: jewelry?.inStock ? "true" : "false",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (jewelry) {
        await axios.patch(`/api/jewelry/${jewelry.id}`, data);
      } else {
        await axios.post("/api/jewelry", data);
      }
      router.push("/jewelry/list");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Lỗi không xác định đã xảy ra.");
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TextField.Root placeholder="Tên" {...register("name")} />
      <ErrorMessage>{errors.name?.message}</ErrorMessage>

      <TextField.Root
        placeholder="Trọng lượng vàng (chỉ)"
        {...register("goldWeight")}
      />
      <ErrorMessage>{errors.goldWeight?.message}</ErrorMessage>

      <Controller
        name="jewelryTypeId"
        control={control}
        render={({ field }) => (
          <Select.Root value={field.value} onValueChange={field.onChange}>
            <Select.Trigger placeholder="Loại vàng" />
            <Select.Content>
              {types.map((t) => (
                <Select.Item key={t.id} value={t.id.toString()}>
                  {t.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        )}
      />
      <ErrorMessage>{errors.jewelryTypeId?.message}</ErrorMessage>

      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <Select.Root value={field.value} onValueChange={field.onChange}>
            <Select.Trigger placeholder="Loại trang sức" />
            <Select.Content>
              {categories.map((c) => (
                <Select.Item key={c.id} value={c.id.toString()}>
                  {c.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        )}
      />
      <ErrorMessage>{errors.categoryId?.message}</ErrorMessage>

      <TextField.Root placeholder="Tên đá quý" {...register("gemName")} />
      <TextField.Root
        placeholder="Trọng lượng đá quý"
        {...register("gemWeight")}
      />
      <ErrorMessage>{errors.gemWeight?.message}</ErrorMessage>

      <TextField.Root
        placeholder="Tổng trọng lượng"
        {...register("totalWeight")}
      />
      <ErrorMessage>{errors.totalWeight?.message}</ErrorMessage>

      <TextField.Root
        placeholder="Mã báo cáo XNT"
        {...register("reportXNTId")}
      />
      <TextField.Root placeholder="Mã của nhà " {...register("supplierId")} />
      <TextField.Root placeholder="Xuất xứ" {...register("madeIn")} />
      <TextField.Root placeholder="Kích thước" {...register("size")} />
      <TextArea placeholder="Ghi chú" {...register("description")} />

      <Controller
        name="inStock"
        control={control}
        render={({ field }) => (
          <Flex align="center" gap="2">
            <Checkbox
              checked={field.value === "true"}
              onCheckedChange={(checked) =>
                field.onChange(checked ? "true" : "false")
              }
            />
            <label>Còn trong kho</label>
          </Flex>
        )}
      />

      <Button type="submit" disabled={isSubmitting}>
        {jewelry ? "Cập nhật trang sức" : "Tạo mới"}{" "}
        {isSubmitting && <Spinner />}
      </Button>
    </form>
  );
};

export default JewelryForm;
