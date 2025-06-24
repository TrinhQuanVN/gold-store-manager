import { ReportXNTHeader } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Flex, Table, Text } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";

export interface ReportQuery {
  orderBy: keyof ReportXNTHeader;
  orderDirection: "asc" | "desc";
  page: string;
  pageSize: string;
}

interface Props {
  searchParams: ReportQuery;
  reports: ReportXNTHeader[];
}

const ReportTable = ({ searchParams, reports }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}
            >
              <NextLink
                href={{
                  query: {
                    ...searchParams,
                    orderBy: column.value,
                    orderDirection:
                      searchParams.orderBy === column.value &&
                      searchParams.orderDirection === "asc"
                        ? "desc"
                        : "asc",
                  },
                }}
              >
                {column.label}
              </NextLink>
              {column.value === searchParams.orderBy && (
                <ArrowUpIcon
                  className={`inline transition-transform ${
                    searchParams.orderDirection === "desc" ? "rotate-180" : ""
                  }`}
                />
              )}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {reports.map((report) => (
          <Table.Row key={report.id}>
            <Table.Cell>
              <Flex direction="column" gap="2" align="start">
                <Link href={`/Reports/${report.id}`}>
                  {report.name} quý {report.quarter} năm {report.year}
                </Link>
                <Text>
                  Ngày tạo: {report.createdAt.toLocaleDateString("vn-VN")}
                </Text>
              </Flex>
            </Table.Cell>
            <Table.Cell className="">
              <Flex direction="column" gap="2">
                <Text color="grass" weight="medium">
                  Nhập: {report.nhapValue}
                </Text>
                <Text color="tomato" weight="medium">
                  Xuất: {report.xuatValue}
                </Text>
              </Flex>
            </Table.Cell>
            <Table.Cell className="">{report.tonCuoiKyValue}</Table.Cell>
            <Table.Cell className="">{report.xuatThucTeValue}</Table.Cell>
            <Table.Cell className="">{report.thueValue}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof ReportXNTHeader;
  className?: string;
}[] = [
  { label: "Tên báo cáo", value: "startDate" },
  {
    label: "Tồn đầu kỳ",
    value: "tonDauKyValue",
  },
  {
    label: "Nhập/Xuất trong kỳ",
    value: "nhapValue",
  },
  {
    label: "Tồn cuối kỳ",
    value: "tonCuoiKyValue",
  },
  {
    label: "Xuất thực tế",
    value: "xuatThucTeValue",
  },
  {
    label: "Thuế",
    value: "thueValue",
  },
];

export const columnNames = columns.map((column) => column.value);

export default ReportTable;
