"use client";

import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table, Text } from "@radix-ui/themes";
import Link from "next/link";
import { ReportXNT } from "@prisma/client";
import { ReportXNTNumber } from "@/prismaRepositories";
import {
  RawReportXNTForm,
  RawReportXNTGroupForm,
} from "@/app/validationSchemas";
import { Collapsible } from "radix-ui";
import { useState } from "react";
import { toStringVN } from "@/utils";

export type ReportXNTOrderField = keyof ReportXNT;

export interface ReportXNTQuery {
  orderBy: ReportXNTOrderField;
  orderDirection: "asc" | "desc";
  page: string;
  pageSize: string;
}

interface Props {
  searchParams: ReportXNTQuery;
  headerId: number;
  reports?: RawReportXNTForm[];
}

const ReportXNTTable = ({ searchParams, headerId, reports }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell
            rowSpan={2}
            style={{
              verticalAlign: "middle",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            ID
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            rowSpan={2}
            style={{
              verticalAlign: "middle",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Tên nhóm sản phẩm
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
        {reports?.map((report) => {
          return (
            <Table.Row className="" key={report.id}>
              <Table.Cell className="text-center">{report.id}</Table.Cell>
              <Table.Cell className="text-center">
                <Link
                  href={`/reportXNTs/${headerId}/group/${report.groupId}/report/${report.id}`}
                >
                  {report.name}
                </Link>
              </Table.Cell>
              <Table.Cell className="text-right">
                {report?.tonDauKyQuantity
                  ? toStringVN(+report.tonDauKyQuantity)
                  : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {report?.tonDauKyValue ? toStringVN(+report.tonDauKyValue) : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {report?.nhapQuantity ? toStringVN(+report.nhapQuantity) : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {report?.nhapValue ? toStringVN(+report.nhapValue) : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {report?.xuatQuantity ? toStringVN(+report.xuatQuantity) : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {report?.xuatValue ? toStringVN(+report.xuatValue) : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {report?.tonCuoiKyQuantity
                  ? toStringVN(+report.tonCuoiKyQuantity)
                  : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {report?.tonCuoiKyValue
                  ? toStringVN(+report.tonCuoiKyValue)
                  : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {report?.xuatThucTe ? toStringVN(+report.xuatThucTe) : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {report?.thue ? toStringVN(+report.thue) : ""}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};

export default ReportXNTTable;
