// schema.ts
import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  quantity: z
    .number({ invalid_type_error: "Phải là số" })
    .min(1, "Tối thiểu là 1"),
});

const formSchema = z.object({
  items: z.array(itemSchema).min(1, "Phải có ít nhất 1 dòng"),
});

export type FormValues = z.infer<typeof formSchema>;

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ItemForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ name: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log("Submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      <h2 className="text-xl font-bold">Danh sách sản phẩm</h2>

      {fields.map((field, index) => (
        <div key={field.id} className="space-x-2 flex items-center">
          <input
            {...register(`items.${index}.name`)}
            placeholder="Tên sản phẩm"
            className="border px-2 py-1"
          />
          <input
            type="number"
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            className="border px-2 py-1 w-24"
          />
          <button type="button" onClick={() => remove(index)}>
            ❌
          </button>

          <div className="text-red-600 text-sm">
            {errors.items?.[index]?.name?.message ||
              errors.items?.[index]?.quantity?.message}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: "", quantity: 1 })}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        ➕ Thêm sản phẩm
      </button>

      <div>
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
        >
          Gửi
        </button>
      </div>

      {errors.items && typeof errors.items.message === "string" && (
        <div className="text-red-600 mt-2">{errors.items.message}</div>
      )}
    </form>
  );
}
