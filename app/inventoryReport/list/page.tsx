// app/inventoryReport/list/page.tsx

import { prisma } from "@/prisma/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import InventoryReportActions from "./InventoryReportActions";
import InventoryReportTable from "./InventoryReportTable";
import { InventoryReport } from "./InventoryReportTable";
import { Flex } from "@radix-ui/themes";
import { startOfDay, endOfDay } from "date-fns";

interface Props {
  searchParams: { month?: string };
}

const InventoryReportPage = async ({ searchParams }: Props) => {
  const _params = await searchParams;
  const month = _params?.month ?? format(new Date(), "yyyy-MM");
  const [year, mon] = month.split("-").map(Number);
  const startDate = new Date(year, mon - 1, 1, 0, 0, 0);
  const endDate = endOfMonth(startDate);

  // 1. Tính tồn đầu ngày đầu tháng
  const tonDauThang = await prisma.goldInventoryAdjustment.aggregate({
    _sum: {
      weight: true,
    },
    where: {
      createdAt: { lt: startDate },
    },
  });

  const nhapDau = await prisma.goldTransactionDetail.aggregate({
    _sum: {
      weight: true,
    },
    where: {
      transactionHeader: {
        isExport: false,
        createdAt: { lt: startDate },
      },
    },
  });

  const xuatDau = await prisma.goldTransactionDetail.aggregate({
    _sum: {
      weight: true,
    },
    where: {
      transactionHeader: {
        isExport: true,
        createdAt: { lt: startDate },
      },
    },
  });

  let startValue =
    Number(tonDauThang._sum.weight || 0) +
    Number(nhapDau._sum.weight || 0) -
    Number(xuatDau._sum.weight || 0);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const inventoryReport: InventoryReport[] = [];

  for (const day of days) {
    const start = startOfDay(day);
    const end = endOfDay(day);

    const [thu, chi, nhap, xuat] = await Promise.all([
      // THU: Phiếu nhập điều chỉnh (isExport = false)
      prisma.goldInventoryAdjustment.aggregate({
        _sum: { weight: true },
        where: {
          header: {
            isExport: false,
            createdAt: { gte: start, lte: end },
          },
        },
      }),

      // CHI: Phiếu xuất điều chỉnh (isExport = true)
      prisma.goldInventoryAdjustment.aggregate({
        _sum: { weight: true },
        where: {
          header: {
            isExport: true,
            createdAt: { gte: start, lte: end },
          },
        },
      }),

      // NHẬP: Giao dịch nhập từ TransactionHeader
      prisma.goldTransactionDetail.aggregate({
        _sum: { weight: true },
        where: {
          transactionHeader: {
            isExport: false,
            createdAt: { gte: start, lte: end },
          },
        },
      }),

      // XUẤT: Giao dịch xuất từ TransactionHeader
      prisma.goldTransactionDetail.aggregate({
        _sum: { weight: true },
        where: {
          transactionHeader: {
            isExport: true,
            createdAt: { gte: start, lte: end },
          },
        },
      }),
    ]);

    const thuVal = Number(thu._sum.weight || 0);
    const chiVal = Number(chi._sum.weight || 0);
    const nhapVal = Number(nhap._sum.weight || 0);
    const xuatVal = Number(xuat._sum.weight || 0);

    const endValue = startValue + thuVal + nhapVal - chiVal - xuatVal;

    inventoryReport.push({
      date: start.toDateString(),
      startValue,
      thu: thuVal,
      chi: chiVal,
      nhap: nhapVal,
      xuat: xuatVal,
      endValue,
    });

    startValue = endValue;
  }

  return (
    <div>
      <Flex justify="center" mb="4">
        <InventoryReportActions />
      </Flex>
      <InventoryReportTable data={inventoryReport} />
    </div>
  );
};

export default InventoryReportPage;
