"use client";

import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table, Text } from "@radix-ui/themes";
import Link from "next/link";
import { ReportXNT } from "@prisma/client";

export type ReportXNTOrderField = keyof ReportXNT;

export interface ReportXNTQuery {
  orderBy: ReportXNTOrderField;
  orderDirection: "asc" | "desc";
  page: string;
  pageSize: string;
}

interface Props {
  searchParams: ReportXNTQuery;
  reports: ReportXNT[];
}

const ReportXNTTable = ({ searchParams, reports }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell rowSpan={2}>ID</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell rowSpan={2}>Tên</Table.ColumnHeaderCell>

          {/* Gộp 2 ô: Trọng lượng và Giá trị */}
          <Table.ColumnHeaderCell colSpan={2} className="text-center">
            Tồn đầu kỳ
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={2} className="text-center">
            Nhập
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={2} className="text-center">
            Xuất
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={2} className="text-center">
            Tồn cuối kỳ
          </Table.ColumnHeaderCell>
        </Table.Row>

        <Table.Row>
          {[
            "Trọng lượng",
            "Giá trị",
            "Trọng lượng",
            "Giá trị",
            "Trọng lượng",
            "Giá trị",
            "Trọng lượng",
            "Giá trị",
          ].map((label, i) => (
            <Table.ColumnHeaderCell key={i} className="text-right">
              {label}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {reports.map((r) => (
          <Table.Row key={r.id}>
            <Table.Cell>{r.id}</Table.Cell>
            <Table.Cell>
              <Link href={`/reportXNTs/${r.headerId}/${r.id}`}>{r.name}</Link>
            </Table.Cell>
            <Table.Cell className="text-right">{r.tonDauKyQuantity}</Table.Cell>
            <Table.Cell className="text-right">{r.tonDauKyValue}</Table.Cell>
            <Table.Cell className="text-right">{r.nhapQuantity}</Table.Cell>
            <Table.Cell className="text-right">{r.nhapValue}</Table.Cell>
            <Table.Cell className="text-right">{r.xuatQuantity}</Table.Cell>
            <Table.Cell className="text-right">{r.xuatValue}</Table.Cell>
            <Table.Cell className="text-right">
              {r.tonCuoiKyQuantity}
            </Table.Cell>
            <Table.Cell className="text-right">{r.tonCuoiKyValue}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ReportXNTTable;
