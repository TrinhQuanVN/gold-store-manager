"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import { NumericFormattedField } from "@/app/components/NumericFormattedField";
import Spinner from "@/app/components/Spinner";
import { rawJewelrySchema } from "@/app/validationSchemas/jewelrySchemas";
import {
  JewelryNumber,
  JewelryTypeNumber,
  JewelryCategoryNumber,
} from "@/prismaRepositories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Jewelry, JewelryCategory, JewelryType } from "@prisma/client";
import {
  Button,
  Checkbox,
  Flex,
  Grid,
  Select,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { Label } from "@radix-ui/themes/components/context-menu";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type JewelryFormData = z.infer<typeof rawJewelrySchema>;

interface Props {
  jewelry?: JewelryNumber;
  types: JewelryTypeNumber[];
  categories: JewelryCategoryNumber[];
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
      jewelryTypeId: jewelry?.typeId?.toString(),
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
      <Grid columns="repeat(2, 1fr)" gap="4" align="center">
        <Label className="font-bold">Tên</Label>

        <Flex direction="column">
          <TextField.Root placeholder="Tên" {...register("name")} />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </Flex>

        <Label>Trọng lượng vàng (chỉ)</Label>
        <NumericFormattedField
          name="goldWeight"
          control={control}
          placeholder="Trọng lượng vàng (chỉ)"
          error={errors.goldWeight?.message}
          maximumFractionDigits={4}
        />

        <Label>Trọng lượng đá (chỉ)</Label>
        <NumericFormattedField
          name="gemWeight"
          control={control}
          placeholder="Trọng lượng đá quý"
          error={errors.gemWeight?.message}
          maximumFractionDigits={4}
        />

        <Label>Trọng lượng tổng</Label>
        <NumericFormattedField
          name="totalWeight"
          control={control}
          placeholder="Tổng trọng lượng"
          error={errors.totalWeight?.message}
          maximumFractionDigits={4}
        />

        <Label>Loại vàng</Label>
        <Flex direction="column">
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
        </Flex>

        <Label>Loại trang sức</Label>
        <Flex direction="column">
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
        </Flex>

        <Label>Tên đá quý</Label>
        <TextField.Root placeholder="Tên đá quý" {...register("gemName")} />

        <Label>Mã báo cáo XNT</Label>
        <TextField.Root
          placeholder="Mã báo cáo XNT"
          {...register("reportXNTId")}
        />

        <Label>Mã của nhà</Label>
        <TextField.Root placeholder="Mã của nhà " {...register("supplierId")} />

        <Label>Xuất xứ</Label>
        <TextField.Root placeholder="Xuất xứ" {...register("madeIn")} />

        <Label>Kích thước</Label>
        <TextField.Root placeholder="Kích thước" {...register("size")} />

        <Label>Ghi chú</Label>
        <TextArea placeholder="Ghi chú" {...register("description")} />
      </Grid>
      <Button type="submit" disabled={isSubmitting}>
        {jewelry ? "Cập nhật trang sức" : "Tạo mới"}{" "}
        {isSubmitting && <Spinner />}
      </Button>
    </form>
  );
};

export default JewelryForm;
