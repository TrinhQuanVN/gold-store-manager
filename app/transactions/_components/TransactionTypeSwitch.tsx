"use client";

import * as React from "react";
import * as Switch from "@radix-ui/react-switch";

const TransactionTypeSwitch = ({
  isExport,
  setIsExport,
}: {
  isExport: boolean;
  setIsExport: (val: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border">
      <Switch.Root
        id="transaction-type"
        checked={isExport}
        onCheckedChange={setIsExport}
        className="w-[42px] h-[25px] bg-gray-300 rounded-full relative data-[state=checked]:bg-red-500 transition-colors"
      >
        <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-100 translate-x-1 data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
      <label
        htmlFor="transaction-type"
        className="text-sm font-medium text-gray-700"
      >
        {isExport ? "Xuất hàng" : "Nhập hàng"}
      </label>
    </div>
  );
};

export default TransactionTypeSwitch;
