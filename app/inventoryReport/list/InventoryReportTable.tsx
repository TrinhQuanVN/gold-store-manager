"use client";

import Link from "next/link";
import { Table } from "@radix-ui/themes";
import { DateToStringVN, toStringVN } from "@/utils/formatVnNumber";

export interface InventoryReport {
  date: string;
  startValue: number;
  thu: number;
  chi: number;
  nhap: number;
  xuat: number;
  endValue: number;
}

interface Props {
  data: InventoryReport[];
}

const InventoryReportTable = ({ data }: Props) => {
  const total = data.reduce(
    (acc, row) => {
      acc.thu += row.thu;
      acc.chi += row.chi;
      acc.nhap += row.nhap;
      acc.xuat += row.xuat;
      return acc;
    },
    {
      thu: 0,
      chi: 0,
      nhap: 0,
      xuat: 0,
    }
  );

  const renderTotalRow = (label: string) => (
    <Table.Row className="bg-green-100 font-bold border-y border-gray-400">
      <Table.Cell>{label}</Table.Cell>
      <Table.Cell>{"-"}</Table.Cell>
      <Table.Cell>{toStringVN(total.thu)}</Table.Cell>
      <Table.Cell>{toStringVN(total.chi)}</Table.Cell>
      <Table.Cell>{toStringVN(total.nhap)}</Table.Cell>
      <Table.Cell>{toStringVN(total.xuat)}</Table.Cell>
      <Table.Cell>{"-"}</Table.Cell>
    </Table.Row>
  );

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Ngày</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Tồn đầu</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Thu</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Chi</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Nhập</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Xuất</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Tồn cuối</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((row) => (
          <Table.Row key={row.date}>
            <Table.Cell>{DateToStringVN(row.date, false)}</Table.Cell>
            <Table.Cell>
              {row.startValue === 0 ? "-" : toStringVN(row.startValue)}
            </Table.Cell>
            <Table.Cell>{row.thu === 0 ? "-" : toStringVN(row.thu)}</Table.Cell>
            <Table.Cell>{row.chi === 0 ? "-" : toStringVN(row.chi)}</Table.Cell>
            <Table.Cell>
              <Link
                href={`/transactions/list?isExport=false&startDate=${
                  row.date
                }&endDate=${new Date(
                  new Date(row.date).setHours(0, 0, 0, 0)
                ).toISOString()}`}
              >
                {row.nhap === 0 ? "-" : toStringVN(row.nhap)}
              </Link>
            </Table.Cell>
            <Table.Cell>
              <Link
                href={`/transactions/list?isExport=true&startDate=${
                  row.date
                }&endDate=${new Date(
                  new Date(row.date).setHours(23, 59, 59, 999)
                ).toISOString()}`}
              >
                {row.xuat === 0 ? "-" : toStringVN(row.xuat)}
              </Link>
            </Table.Cell>
            <Table.Cell>
              {row.endValue === 0 ? "-" : toStringVN(row.endValue)}
            </Table.Cell>
          </Table.Row>
        ))}
        {renderTotalRow("Tổng cộng")}
      </Table.Body>
    </Table.Root>
  );
};

export default InventoryReportTable;
