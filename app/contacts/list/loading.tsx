import { Skeleton } from "@/app/components";
import { Flex, Table } from "@radix-ui/themes";
import ContactActions from "./ContactActions";

const LoadingContactPage = () => {
  const rows = Array.from({ length: 10 }, (_, i) => i); // khớp pageSize mặc định 10

  return (
    <div className="space-y-3">
      {/* Search form skeleton */}
      <form>
        <Flex gap="3" wrap="wrap" align="end">
          <Skeleton height="2.25rem" width={200} borderRadius={8} />
          <Skeleton height="2.25rem" width={200} borderRadius={8} />
          <Skeleton height="2.25rem" width={200} borderRadius={8} />
          <Skeleton height="2.25rem" width={200} borderRadius={8} />
          <Skeleton height="2.25rem" width={100} borderRadius={8} />
        </Flex>
      </form>

      {/* Actions (nút tạo mới, export...) */}
      <Flex gap="2">
        {/* Nếu ContactActions có layout cụ thể, có thể giữ component thật.
            Ở đây thêm skeleton để tránh layout shift khi component đang load */}
        <Skeleton height="2.25rem" width={120} borderRadius={8} />
        <Skeleton height="2.25rem" width={120} borderRadius={8} />
      </Flex>

      {/* Hoặc giữ ContactActions thật nếu không cần skeleton thay thế */}
      <ContactActions />

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tên khách hàng</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Căn cước</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Địa chỉ</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Điện thoại</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Khách bán</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Khách mua</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Ghi chú</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows.map((key) => (
            <Table.Row key={key}>
              {/* Id */}
              <Table.Cell>
                <Skeleton height={16} width={36} borderRadius={6} />
              </Table.Cell>

              {/* Tên + badge nhóm */}
              <Table.Cell>
                <div className="flex flex-col gap-2">
                  <Skeleton height={16} width={180} borderRadius={6} />
                  {/* badge nhỏ */}
                  <Skeleton height={18} width={100} borderRadius={999} />
                </div>
              </Table.Cell>

              {/* CCCD */}
              <Table.Cell>
                <Skeleton height={16} width={140} borderRadius={6} />
              </Table.Cell>

              {/* Địa chỉ */}
              <Table.Cell>
                <Skeleton height={16} width={260} borderRadius={6} />
              </Table.Cell>

              {/* Điện thoại */}
              <Table.Cell>
                <Skeleton height={16} width={120} borderRadius={6} />
              </Table.Cell>

              {/* Khách bán */}
              <Table.Cell>
                <Skeleton height={16} width={100} borderRadius={6} />
              </Table.Cell>

              {/* Khách mua */}
              <Table.Cell>
                <Skeleton height={16} width={100} borderRadius={6} />
              </Table.Cell>

              {/* Ghi chú */}
              <Table.Cell>
                <Skeleton height={16} width={200} borderRadius={6} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default LoadingContactPage;
