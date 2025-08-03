import { Box, Card, Flex, Grid, Skeleton, Table, Text } from "@radix-ui/themes";

const LoadingContactTransactionsPage = () => {
  return (
    <Flex direction="column" gap="6">
      {/* Thông tin liên hệ giống trang contact detail */}
      <Grid columns={{ initial: "1", sm: "5" }} gap="5">
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
                  "Căn cước",
                  "Địa chỉ",
                  "Điện thoại",
                  "Mã số thuế",
                  "Ghi chú",
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

      {/* Tiêu đề */}
      <Text size="5" weight="bold">
        <Skeleton height="2rem" width="30%" />
      </Text>

      {/* Bảng giao dịch */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {Array.from({ length: 8 }).map((_, i) => (
              <Table.ColumnHeaderCell key={i}>
                <Skeleton height="1rem" width="80%" />
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <Table.Row key={rowIndex}>
              {Array.from({ length: 8 }).map((_, colIndex) => (
                <Table.Cell key={colIndex}>
                  <Skeleton height="1rem" width="100%" />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Summary */}
      <Box className="mt-4 px-2 py-3 border rounded bg-gray-50">
        <Text size="3">
          <Skeleton height="1.2rem" width="80%" />
        </Text>
      </Box>
    </Flex>
  );
};

export default LoadingContactTransactionsPage;
