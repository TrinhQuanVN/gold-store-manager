import { Skeleton } from "@/app/components";
import { Table } from "@radix-ui/themes";
import ReportAction from "./ReportAction";

const LoadingReportPage = () => {
  const skeletonRows = [1, 2, 3, 4, 5];

  return (
    <div>
      <ReportAction />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Tên báo cáo</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Nhập/Xuất trong kỳ</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tồn cuối kỳ</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Xuất thực tế</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Thuế</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {skeletonRows.map((row) => (
            <Table.Row key={row}>
              <Table.Cell>
                <Skeleton />
                <div className="mt-1">
                  <Skeleton />
                </div>
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
                <div className="mt-1">
                  <Skeleton />
                </div>
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
    </div>
  );
};

export default LoadingReportPage;
