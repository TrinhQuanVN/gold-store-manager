"use client";

import { RawReportXNTGroupForm } from "@/app/validationSchemas";
import { toStringVN } from "@/utils";
import { ReportXNT } from "@prisma/client";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import { useMemo } from "react";

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
  const total = useMemo(() => {
    if (!groups) {
      return {
        tonDauKyQuantityTotal: 0,
        tonDauKyValueTotal: 0,
        nhapQuantityTotal: 0,
        nhapValueTotal: 0,
        xuatQuantityTotal: 0,
        xuatValueTotal: 0,
        tonCuoiKyQuantityTotal: 0,
        tonCuoiKyValueTotal: 0,
        xuatThucTe: 0,
        thue: 0,
      };
    }

    return groups.reduce(
      (acc, group) => ({
        tonDauKyQuantityTotal:
          acc.tonDauKyQuantityTotal +
          parseFloat(group.tonDauKyQuantityTotal || "0"),
        tonDauKyValueTotal:
          acc.tonDauKyValueTotal + parseFloat(group.tonDauKyValueTotal || "0"),
        nhapQuantityTotal:
          acc.nhapQuantityTotal + parseFloat(group.nhapQuantityTotal || "0"),
        nhapValueTotal:
          acc.nhapValueTotal + parseFloat(group.nhapValueTotal || "0"),
        xuatQuantityTotal:
          acc.xuatQuantityTotal + parseFloat(group.xuatQuantityTotal || "0"),
        xuatValueTotal:
          acc.xuatValueTotal + parseFloat(group.xuatValueTotal || "0"),
        tonCuoiKyQuantityTotal:
          acc.tonCuoiKyQuantityTotal +
          parseFloat(group.tonCuoiKyQuantityTotal || "0"),
        tonCuoiKyValueTotal:
          acc.tonCuoiKyValueTotal +
          parseFloat(group.tonCuoiKyValueTotal || "0"),
        xuatThucTe: acc.xuatThucTe + parseFloat(group.xuatThucTe || "0"),
        thue: acc.thue + parseFloat(group.thue || "0"),
      }),
      {
        tonDauKyQuantityTotal: 0,
        tonDauKyValueTotal: 0,
        nhapQuantityTotal: 0,
        nhapValueTotal: 0,
        xuatQuantityTotal: 0,
        xuatValueTotal: 0,
        tonCuoiKyQuantityTotal: 0,
        tonCuoiKyValueTotal: 0,
        xuatThucTe: 0,
        thue: 0,
      }
    );
  }, [groups]);
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
        <Table.Row className="font-bold bg-gray-100">
          <Table.Cell className="text-center" colSpan={2}>
            Tổng
          </Table.Cell>
          <Table.Cell className="text-right">
            {toStringVN(total.tonDauKyQuantityTotal, 0, 4)}
          </Table.Cell>
          <Table.Cell className="text-right">
            {toStringVN(total.tonDauKyValueTotal, 0, 2)}
          </Table.Cell>
          <Table.Cell className="text-right">
            {toStringVN(total.nhapQuantityTotal, 0, 4)}
          </Table.Cell>
          <Table.Cell className="text-right">
            {toStringVN(total.nhapValueTotal, 0, 2)}
          </Table.Cell>
          <Table.Cell className="text-right">
            {toStringVN(total.xuatQuantityTotal, 0, 4)}
          </Table.Cell>
          <Table.Cell className="text-right">
            {toStringVN(total.xuatValueTotal, 0, 2)}
          </Table.Cell>
          <Table.Cell className="text-right">
            {toStringVN(total.tonCuoiKyQuantityTotal, 0, 4)}
          </Table.Cell>
          <Table.Cell className="text-right">
            {toStringVN(total.tonCuoiKyValueTotal, 0, 2)}
          </Table.Cell>
          <Table.Cell className="text-right">
            {toStringVN(total.xuatThucTe, 0, 2)}
          </Table.Cell>
          <Table.Cell className="text-right">
            {toStringVN(total.thue, 0, 2)}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};

export default ReportXNTTable;
