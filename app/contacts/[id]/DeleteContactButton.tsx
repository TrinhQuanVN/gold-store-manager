"use client";

import { Spinner } from "@/app/components";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteContactButton = ({ ContactId }: { ContactId: number }) => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const deleteContact = async () => {
    try {
      setDeleting(true);
      await axios.delete("/api/contacts/" + ContactId);
      router.push("/contacts/list");
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
            Xoá khách hàng
            {isDeleting && <Spinner />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Xác nhận xoá khách hàng</AlertDialog.Title>
          <AlertDialog.Description>
            Bạn có chắc chắn muốn xoá khách hàng này không? Hành động này không
            thể hoàn tác.
          </AlertDialog.Description>
          <Flex mt="4" gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Huỷ
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={deleteContact}>
                Xoá khách hàng
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Lỗi</AlertDialog.Title>
          <AlertDialog.Description>
            Khách hàng không thể xoá. Vui lòng thử lại sau.
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

export default DeleteContactButton;
