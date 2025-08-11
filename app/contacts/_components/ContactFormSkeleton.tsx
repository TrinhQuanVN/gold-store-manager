import { Box, Flex } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ContactFormSkeleton = () => {
  return (
    <Box className="max-w-xl">
      <Flex direction="column" className="gap-3">
        {/* Tên */}
        <Skeleton height="2.5rem" width="100%" borderRadius={8} />

        {/* CCCD */}
        <Skeleton height="2.5rem" width="100%" borderRadius={8} />

        {/* Địa chỉ */}
        <Skeleton height="2.5rem" width="100%" borderRadius={8} />

        {/* Nhóm khách hàng (Select.Trigger) */}
        <Skeleton height="2.5rem" width="100%" borderRadius={8} />

        {/* Số điện thoại */}
        <Skeleton height="2.5rem" width="100%" borderRadius={8} />

        {/* Mã số thuế */}
        <Skeleton height="2.5rem" width="100%" borderRadius={8} />

        {/* Ghi chú */}
        <Skeleton height="6rem" width="100%" borderRadius={8} />

        {/* Nút submit */}
        <Flex justify="start">
          <Skeleton height="2.5rem" width="8rem" borderRadius={8} />
        </Flex>
      </Flex>
    </Box>
  );
};
export default ContactFormSkeleton;
