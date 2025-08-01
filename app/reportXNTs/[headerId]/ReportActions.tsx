"use client";

import { Button, Dialog } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReportXNTGroupFormPopup from "../_components/ReportXNTGroupFormPopup";

const ReportActions = ({ reportHeaderId }: { reportHeaderId: number }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter(); // ✅ gọi router
  return (
    <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
      <Dialog.Trigger>
        <Button size="2">Thêm nhóm báo cáo</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Thêm khách hàng</Dialog.Title>
        <ReportXNTGroupFormPopup
          headerId={reportHeaderId} // ✅ truyền headerId
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
