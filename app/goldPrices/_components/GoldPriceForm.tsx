"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Callout, Flex, Select, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { rawGoldPriceSchema } from "@/app/validationSchemas/goldPriceSchemas";
import { GoldPrice } from "@prisma/client";
import { z } from "zod";

interface Props {
  goldPrice?: GoldPrice;
}

const GoldPriceForm = ({ goldPrice }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof rawGoldPriceSchema>>({
    resolver: zodResolver(rawGoldPriceSchema),
    defaultValues: {
      name: goldPrice?.name || "24K",
      buy: goldPrice?.buy?.toString() || "",
      sell: goldPrice?.sell?.toString() || "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (goldPrice) {
        await axios.patch("/api/goldPrices/" + goldPrice.id, data);
      } else {
        await axios.post("/api/goldPrices", data);
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Lỗi không xác định.");
    } finally {
      setSubmitting(false);
    }
  });

  const names = ["24K", "23K", "18K", "16K", "14K", "10K", "Sliver"];

  return (
    <div className="max-w-md">
      {error && (
        <Callout.Root color="red" className="mb-4">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form onSubmit={onSubmit}>
        <Flex gap="3">
          <Select.Root
            value={watch("name")}
            onValueChange={(val) => setValue("name", val)}
          >
            <Select.Trigger
              className="w-full"
              placeholder="Chọn loại giá vàng"
            />
            <Select.Content>
              {names.map((n) => (
                <Select.Item key={n} value={n}>
                  {n}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <ErrorMessage>{errors.name?.message}</ErrorMessage>

          <TextField.Root
            className="w-full"
            placeholder="Giá mua vào"
            {...register("buy")}
          />
          <ErrorMessage>{errors.buy?.message}</ErrorMessage>

          <TextField.Root
            className="w-full"
            placeholder="Giá bán ra"
            {...register("sell")}
          />
          <ErrorMessage>{errors.sell?.message}</ErrorMessage>

          <Button type="submit" disabled={isSubmitting}>
            {goldPrice ? "Cập nhật giá" : "Tạo mới"}{" "}
            {isSubmitting && <Spinner />}
          </Button>
        </Flex>
      </form>
    </div>
  );
};

export default GoldPriceForm;
