"use client";

import { Dialog } from "@radix-ui/themes";
import { Button, Flex, Text } from "@radix-ui/themes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { TransactionSearchQuery } from "./TransactionTable";
import axios from "axios";
import { saveAs } from "file-saver";
import { useState } from "react";

type FormValues = {
  excelFromDate: Date;
  excelToDate: Date;
};

interface Props {
  searchParams: TransactionSearchQuery;
}

const ExportExcelDialog = ({ searchParams }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const defaultToDate = new Date();
  defaultToDate.setHours(23, 59, 59);

  const defaultFromDate = new Date();
  defaultFromDate.setMonth(defaultFromDate.getMonth() - 3);
  defaultFromDate.setHours(0, 0, 0);

  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      excelFromDate: defaultFromDate,
      excelToDate: defaultToDate,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        excelFromDate: data.excelFromDate.toISOString(),
        excelToDate: data.excelToDate.toISOString(),
        ...searchParams,
      };

      const res = await axios.post("/api/transactions/exportExcel", payload, {
        responseType: "blob", // 👈 Bắt buộc để nhận file Excel
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `transactions-${Date.now()}.xlsx`);
      setIsOpen(false);
    } catch (error) {
      console.error("Export Excel failed", error);
      alert("Xuất Excel thất bại");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="green" variant="solid">
          Xuất Excel
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ width: 420, height: 450 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="3">
            <Dialog.Title>Chọn khoảng ngày</Dialog.Title>

            <Flex direction="column" gap="3">
              <Text className="text-sm font-medium">Từ ngày:</Text>
              <Controller
                name="excelFromDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => date && field.onChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm:ss"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm:ss"
                    placeholderText="Từ ngày và giờ"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-green-200"
                  />
                )}
              />
            </Flex>

            <Flex direction="column" gap="3">
              <Text className="text-sm font-medium">Đến ngày:</Text>
              <Controller
                name="excelToDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => date && field.onChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm:ss"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm:ss"
                    placeholderText="Đến ngày và giờ"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-green-200"
                  />
                )}
              />
            </Flex>

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close>
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-100"
                >
                  Hủy
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
              >
                Tải Excel
              </Button>
            </div>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExportExcelDialog;
