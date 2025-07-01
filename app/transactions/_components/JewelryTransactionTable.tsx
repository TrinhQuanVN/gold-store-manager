"use client";

import { useMemo, useRef, useState } from "react";
import {
  DataGrid,
  SelectColumn,
  textEditor,
  type Column,
  type DataGridHandle,
  type SortColumn,
  RowsChangeData,
} from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { Flex, Text } from "@radix-ui/themes";
import {
  GoldPrice,
  Jewelry,
  JewelryCategory,
  JewelryTransactionDetail,
  JewelryType,
} from "@prisma/client";
import axios from "axios";
import JewelryBadge from "@/app/components/JewelryBadge";

// Row type
type Row = {
  internalId: number; // Unique identifier for the row
  jewelryId?: string;
  jewelryCode?: string;
  fullName?: {
    jewelryName?: string;
    typeName?: string;
    typeColor?: string;
    categoryName?: string;
    categoryColor?: string;
  };
  weight: number;
  price: number;
  discount: number;
  amount: number;
};

// Summary row
type SummaryRow = {
  id: string;
  totalCount: number;
  totalWeight: number;
  totalDiscount: number;
  totalAmount: number;
};

function rowKeyGetter(row: Row) {
  return row.internalId;
}

function createInitialRows(): Row[] {
  return Array.from({ length: 5 }, (_, i) => {
    return {
      internalId: i,
      jewelryId: "",
      jewelryCode: "",
      fullName: {},
      weight: 0,
      price: 0,
      discount: 0,
      amount: 0,
    };
  });
}
type JewelryWithTypeAndCategory = Jewelry & {
  category: JewelryCategory;
  jewelryType: JewelryType;
};

type JewelryTransactionWithJewelry = JewelryTransactionDetail & {
  jewelry: Jewelry;
};

function formatNumberVN(
  value: number,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 0
) {
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(value);
}

