import { Skeleton } from "@/app/components";
import { Table, Flex } from "@radix-ui/themes";
import GoldPriceActions from "./GoldPriceActions";

const LoadingGoldPricesPage = () => {
  return (
    <Flex direction="column" gap="3">
      <GoldPriceActions />
      <Flex gap="3" align="end" wrap="wrap">
        <Skeleton className="h-9 w-[150px]" />
        <Skeleton className="h-9 w-[150px]" />
        <Skeleton className="h-9 w-[100px]" />
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tên</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Giá mua</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Giá bán</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Ngày tạo</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {Array.from({ length: 5 }).map((_, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default LoadingGoldPricesPage;
