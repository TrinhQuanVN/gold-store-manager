import { Box, Flex } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";

const JewelryFormSkeleton = () => {
  return (
    <Box className="max-w-xl space-y-4">
      {/* Tên */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Trọng lượng vàng */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Loại vàng */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Loại trang sức */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Tên đá quý */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Trọng lượng đá quý */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Tổng trọng lượng */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Mã báo cáo XNT */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Mã nhà cung cấp */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Xuất xứ */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Kích thước */}
      <Skeleton height="2.5rem" width="100%" />

      {/* Ghi chú */}
      <Skeleton height="6rem" width="100%" />

      {/* Checkbox còn trong kho */}
      <Flex align="center" gap="3">
        <Skeleton height="1.2rem" width="1.2rem" />
        <Skeleton height="1rem" width="6rem" />
      </Flex>

      {/* Nút submit */}
      <Flex justify="start">
        <Skeleton height="2.5rem" width="8rem" />
      </Flex>
    </Box>
  );
};

export default JewelryFormSkeleton;
