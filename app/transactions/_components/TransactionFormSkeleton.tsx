import { Box, Flex } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";
import React from "react";

const TransactionFormSkeleton = () => {
  return (
    <Box className="max-w-xl space-y-4">
      {/* Tên */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Nhóm liên hệ (Select) */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Số điện thoại */}
      <Skeleton height="2.5rem" width="100%" />

      {/* CCCD */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Mã số thuế */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Địa chỉ */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Ghi chú */}
      <Skeleton height="6rem" width="100%" />

      {/* Nút submit */}
      <Flex justify="start">
        <Skeleton height="2.5rem" width="8rem" />
      </Flex>
    </Box>
  );
};

export default TransactionFormSkeleton;
