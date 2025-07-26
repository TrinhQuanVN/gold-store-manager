import { RawReportXNTHeaderForm } from "@/app/validationSchemas";
import { toStringVN } from "@/utils";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table, Text } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";

export type ReportOrderField =
  | "name"
  | "tonDauKy"
  | "nhap"
  | "xuat"
  | "tonCuoiKy";

export interface ReportQuery {
  orderBy: keyof RawReportXNTHeaderForm;
  orderDirection: "asc" | "desc";
  page: string;
  pageSize: string;
}

interface Props {
  searchParams: ReportQuery;
  reports: RawReportXNTHeaderForm[];
}

const ReportHeaderTable = ({ searchParams, reports }: Props) => {
  return (
    <Table.Root variant="surface">
      {/* <Table.Header>
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
      </Table.Header> */}

      <Table.Header>
        <Table.Row>
          {/* <Table.ColumnHeaderCell
            rowSpan={2}
            style={{
              verticalAlign: "middle",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            ID
          </Table.ColumnHeaderCell> */}
          <Table.ColumnHeaderCell
            rowSpan={2}
            style={{
              verticalAlign: "middle",
              textAlign: "center",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Tên báo cáo
          </Table.ColumnHeaderCell>

          <Table.ColumnHeaderCell
            colSpan={2}
            style={{ textAlign: "center", borderRight: "1px solid #e5e7eb" }}
          >
            Tồn đầu kỳ
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            colSpan={2}
            style={{ textAlign: "center", borderRight: "1px solid #e5e7eb" }}
          >
            Nhập
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            colSpan={2}
            style={{ textAlign: "center", borderRight: "1px solid #e5e7eb" }}
          >
            Xuất
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            colSpan={2}
            style={{ textAlign: "center", borderRight: "1px solid #e5e7eb" }}
          >
            Tồn cuối kỳ
          </Table.ColumnHeaderCell>

          <Table.ColumnHeaderCell
            rowSpan={2}
            style={{
              verticalAlign: "middle",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Xuất thực tế
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            rowSpan={2}
            style={{ verticalAlign: "middle" }}
          >
            Thuế
          </Table.ColumnHeaderCell>
        </Table.Row>

        <Table.Row>
          <Table.ColumnHeaderCell
            style={{
              textAlign: "center",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Trọng lượng
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            style={{
              textAlign: "center",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Giá trị
          </Table.ColumnHeaderCell>

          <Table.ColumnHeaderCell
            style={{
              textAlign: "center",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Trọng lượng
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            style={{
              textAlign: "center",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Giá trị
          </Table.ColumnHeaderCell>

          <Table.ColumnHeaderCell
            style={{
              textAlign: "center",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Trọng lượng
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            style={{
              textAlign: "center",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Giá trị
          </Table.ColumnHeaderCell>

          <Table.ColumnHeaderCell
            style={{
              textAlign: "center",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Trọng lượng
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            style={{
              textAlign: "center",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Giá trị
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {reports.map((report) => (
          <Table.Row key={report.id}>
            {/* <Table.Cell>
              <Text>{report.id}</Text>
            </Table.Cell> */}
            <Table.Cell>
              <Link
                href={`/reportXNTs/${report.id}`}
                className="text-blue-400 font-semibold hover:underline hover:text-blue-600 transition"
              >
                {report.name} quý {report.quarter}/{report.year}
              </Link>
            </Table.Cell>

            <Table.Cell>
              {report?.tonDauKyQuantityTotal
                ? toStringVN(+report.tonDauKyQuantityTotal, 0, 4)
                : ""}
            </Table.Cell>
            <Table.Cell>
              {report?.tonDauKyValueTotal
                ? toStringVN(+report.tonDauKyValueTotal, 0, 4)
                : ""}
            </Table.Cell>

            <Table.Cell>
              {report?.nhapQuantityTotal
                ? toStringVN(+report.nhapQuantityTotal, 0, 4)
                : ""}
            </Table.Cell>
            <Table.Cell>
              {report?.nhapValueTotal
                ? toStringVN(+report.nhapValueTotal, 0, 4)
                : ""}
            </Table.Cell>

            <Table.Cell>
              {report?.xuatQuantityTotal
                ? toStringVN(+report.xuatQuantityTotal, 0, 4)
                : ""}
            </Table.Cell>
            <Table.Cell>
              {report?.xuatValueTotal
                ? toStringVN(+report.xuatValueTotal, 0, 4)
                : ""}
            </Table.Cell>

            <Table.Cell>
              {report?.tonCuoiKyQuantityTotal
                ? toStringVN(+report.tonCuoiKyQuantityTotal, 0, 4)
                : ""}
            </Table.Cell>
            <Table.Cell>
              {report?.tonCuoiKyValueTotal
                ? toStringVN(+report.tonCuoiKyValueTotal, 0, 4)
                : ""}
            </Table.Cell>
            <Table.Cell>
              {report?.xuatThucTe ? toStringVN(+report.xuatThucTe, 0, 4) : ""}
            </Table.Cell>
            <Table.Cell>
              {report?.thue ? toStringVN(+report.thue, 0, 4) : ""}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof RawReportXNTHeaderForm;
}[] = [
  { label: "Id", value: "id" },
  { label: "Tên báo cáo", value: "name" },

  { label: "Trọng lượng", value: "tonDauKyQuantityTotal" },
  { label: "Giá trị", value: "tonDauKyValueTotal" },

  { label: "Trọng lượng", value: "nhapQuantityTotal" },
  { label: "Giá trị", value: "nhapValueTotal" },

  { label: "Trọng lượng", value: "xuatQuantityTotal" },
  { label: "Giá trị", value: "xuatValueTotal" },

  { label: "Trọng lượng", value: "tonCuoiKyQuantityTotal" },
  { label: "Giá trị", value: "tonCuoiKyValueTotal" },

  { label: "Xuất thực tế ", value: "xuatThucTe" },
  { label: "Thuế", value: "thue" },
];
export const columnNames = columns.map((column) => column.value);

export default ReportHeaderTable;