interface Props {
  jewelryTransactionDetail?: JewelryTransactionWithJewelry[];
  transactionDate?: Date;
}
export default function JewelryTransactionTable({
  jewelryTransactionDetail,
  transactionDate,
}: Props) {
  transactionDate = transactionDate || new Date();
  // Initialize grid reference and state
  const gridRef = useRef<DataGridHandle>(null);
  const [rows, setRows] = useState<Row[]>(createInitialRows);
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const columns: readonly Column<Row, SummaryRow>[] = [
    SelectColumn,
    {
      key: "jewelryId",
      name: "ID",
      editable: true,

      renderEditCell: textEditor,
      frozen: true,
      renderSummaryCell() {
        return <strong className="text-red-600 font-semibold">Total</strong>;
      },
    },
    {
      key: "jewelryCode",
      name: "Mã nhà",
      editable: true,

      renderEditCell: textEditor,
      frozen: true,
    },
    {
      key: "fullName",
      name: "Tên sản phẩm",
      renderCell({ row }) {
        return row.fullName ? (
          <Flex>
            <Text className="">{row.fullName.jewelryName}</Text>
            <JewelryBadge
              jewelryType={{
                name: row.fullName.typeName!,
                color: row.fullName.typeColor!,
              }}
              category={{
                name: row.fullName.categoryName!,
                color: row.fullName.categoryColor!,
              }}
            />
          </Flex>
        ) : (
          <Text className="">""</Text>
        );
      },
      renderSummaryCell({ row }) {
        return (
          <Text className="text-red-600">{`${row.totalCount} sản phẩm`}</Text>
        );
      },
    },
    {
      key: "weight",
      name: "Trọng lượng",
      editable: true,
      renderCell({ row }) {
        return formatNumberVN(row.weight, 0, 4);
      },
      renderEditCell: textEditor,
      renderSummaryCell({ row }) {
        return (
          <Text className="text-red-600">
            {formatNumberVN(row.totalWeight, 4, 4)}
          </Text>
        );
      },
    },
    {
      key: "price",
      name: "Đơn giá",
      editable: true,
      renderCell({ row }) {
        return formatNumberVN(row.price);
      },
      renderEditCell: textEditor,
    },
    {
      key: "discount",
      name: "Giảm giá",
      editable: true,
      renderCell({ row }) {
        return formatNumberVN(row.discount);
      },
      renderEditCell: textEditor,
      renderSummaryCell({ row }) {
        return (
          <Text className="text-red-600">
            {new Intl.NumberFormat("vi-VN").format(row.totalDiscount)}
          </Text>
        );
      },
    },
    {
      key: "amount",
      name: "Thành tiền",
      renderCell({ row }) {
        return formatNumberVN(row.amount);
      },
      renderSummaryCell({ row }) {
        return (
          <Text className="text-red-600">
            {new Intl.NumberFormat("vi-VN").format(row.totalAmount)}
          </Text>
        );
      },
    },
  ];

  const summaryRows = useMemo<SummaryRow[]>(() => {
    const totalWeight = rows.reduce((sum, r) => sum + r.weight, 0);
    const totalDiscount = rows.reduce((sum, r) => sum + r.discount, 0);
    const totalAmount = rows.reduce((sum, r) => sum + r.amount, 0);
    const totalCount = rows.filter((r) => r.jewelryId?.trim()).length;
    return [
      {
        id: "summary",
        totalCount,
        totalWeight,
        totalDiscount,
        totalAmount,
      },
    ];
  }, [rows]);

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) return rows;

    return [...rows].sort((a, b) => {
      for (const sort of sortColumns) {
        const { columnKey, direction } = sort;
        const aValue = a[columnKey as keyof Row];
        const bValue = b[columnKey as keyof Row];

        if (aValue === bValue) continue;
        const result =
          typeof aValue === "string"
            ? String(aValue).localeCompare(String(bValue))
            : Number(aValue) - Number(bValue);

        return direction === "ASC" ? result : -result;
      }
      return 0;
    });
  }, [rows, sortColumns]);

  async function handleRowsChange(
    updatedRows: Row[],
    data: RowsChangeData<any, any>
  ) {
    const columnName = data.column.key;
    const index = data.indexes[0];
    const row = updatedRows[index];

    const oldRow = rows[index];

    // Trường hợp xóa jewelryId hoặc jewelryCode => reset dòng
    if (columnName === "jewelryId" || columnName === "jewelryCode") {
      // Reset dòng CHỈ khi jewelryId rỗng
      if (columnName === "jewelryId" && !row.jewelryId?.trim()) {
        updatedRows[index] = {
          internalId: row.internalId,
          jewelryId: "",
          jewelryCode: "",
          fullName: {},
          weight: 0,
          price: 0,
          discount: 0,
          amount: 0,
        };
        setRows([...updatedRows]);
        return;
      }

      try {
        let jewelry: JewelryWithTypeAndCategory | null = null;

        if (columnName === "jewelryId" && row.jewelryId !== oldRow.jewelryId) {
          const res = await axios.get<JewelryWithTypeAndCategory>(
            `/api/jewelry/${row.jewelryId}`
          );
          jewelry = res.data;
        }

        if (
          columnName === "jewelryCode" &&
          row.jewelryCode !== oldRow.jewelryCode
        ) {
          const res = await axios.get<JewelryWithTypeAndCategory>(
            `/api/jewelry?code=${row.jewelryCode}`
          );
          jewelry = res.data;
        }

        if (jewelry) {
          const priceRes = await axios.get<GoldPrice>(`/api/goldPrices`, {
            params: { date: transactionDate?.toISOString() },
          });

          const price =
            ((priceRes.data?.sell * jewelry.jewelryType.goldPercent) / 100) *
              1000 || 0;
          const weight = Number(row.weight) || 0;
          const discount = Number(row.discount) || 0;
          const amount = weight * price - discount;

          updatedRows[index] = {
            ...row,
            jewelryId: jewelry.id.toString(),
            jewelryCode: jewelry.supplierId ?? "",
            fullName: {
              jewelryName: jewelry.name,
              categoryName: jewelry.category.name,
              categoryColor: jewelry.category.color!,
              typeName: jewelry.jewelryType.name,
              typeColor: jewelry.jewelryType.color!,
            },
            price: price,
            weight: jewelry.totalWeight,
            discount: discount,
            amount: amount,
          };

          setRows([...updatedRows]);
          return;
        }
      } catch (error) {
        console.error("Lỗi khi lấy jewelry hoặc giá:", error);
      }
    }

    // Ép kiểu tất cả các field cần thiết sang number
    const weight = Number(row.weight) || 0;
    const price = Number(row.price) || 0;
    const discount = Number(row.discount) || 0;

    // Tính lại amount
    const amount = weight * price - discount;

    // Gán lại dòng đã chuẩn hoá vào mảng
    updatedRows[index] = {
      ...row,
      weight: weight,
      price: price,
      discount: discount,
      amount: amount,
    };

    setRows(updatedRows);
  }
  return (
    <DataGrid
      ref={gridRef}
      aria-label="Gold Table"
      columns={columns}
      rows={sortedRows}
      rowKeyGetter={rowKeyGetter}
      onRowsChange={handleRowsChange}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      sortColumns={sortColumns}
      onSortColumnsChange={setSortColumns}
      topSummaryRows={summaryRows}
      defaultColumnOptions={{
        resizable: true,
        sortable: true,
      }}
      className="w-full h-full rdg rdg-light"
    />
  );
}
