import { Box, Flex } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";
import React from "react";

const ReportXNTHeaderFormSkeleton = () => {
  return (
    <Box className="max-w-xl space-y-4">
      {/* Tên báo cáo */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Chọn quý (Select) */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Năm */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Người nộp thuế (Select) */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Nút submit */}
      <Flex justify="start">
        <Skeleton height="2.5rem" width="8rem" />
      </Flex>
    </Box>
  );
};

export default ReportXNTHeaderFormSkeleton;
