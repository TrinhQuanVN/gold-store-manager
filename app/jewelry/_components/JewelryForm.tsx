"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { NumericFormattedField } from "@/app/components/NumericFormattedField";
import {
  JewleryWithCategoryAndTypeDataForm,
  rawJewelrySchema,
} from "@/app/validationSchemas/jewelrySchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { JewelryCategory, JewelryType } from "@prisma/client";
import {
  Button,
  Flex,
  Grid,
  Select,
  TextArea,
  TextField,
  Text,
  Card,
  Separator,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import JewelryTable from "./JewelryTable";
import { Collapsible } from "radix-ui";

type Props = {
  jewelry?: JewleryWithCategoryAndTypeDataForm;
  types: JewelryType[];
  categories: JewelryCategory[];
  redirectTo?: string;
  onMySubmit?: (data: JewleryWithCategoryAndTypeDataForm) => Promise<void>;
  embedded?: boolean; // NEW
};

const JewelryForm: React.FC<Props> = ({
  jewelry,
  types,
  categories,
  redirectTo,
  onMySubmit,
  embedded = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);
  const [notfound, setNotfound] = useState(false);
  const [results, setResults] = useState<JewleryWithCategoryAndTypeDataForm[]>(
    []
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    resetField,
  } = useForm<JewleryWithCategoryAndTypeDataForm>({
    resolver: zodResolver(rawJewelrySchema),
    defaultValues: {
      id: jewelry?.id ?? "",
      name: jewelry?.name ?? "",
      goldWeight: jewelry?.goldWeight ?? "",
      gemWeight: jewelry?.gemWeight ?? "",
      totalWeight: jewelry?.totalWeight ?? "",
      categoryId: jewelry?.categoryId ?? "",
      typeId: jewelry?.typeId ?? "",
      gemName: jewelry?.gemName ?? "",
      description: jewelry?.description ?? null,
      madeIn: jewelry?.madeIn ?? "Việt Nam",
      size: jewelry?.size ?? null,
      reportProductCode: jewelry?.reportProductCode ?? null,
      type: jewelry?.type ?? {
        id: null,
        name: null,
        goldPercent: null,
        color: null,
      },
      category: jewelry?.category ?? {
        id: null,
        name: null,
        color: null,
      },
      supplierId: jewelry?.supplierId ?? null,
      createdAt: jewelry?.createdAt ?? null,
    },
  });

  const onSearch = async () => {
    const code = watch("reportProductCode") || "";
    if (!code.trim()) return;
    try {
      setSearching(true);
      setNotfound(false);
      const res = await axios.get<JewleryWithCategoryAndTypeDataForm[]>(
        `/api/jewelry/searchReportProductCode`,
        { params: { reportProductCode: code } }
      );
      setResults(res.data);
    } catch (e: any) {
      setResults([]);
      setNotfound(true);
    } finally {
      setSearching(false);
    }
  };

  const onSelectJewelry = (item: JewleryWithCategoryAndTypeDataForm) => {
    (Object.keys(item) as (keyof JewleryWithCategoryAndTypeDataForm)[]).forEach(
      (key) => {
        setValue(key, item[key] as any, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    );
    // clear list sau khi chọn
    setResults([]);
    setNotfound(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (onMySubmit) {
        await onMySubmit(data);
      } else {
        if (data.id) {
          await axios.patch(`/api/jewelry/${data.id}`, data);
        } else {
          await axios.post(`/api/jewelry`, data);
          // nếu muốn xóa id sau khi tạo mới để tiếp tục nhập, dùng resetField("id")
        }
        router.push(redirectTo ?? "/jewelry/list");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi không xác định đã xảy ra.");
      setSubmitting(false);
    }
  });
  if (embedded) {
    return (
      <Flex gap="3" direction="column">
        <Card className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Grid columns="repeat(2, 1fr)" gap="4" align="center">
            {/* Mã báo cáo XNT (input + Tìm) */}
            <Text as="label" size="2" weight="bold" htmlFor="reportProductCode">
              Mã báo cáo XNT
            </Text>
            <Flex gap="2" align="center">
              <TextField.Root
                className="w-full"
                id="reportProductCode"
                placeholder="Nhập mã XNT"
                {...register("reportProductCode")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSearch();
                  }
                }}
              ></TextField.Root>
              <Button type="button" onClick={onSearch} disabled={searching}>
                {searching ? <Spinner /> : "Tìm"}
              </Button>
            </Flex>

            {/* Tên */}
            <Text as="label" size="2" weight="bold" htmlFor="name">
              Tên
            </Text>
            <Flex direction="column">
              <TextField.Root
                id="name"
                placeholder="Tên"
                {...register("name")}
              ></TextField.Root>
              <ErrorMessage>{errors.name?.message}</ErrorMessage>
            </Flex>

            {/* Trọng lượng vàng */}
            <Text as="label" size="2" htmlFor="goldWeight">
              Trọng lượng vàng (chỉ)
            </Text>
            <NumericFormattedField
              name="goldWeight"
              control={control}
              placeholder="Trọng lượng vàng (chỉ)"
              error={errors.goldWeight?.message}
              maximumFractionDigits={4}
            />

            {/* Trọng lượng đá */}
            <Text as="label" size="2" htmlFor="gemWeight">
              Trọng lượng đá (chỉ)
            </Text>
            <NumericFormattedField
              name="gemWeight"
              control={control}
              placeholder="Trọng lượng đá quý"
              error={errors.gemWeight?.message}
              maximumFractionDigits={4}
            />

            {/* Trọng lượng tổng */}
            <Text as="label" size="2" htmlFor="totalWeight">
              Trọng lượng tổng
            </Text>
            <NumericFormattedField
              name="totalWeight"
              control={control}
              placeholder="Tổng trọng lượng"
              error={errors.totalWeight?.message}
              maximumFractionDigits={4}
            />

            {/* Mã của nhà */}
            <Text as="label" size="2" htmlFor="supplierId">
              Mã của nhà
            </Text>
            <TextField.Root
              id="supplierId"
              placeholder="Mã của nhà"
              {...register("supplierId")}
            ></TextField.Root>

            {/* Loại vàng */}
            <Text as="label" size="2">
              Loại vàng
            </Text>
            <Flex direction="column">
              <Controller
                name="typeId"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
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
              <ErrorMessage>{errors.typeId?.message}</ErrorMessage>
            </Flex>

            {/* Loại trang sức */}
            <Text as="label" size="2">
              Loại trang sức
            </Text>
            <Flex direction="column">
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
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

            <div className="col-span-2">
              <Collapsible.Root>
                <Flex align="center" justify="between" className="mb-2">
                  <Text as="div" weight="bold">
                    Thông tin bổ sung
                  </Text>
                  <Collapsible.Trigger asChild>
                    <Button type="button" variant="soft" size="2">
                      Mở/Đóng
                    </Button>
                  </Collapsible.Trigger>
                </Flex>

                <Collapsible.Content>
                  <Grid
                    columns="repeat(2, 1fr)"
                    gap="4"
                    align="center"
                    className="pt-2"
                  >
                    {/* Tên đá quý */}
                    <Text as="label" size="2" htmlFor="gemName">
                      Tên đá quý
                    </Text>
                    <TextField.Root
                      id="gemName"
                      placeholder="Tên đá quý"
                      {...register("gemName")}
                    />

                    {/* Xuất xứ */}
                    <Text as="label" size="2" htmlFor="madeIn">
                      Xuất xứ
                    </Text>
                    <TextField.Root
                      id="madeIn"
                      placeholder="Xuất xứ"
                      {...register("madeIn")}
                    />

                    {/* Kích thước */}
                    <Text as="label" size="2" htmlFor="size">
                      Kích thước
                    </Text>
                    <TextField.Root
                      id="size"
                      placeholder="Kích thước"
                      {...register("size")}
                    />

                    {/* Ghi chú */}
                    <Text as="label" size="2" htmlFor="description">
                      Ghi chú
                    </Text>
                    <TextArea
                      id="description"
                      placeholder="Ghi chú"
                      {...register("description")}
                    />
                  </Grid>
                </Collapsible.Content>
              </Collapsible.Root>
            </div>
          </Grid>

          <Separator my="3" />

          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSubmit()}
          >
            {jewelry?.id ? "Cập nhật trang sức" : "Tạo mới"}{" "}
            {isSubmitting && <Spinner />}
          </Button>
        </Card>
        <Card size="3" className="space-y-3">
          <Text as="div" weight="bold">
            Kết quả tìm theo Mã XNT
          </Text>

          {notfound && (
            <Text size="2" color="gray" aria-live="polite">
              Không tìm thấy trang sức phù hợp
            </Text>
          )}

          {results.length > 0 && (
            <div className="max-h-[60vh] overflow-auto rounded-lg border">
              <JewelryTable data={results} onSelect={onSelectJewelry} />
            </div>
          )}
        </Card>
      </Flex>
    );
  }

  return (
    <Flex gap="3" direction="column">
      <Card className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <form onSubmit={onSubmit} className="space-y-4 max-w-3xl">
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Grid columns="repeat(2, 1fr)" gap="4" align="center">
            {/* Mã báo cáo XNT (input + Tìm) */}
            <Text as="label" size="2" weight="bold" htmlFor="reportProductCode">
              Mã báo cáo XNT
            </Text>
            <Flex gap="2" align="center">
              <TextField.Root
                className="w-full"
                id="reportProductCode"
                placeholder="Nhập mã XNT"
                {...register("reportProductCode")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSearch();
                  }
                }}
              ></TextField.Root>
              <Button type="button" onClick={onSearch} disabled={searching}>
                {searching ? <Spinner /> : "Tìm"}
              </Button>
            </Flex>

            {/* Tên */}
            <Text as="label" size="2" weight="bold" htmlFor="name">
              Tên
            </Text>
            <Flex direction="column">
              <TextField.Root
                id="name"
                placeholder="Tên"
                {...register("name")}
              ></TextField.Root>
              <ErrorMessage>{errors.name?.message}</ErrorMessage>
            </Flex>

            {/* Trọng lượng vàng */}
            <Text as="label" size="2" htmlFor="goldWeight">
              Trọng lượng vàng (chỉ)
            </Text>
            <NumericFormattedField
              name="goldWeight"
              control={control}
              placeholder="Trọng lượng vàng (chỉ)"
              error={errors.goldWeight?.message}
              maximumFractionDigits={4}
            />

            {/* Trọng lượng đá */}
            <Text as="label" size="2" htmlFor="gemWeight">
              Trọng lượng đá (chỉ)
            </Text>
            <NumericFormattedField
              name="gemWeight"
              control={control}
              placeholder="Trọng lượng đá quý"
              error={errors.gemWeight?.message}
              maximumFractionDigits={4}
            />

            {/* Trọng lượng tổng */}
            <Text as="label" size="2" htmlFor="totalWeight">
              Trọng lượng tổng
            </Text>
            <NumericFormattedField
              name="totalWeight"
              control={control}
              placeholder="Tổng trọng lượng"
              error={errors.totalWeight?.message}
              maximumFractionDigits={4}
            />

            {/* Mã của nhà */}
            <Text as="label" size="2" htmlFor="supplierId">
              Mã của nhà
            </Text>
            <TextField.Root
              id="supplierId"
              placeholder="Mã của nhà"
              {...register("supplierId")}
            ></TextField.Root>

            {/* Loại vàng */}
            <Text as="label" size="2">
              Loại vàng
            </Text>
            <Flex direction="column">
              <Controller
                name="typeId"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
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
              <ErrorMessage>{errors.typeId?.message}</ErrorMessage>
            </Flex>

            {/* Loại trang sức */}
            <Text as="label" size="2">
              Loại trang sức
            </Text>
            <Flex direction="column">
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
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

            <div className="col-span-2">
              <Collapsible.Root>
                <Flex align="center" justify="between" className="mb-2">
                  <Text as="div" weight="bold">
                    Thông tin bổ sung
                  </Text>
                  <Collapsible.Trigger asChild>
                    <Button type="button" variant="soft" size="2">
                      Mở/Đóng
                    </Button>
                  </Collapsible.Trigger>
                </Flex>

                <Collapsible.Content>
                  <Grid
                    columns="repeat(2, 1fr)"
                    gap="4"
                    align="center"
                    className="pt-2"
                  >
                    {/* Tên đá quý */}
                    <Text as="label" size="2" htmlFor="gemName">
                      Tên đá quý
                    </Text>
                    <TextField.Root
                      id="gemName"
                      placeholder="Tên đá quý"
                      {...register("gemName")}
                    />

                    {/* Xuất xứ */}
                    <Text as="label" size="2" htmlFor="madeIn">
                      Xuất xứ
                    </Text>
                    <TextField.Root
                      id="madeIn"
                      placeholder="Xuất xứ"
                      {...register("madeIn")}
                    />

                    {/* Kích thước */}
                    <Text as="label" size="2" htmlFor="size">
                      Kích thước
                    </Text>
                    <TextField.Root
                      id="size"
                      placeholder="Kích thước"
                      {...register("size")}
                    />

                    {/* Ghi chú */}
                    <Text as="label" size="2" htmlFor="description">
                      Ghi chú
                    </Text>
                    <TextArea
                      id="description"
                      placeholder="Ghi chú"
                      {...register("description")}
                    />
                  </Grid>
                </Collapsible.Content>
              </Collapsible.Root>
            </div>
          </Grid>

          <Separator my="3" />

          <Button type="submit" disabled={isSubmitting}>
            {jewelry?.id ? "Cập nhật trang sức" : "Tạo mới"}{" "}
            {isSubmitting && <Spinner />}
          </Button>
        </form>
      </Card>
      <Card size="3" className="space-y-3">
        <Text as="div" weight="bold">
          Kết quả tìm theo Mã XNT
        </Text>

        {notfound && (
          <Text size="2" color="gray" aria-live="polite">
            Không tìm thấy trang sức phù hợp
          </Text>
        )}

        {results.length > 0 && (
          <div className="max-h-[60vh] overflow-auto rounded-lg border">
            <JewelryTable data={results} onSelect={onSelectJewelry} />
          </div>
        )}
      </Card>
    </Flex>
  );
};

export default JewelryForm;
