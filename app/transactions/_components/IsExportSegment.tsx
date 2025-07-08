"use client";

import { Control, Controller } from "react-hook-form";
import { SegmentedControl } from "@radix-ui/themes";
import { TransactionInputDataForm } from "@/app/validationSchemas";
import { BackGroundTransactionFormColor } from "./TransactionForm";

interface Props {
  control: Control<any>;
}

const IsExportSegment = ({ control }: Props) => {
  return (
    <Controller
      control={control}
      name="header.isExport"
      render={({ field }) => (
        <SegmentedControl.Root
          value={field.value ? "export" : "import"}
          onValueChange={(value) => field.onChange(value === "export")}
          className="rounded-full shadow-inner bg-gray-100 p-1"
          size="3"
          variant="surface"
          radius="large"
        >
          <SegmentedControl.Item
            value="export"
            className={`
              px-4 py-1 rounded-full font-semibold transition-colors
              data-[state=active]:${BackGroundTransactionFormColor.export.bg}
              data-[state=active]:${BackGroundTransactionFormColor.export.text}
            `}
          >
            Xuất
          </SegmentedControl.Item>
          <SegmentedControl.Item
            value="import"
            className={`
              px-4 py-1 rounded-full font-semibold transition-colors
              data-[state=active]:${BackGroundTransactionFormColor.import.bg}
              data-[state=active]:${BackGroundTransactionFormColor.import.text}
            `}
          >
            Nhập
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      )}
    />
  );
};

export default IsExportSegment;
