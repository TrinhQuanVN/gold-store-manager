import { reportXNTHeaderSchema } from "@/app/validationSchemas";
import { reportXNTSchema } from "@/app/validationSchemas/reportXNTSchemas";
import { prisma } from "@/prisma/client";
import { isValid } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { headerId: string } }
) {
  const body = await request.json();
  const validation = reportXNTHeaderSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;

  const _params = await params;
  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: parseInt(_params.headerId) },
  });
  if (!header) {
    return NextResponse.json({ error: "Header not found" }, { status: 404 });
  }

  // Check if groupId is provided and valid
  if (
    data.taxPayerId &&
    (await prisma.taxPayer.findUnique({
      where: { id: data.taxPayerId },
    })) === null
  ) {
    return NextResponse.json(
      { error: "Invalid tax payer id" },
      { status: 404 }
    );
  }

  const updatedHeader = await prisma.reportXNTHeader.update({
    where: { id: parseInt(_params.headerId) },
    data: {
      name: data.name ?? header.name,
      taxPayerId: data.taxPayerId ?? header.taxPayerId,
      quarter: data.quarter ?? header.quarter,
      year: data.year ?? header.year,
      startDate: data.startDate ?? header.startDate,
      endDate: data.endDate ?? header.endDate,
    },
  });

  return NextResponse.json(updatedHeader, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { headerId: string } }
) {
  const _params = await params;
  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: parseInt(_params.headerId) },
  });
  if (!header) {
    return NextResponse.json(
      { error: "report xnt header not found" },
      { status: 404 }
    );
  }
  await prisma.reportXNTHeader.delete({
    where: { id: parseInt(_params.headerId) },
  });
  return NextResponse.json(
    { message: "header deleted successfully" },
    { status: 200 }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { headerId: string } }
) {
  const _params = await params;
  const headerId = parseInt(_params.headerId);
  const url = new URL(request.url);

  if (isNaN(headerId)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  const getCuoiKy = url.searchParams.get("getCuoiKy");
  const addFromTransaction =
    url.searchParams.get("addFromTransaction") === "true";

  try {
    // Trường hợp 1: Lấy tồn cuối kỳ từ báo cáo cũ
    if (getCuoiKy) {
      const oldHeaderId = parseInt(getCuoiKy);
      if (isNaN(oldHeaderId)) {
        return NextResponse.json(
          { error: "ID báo cáo cũ không hợp lệ" },
          { status: 400 }
        );
      }

      const [newHeader, oldHeader] = await Promise.all([
        prisma.reportXNTHeader.findUnique({ where: { id: headerId } }),
        prisma.reportXNTHeader.findUnique({ where: { id: oldHeaderId } }),
      ]);

      if (!newHeader || !oldHeader) {
        return NextResponse.json(
          { error: "Không tìm thấy báo cáo" },
          { status: 404 }
        );
      }

      await prisma.$executeRaw`SELECT import_report_xnt(${oldHeaderId}, ${headerId})`;
      return NextResponse.json({ message: "Lấy tồn cuối kỳ thành công" });
    }

    // Trường hợp 2: Lấy dữ liệu từ giao dịch
    if (addFromTransaction) {
      const header = await prisma.reportXNTHeader.findUnique({
        where: { id: headerId },
      });

      if (!header) {
        return NextResponse.json(
          { error: "Không tìm thấy báo cáo" },
          { status: 404 }
        );
      }

      const { startDate, endDate } = header;

      if (!isValid(startDate) || !isValid(endDate)) {
        return NextResponse.json(
          { error: "Ngày bắt đầu/kết thúc không hợp lệ" },
          { status: 400 }
        );
      }

      const start = header.startDate
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);
      const end = header.endDate
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);

      await prisma.$executeRawUnsafe(`
        CALL import_report_xnt_from_transaction(
          ${headerId},
          '${start}'::timestamp,
          '${end}'::timestamp
        )
      `);

      return NextResponse.json({
        message: "Lấy dữ liệu từ giao dịch thành công",
      });
    }

    // Nếu không có tham số hợp lệ
    return NextResponse.json(
      { error: "Tham số không hợp lệ" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Function execution error:", error);
    return NextResponse.json(
      { error: "Lỗi trong quá trình xử lý. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
