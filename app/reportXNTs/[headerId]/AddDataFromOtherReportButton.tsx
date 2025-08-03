"use client";

import { AlertDialog, Button, Flex, Select, Text } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/app/components";

interface Props {
  headerId: number;
  oldReports: { id: string; name: string }[];
  hasReport: boolean;
}

const AddDataFromOtherReportButton = ({
  headerId,
  oldReports,
  hasReport,
}: Props) => {
  const router = useRouter();
  const [selectedOldHeaderId, setSelectedOldHeaderId] = useState<string | null>(
    null
  );
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleImport = async () => {
    if (!selectedOldHeaderId) return;
    try {
      setSubmitting(true);
      await axios.post(
        `/api/reportXNTs/${headerId}?getCuoiKy=${selectedOldHeaderId}`
      );
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
            size="2"
            className="py-3 w-full"
            disabled={oldReports.length < 1 || isSubmitting} //|| !hasReport
          >
            Lấy tồn đầu kỳ
            {isSubmitting && <Spinner />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Lấy tồn cuối kỳ làm tồn đầu kỳ</AlertDialog.Title>
          <AlertDialog.Description>
            Hành động này sẽ <strong>xóa toàn bộ dữ liệu</strong> hiện tại của
            báo cáo này và thay thế bằng tồn cuối kỳ từ báo cáo đã chọn.
            <br />
            <br />
            <strong>Chọn báo cáo nguồn:</strong>
          </AlertDialog.Description>

          {oldReports.length > 0 ? (
            <Select.Root
              value={selectedOldHeaderId ?? ""}
              onValueChange={(value) => setSelectedOldHeaderId(value)}
            >
              <Select.Trigger placeholder="Chọn báo cáo cũ" />
              <Select.Content>
                {oldReports.map((r) => (
                  <Select.Item key={r.id} value={r.id.toString()}>
                    {r.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          ) : (
            <Text color="gray">Không có báo cáo cũ nào để chọn</Text>
          )}

          <Flex mt="4" gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Huỷ
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                color="orange"
                onClick={handleImport}
                disabled={!selectedOldHeaderId || isSubmitting}
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

export default AddDataFromOtherReportButton;
