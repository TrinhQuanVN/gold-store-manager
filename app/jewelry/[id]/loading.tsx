import { Box, Card, Flex, Grid, Skeleton, Text } from "@radix-ui/themes";

const LoadingJewelryDetailPage = () => {
  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      {/* Chi tiết trang sức */}
      <Box className="md:col-span-4">
        <Card size="3" style={{ maxWidth: 600 }}>
          <Flex direction="column" gap="4">
            {/* Header: Tên + Badge */}
            <Flex justify="between" align="center">
              <Skeleton height="2rem" width="50%" />
              <Skeleton height="1.5rem" width="5rem" />
            </Flex>

            {/* Thông tin chi tiết */}
            <Flex direction="column" gap="2">
              {[
                "Mã trang sức",
                "Vàng",
                "Đá",
                "Tổng trọng lượng",
                "Loại đá",
                "Xuất xứ",
                "Kích thước",
                "Mã báo cáo",
                "Mô tả",
              ].map((label) => (
                <Text key={label}>
                  <strong>{label}:</strong>{" "}
                  <Skeleton height="1rem" width="60%" />
                </Text>
              ))}

              <Text size="1" color="gray">
                <Skeleton height="0.75rem" width="40%" />
              </Text>
            </Flex>
          </Flex>
        </Card>
      </Box>

      {/* Cột nút chức năng */}
      <Box>
        <Flex direction="column" gap="4">
          <Skeleton height="2.5rem" width="100%" />
          <Skeleton height="2.5rem" width="100%" />
        </Flex>
      </Box>
    </Grid>
  );
};

export default LoadingJewelryDetailPage;
