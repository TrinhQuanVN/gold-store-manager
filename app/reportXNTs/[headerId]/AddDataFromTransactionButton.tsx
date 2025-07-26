"use client";

import { AlertDialog, Box, Button, Flex, Table, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/app/components";
import axios from "axios";

export type ProductCodeNotInReport = {
  id: string;
  productCode: string;
  productName: string;
};

interface Props {
  headerId: number;
  productCodeNotInReport: ProductCodeNotInReport[];
  hasReport: boolean;
  productCodeNull: boolean;
}

const AddDataFromTransactionButton = ({
  headerId,
  hasReport,
  productCodeNotInReport,
  productCodeNull,
}: Props) => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleImportFromTransaction = async () => {
    try {
      setSubmitting(true);
      await axios.post(`/api/reportXNTs/${headerId}?addFromTransaction=true`, {
        method: "POST",
      });
      router.refresh();
    } catch (err) {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button
            color="orange"
            size="3"
            className="py-3 w-full"
            disabled={isSubmitting || !hasReport}
          >
            Lấy dữ liệu từ giao dịch
            {isSubmitting && <Spinner />}
          </Button>
        </AlertDialog.Trigger>

        <AlertDialog.Content>
          <AlertDialog.Title>Lấy dữ liệu từ giao dịch</AlertDialog.Title>
          <AlertDialog.Description>
            Hành động này sẽ <strong>xoá toàn bộ dữ liệu hiện tại</strong> của
            báo cáo (không bao gồm <strong>tồn đầu kỳ</strong>) và thay thế bằng
            dữ liệu mới từ các giao dịch liên quan.
            {productCodeNotInReport.length > 0 && (
              <Box
                mt="4"
                p="3"
                style={{ backgroundColor: "#FFF7ED", borderRadius: 8 }}
              >
                <Text weight="bold" color="orange">
                  Cảnh báo: Một số mã sản phẩm trong giao dịch chưa có trong báo
                  cáo hiện tại
                </Text>

                <Table.Root mt="3" variant="surface" size="1">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>
                        Mã sản phẩm
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>
                        Tên sản phẩm
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {productCodeNotInReport.map((item) => (
                      <Table.Row key={item.id}>
                        <Table.Cell>
                          <Text color="orange" weight="medium">
                            {item.productCode}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>{item.productName}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
            {productCodeNull && (
              <Box
                mt="4"
                p="3"
                style={{ backgroundColor: "#FEF2F2", borderRadius: 8 }}
              >
                <Text as="div" weight="bold" color="red">
                  Cảnh báo: Tìm thấy một số trang sức trong giao dịch nhưng chưa
                  được gán <strong>mã báo cáo (reportProductCode)</strong>.
                </Text>
                <Text color="gray" size="2" mt="1">
                  Xin hãy kiểm tra lại thông tin sản phẩm để hệ thống có thể
                  tổng hợp dữ liệu chính xác.
                </Text>
              </Box>
            )}
          </AlertDialog.Description>

          <Flex mt="4" gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Huỷ
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                color="orange"
                onClick={handleImportFromTransaction}
                disabled={isSubmitting}
              >
                Xác nhận thay thế
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Thông báo lỗi nếu thất bại */}
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Lỗi</AlertDialog.Title>
          <AlertDialog.Description>
            Không thể thực hiện thao tác. Vui lòng thử lại sau.
          </AlertDialog.Description>
          <Button
            color="gray"
            variant="soft"
            mt="2"
            onClick={() => setError(false)}
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default AddDataFromTransactionButton;
