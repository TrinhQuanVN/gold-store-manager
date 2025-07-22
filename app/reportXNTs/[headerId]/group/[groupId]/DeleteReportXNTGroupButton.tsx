"use client";

import { Spinner } from "@/app/components";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteReportXNTGroupButton = ({
  headerId,
  groupId,
}: {
  headerId: number;
  groupId: number;
}) => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const deleteReport = async () => {
    try {
      setDeleting(true);
      await axios.delete(`/api/reportXNTs/${headerId}/group/${groupId}`);
      router.push(`/reportXNTs/${headerId}`);
      router.refresh();
    } catch (error) {
      setDeleting(false);
      setError(true);
    }
  };

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" disabled={isDeleting}>
            Xoá nhóm
            {isDeleting && <Spinner />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>
            Xác nhận xoá nhóm sản phẩm thuộc báo cáo
          </AlertDialog.Title>
          <AlertDialog.Description>
            Bạn có chắc chắn muốn xoá nhóm sản phẩm thuộc báo cáo này không?
            Hành động này không thể hoàn tác.
          </AlertDialog.Description>
          <Flex mt="4" gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Huỷ
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={deleteReport}>
                Xoá nhóm
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Lỗi</AlertDialog.Title>
          <AlertDialog.Description>
            Nhóm sản phẩm thuộc báo cáo không thể xoá. Vui lòng thử lại sau.
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

export default DeleteReportXNTGroupButton;
