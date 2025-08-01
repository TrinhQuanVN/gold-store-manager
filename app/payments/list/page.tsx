import { prisma } from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import Pagination from "@/app/components/Pagination";
import PaymentTable, {
  PaymentQuery,
  PaymentSummaryRow,
  columnNames,
} from "./paymentTable";

interface Props {
  searchParams: PaymentQuery;
}

const PaymentPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  // 1. Phân trang và sắp xếp
  const page = parseInt(params.page || "1");
  const pageSize = parseInt(params.pageSize || "10");
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const orderDirection = params.orderDirection === "desc" ? "desc" : "asc";
  const orderBy = columnNames.includes(params.orderBy ?? "date")
    ? (params.orderBy as keyof PaymentSummaryRow) ?? "date"
    : "date";

  // 2. Lấy danh sách transaction có payment
  const transactions = await prisma.transactionHeader.findMany({
    where: {
      paymentAmounts: {
        some: {},
      },
    },
    include: {
      paymentAmounts: true,
    },
    orderBy: {
      createdAt: orderDirection,
    },
    skip,
    take,
  });

  // 3. Gộp thanh toán theo transaction
  const data: PaymentSummaryRow[] = transactions.map((t) => {
    const summary: PaymentSummaryRow = {
      transactionId: t.id,
      date: t.createdAt.toISOString(),
      xuatTM: 0,
      xuatCK: 0,
      nhapTM: 0,
      nhapCK: 0,
    };

    for (const p of t.paymentAmounts) {
      const amount = Number(p.amount);
      if (t.isExport) {
        if (p.type === "TM") summary.xuatTM += amount;
        else if (p.type === "CK") summary.xuatCK += amount;
      } else {
        if (p.type === "TM") summary.nhapTM += amount;
        else if (p.type === "CK") summary.nhapCK += amount;
      }
    }

    return summary;
  });

  // 4. Đếm số transaction có payment
  const transactionCount = await prisma.transactionHeader.count({
    where: {
      paymentAmounts: {
        some: {},
      },
    },
  });

  return (
    <Flex direction="column" gap="3">
      <PaymentTable searchParams={params} data={data} />
      <Pagination
        currentPage={page}
        itemCount={transactionCount}
        pageSize={pageSize}
      />
    </Flex>
  );
};

export default PaymentPage;
