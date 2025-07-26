"use client";

import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table, Text } from "@radix-ui/themes";
import Link from "next/link";
import { ReportXNT } from "@prisma/client";
import { ReportXNTNumber } from "@/prismaRepositories";
import { RawReportXNTGroupForm } from "@/app/validationSchemas";
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
  groups?: RawReportXNTGroupForm[];
}

const ReportXNTTable = ({ searchParams, groups }: Props) => {
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
            STT
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
        {groups?.map((group) => {
          return (
            <Table.Row className="" key={group.id}>
              <Table.Cell className="text-center">{group.stt}</Table.Cell>
              <Table.Cell className="text-center">
                <Link href={`/reportXNTs/${group.headerId}/group/${group.id}`}>
                  {group.name}
                </Link>
              </Table.Cell>
              <Table.Cell className="text-right">
                {group?.tonDauKyQuantityTotal
                  ? toStringVN(+group.tonDauKyQuantityTotal, 0, 4)
                  : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {group?.tonDauKyValueTotal
                  ? toStringVN(+group.tonDauKyValueTotal, 0, 2)
                  : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {group?.nhapQuantityTotal
                  ? toStringVN(+group.nhapQuantityTotal, 0, 4)
                  : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {group?.nhapValueTotal
                  ? toStringVN(+group.nhapValueTotal, 0, 2)
                  : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {group?.xuatQuantityTotal
                  ? toStringVN(+group.xuatQuantityTotal, 0, 4)
                  : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {group?.xuatValueTotal
                  ? toStringVN(+group.xuatValueTotal, 0, 2)
                  : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {group?.tonCuoiKyQuantityTotal
                  ? toStringVN(+group.tonCuoiKyQuantityTotal, 0, 4)
                  : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {group?.tonCuoiKyValueTotal
                  ? toStringVN(+group.tonCuoiKyValueTotal, 0, 2)
                  : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {group?.xuatThucTe ? toStringVN(+group.xuatThucTe, 0, 2) : ""}
              </Table.Cell>
              <Table.Cell className="text-right">
                {group?.thue ? toStringVN(+group.thue, 0, 2) : ""}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};

export default ReportXNTTable;
