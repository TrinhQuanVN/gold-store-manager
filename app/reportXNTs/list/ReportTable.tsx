import { ReportXNTHeaderWithNumber } from "@/prismaRepositories";
import ReportXNTHeaderModel from "./ReportXNTHeaderModel";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Flex, Table, Text } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";

export type ReportOrderField =
  | "name"
  | "tonDauKy"
  | "nhap"
  | "xuat"
  | "tonCuoiKy";

export interface ReportQuery {
  orderBy: keyof ReportXNTHeaderModel;
  orderDirection: "asc" | "desc";
  page: string;
  pageSize: string;
}

interface Props {
  searchParams: ReportQuery;
  reports: ReportXNTHeaderModel[];
}

const ReportHeaderTable = ({ searchParams, reports }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell key={column.value}>
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
              <Text>{report.id}</Text>
            </Table.Cell>
            <Table.Cell className="">
              <Text>
                <Link href={`/reportXNTs/${report.id}`}>{report.name}</Link>
              </Text>
            </Table.Cell>
            <Table.Cell className="">
              {report.tonDauKy.toLocaleString("vi-VN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </Table.Cell>
            <Table.Cell className="">
              {report.nhapTrongKy.toLocaleString("vi-VN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </Table.Cell>
            <Table.Cell className="">
              {report.xuatTrongKy.toLocaleString("vi-VN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </Table.Cell>
            <Table.Cell className="">
              {report.tonCuoiKy.toLocaleString("vi-VN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </Table.Cell>
            <Table.Cell className="">
              {report.xuatThucTe.toLocaleString("vi-VN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </Table.Cell>
            <Table.Cell className="">
              {report.thue.toLocaleString("vi-VN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof ReportXNTHeaderModel;
}[] = [
  { label: "Id", value: "id" },
  { label: "Tên báo cáo", value: "name" },
  { label: "Tồn đầu kỳ", value: "tonDauKy" },
  { label: "Nhập trong kỳ", value: "nhapTrongKy" },
  { label: "Xuất trong kỳ", value: "xuatTrongKy" },
  { label: "Tồn cuối kỳ", value: "tonCuoiKy" },
  { label: "Xuất thực tế ", value: "xuatThucTe" },
  { label: "Thuế", value: "thue" },
];
export const columnNames = columns.map((column) => column.value);

export default ReportHeaderTable;
