"use client";

import * as React from "react";
import { SegmentedControl } from "@radix-ui/themes";
import { BackGroundTransactionFormColor } from "./TransactionForm";

const TransactionTypeSegment = ({
  isExport,
  setIsExport,
}: {
  isExport: boolean;
  setIsExport: (val: boolean) => void;
}) => {
  return (
    <SegmentedControl.Root
      value={isExport ? "export" : "import"}
      onValueChange={(value) => setIsExport(value === "export")}
      className="rounded-full shadow-inner bg-gray-100 p-1"
      size="3"
      variant="surface"
      radius="large"
    >
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
    </SegmentedControl.Root>
  );
};

export default TransactionTypeSegment;
