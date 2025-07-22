"use client";

import { Button, Dialog } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReportXNTFormPopup from "../../../_components/ReportXNTFormPopup";

const ReportActions = ({
  reportHeaderId,
  groupId,
}: {
  reportHeaderId: number;
  groupId: number;
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter(); // ✅ gọi router
  return (
    <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
      <Dialog.Trigger>
        <Button size="2">Thêm sản phẩm</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Thêm sản phẩm thuộc nhóm báo cáo</Dialog.Title>
        <ReportXNTFormPopup
          headerId={reportHeaderId}
          groupId={groupId} // ✅ truyền headerId
          onSuccess={() => {
            setOpenDialog(false);
            router.refresh(); // ✅ reload lại trang server component
          }}
          onCancel={() => setOpenDialog(false)}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReportActions;
