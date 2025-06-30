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
import { Text } from "@radix-ui/themes";
import { Gold, GoldPrice, GoldTransactionDetail } from "@prisma/client";
import axios from "axios";

// Row type
type Row = {
  internalId: number; // Unique identifier for the row
  goldId?: string;
  name?: string;
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
      goldId: "",
      name: "",
      weight: 0,
      price: 0,
      discount: 0,
      amount: 0,
    };
  });
}
type GoldTransactionDetailWithGold = GoldTransactionDetail & {
  gold: Gold;
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
  golDetails?: GoldTransactionDetailWithGold[];
  transactionDate?: Date;
}
export default function GoldTable({ golDetails, transactionDate }: Props) {
  transactionDate = transactionDate || new Date();
  // Initialize grid reference and state
  const gridRef = useRef<DataGridHandle>(null);
  const [rows, setRows] = useState<Row[]>(createInitialRows);
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const columns: readonly Column<Row, SummaryRow>[] = [
    SelectColumn,
    {
      key: "goldId",
      name: "ID",
      editable: true,

      renderEditCell: textEditor,
      frozen: true,
      renderSummaryCell() {
        return <strong className="text-red-600 font-semibold">Total</strong>;
      },
    },
    {
      key: "name",
      name: "Tên",
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
    const totalCount = rows.filter((r) => r.name?.trim()).length;
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
    // Trường hợp người dùng xóa goldId => reset dòng
    if (columnName === "goldId") {
      if (!row.goldId?.trim()) {
        updatedRows[index] = {
          internalId: row.internalId,
          goldId: "",
          name: "",
          weight: 0,
          price: 0,
          discount: 0,
          amount: 0,
        };

        setRows(updatedRows);
        return;
      }
      // Lấy row cũ từ state để so sánh
      const oldRow = rows[index];

      // Nếu giá trị goldId đã đổi
      if (row.goldId !== oldRow.goldId) {
        try {
          // 1. Lấy thông tin gold
          const goldRes = await axios.get<Gold>(`/api/gold/${row.goldId}`);
          const gold = goldRes.data;

          // 2. Lấy giá theo ngày
          const priceRes = await axios.get<GoldPrice>(`/api/goldPrices`, {
            params: { date: transactionDate?.toISOString() },
          });

          const goldPrice = priceRes.data?.sell;

          const price = Number(goldPrice) || 0;
          const weight = Number(row.weight) || 0;
          const discount = Number(row.discount) || 0;
          const amount = weight * price - discount;

          // 3. Cập nhật lại dòng
          updatedRows[index] = {
            ...row,
            name: gold.name,
            price,
            weight,
            discount,
            amount,
          };

          setRows([...updatedRows]);
          return;
        } catch (error) {
          console.error("Lỗi khi lấy thông tin gold hoặc giá:", error);
          // Optionally: reset dòng hoặc hiển thị lỗi
        }
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
      weight,
      price,
      discount,
      amount,
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
