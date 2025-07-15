import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import { DataList, Flex, Heading, Text } from "@radix-ui/themes";
import { Gold, Jewelry, ReportXNT } from "@prisma/client";

const format = (value: number, digits = 0) =>
  value.toLocaleString("vi-VN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });

const ReportXNTDetail = ({
  report,
}: {
  report: ReportXNT & { golds: Gold[]; jewelries: Jewelry[] };
}) => {
  return (
    <Flex direction="column" gap="4" className="max-w-4xl mx-auto mt-6">
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Mã gộp</DataList.Label>
          <DataList.Value>{report.id}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tên gộp</DataList.Label>
          <DataList.Value>{report.name}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Đơn vị</DataList.Label>
          <DataList.Value>{report.unit}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tồn đầu kỳ</DataList.Label>
          <DataList.Value>
            {format(report.tonDauKyQuantity, 4)} {report.unit} -{" "}
            {format(report.tonDauKyValue)} đ
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Nhập trong kỳ</DataList.Label>
          <DataList.Value>
            {format(report.nhapQuantity, 4)} {report.unit} -{" "}
            {format(report.nhapValue)} đ
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Xuất trong kỳ</DataList.Label>
          <DataList.Value>
            {format(report.xuatQuantity, 4)} {report.unit} -{" "}
            {format(report.xuatValue)} đ
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tồn cuối kỳ</DataList.Label>
          <DataList.Value>
            {format(report.tonCuoiKyQuantity, 4)} {report.unit} -{" "}
            {format(report.tonCuoiKyValue)} đ
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>

      {/* {report.golds.length > 0 && (
        <div>
          <Heading size="4" mt="4" mb="2">
            Vàng
          </Heading>
          <table className="w-full border border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1 text-left">Mã</th>
                <th className="border px-2 py-1 text-left">Tên</th>
                <th className="border px-2 py-1 text-right">Trọng lượng</th>
              </tr>
            </thead>
            <tbody>
              {report.golds.map((gold) => (
                <tr key={gold.id}>
                  <td className="border px-2 py-1">{gold.id}</td>
                  <td className="border px-2 py-1">{gold.name}</td>
                  <td className="border px-2 py-1 text-right">
                    {format(gold.weight, 4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {report.jewelries.length > 0 && (
        <div>
          <Heading size="4" mt="4" mb="2">
            Trang sức
          </Heading>
          <table className="w-full border border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1 text-left">Mã</th>
                <th className="border px-2 py-1 text-left">Tên</th>
                <th className="border px-2 py-1 text-right">Trọng lượng</th>
              </tr>
            </thead>
            <tbody>
              {report.jewelries.map((jewelry) => (
                <tr key={jewelry.id}>
                  <td className="border px-2 py-1">{jewelry.id}</td>
                  <td className="border px-2 py-1">{jewelry.name}</td>
                  <td className="border px-2 py-1 text-right">
                    {format(jewelry.weight, 4)}
                  </td>
                </tr>
              ))} */}
      {/* </tbody> */}
      {/* </table> */}
      {/* </div> */}
      {/* )} */}
    </Flex>
  );
};

export default ReportXNTDetail;
