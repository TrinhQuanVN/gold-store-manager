"use client";

import { rawGroupFormData } from "@/app/validationSchemas";
import { Card, DataList, Heading } from "@radix-ui/themes";

interface Props {
  group: rawGroupFormData;
}

const ReportXNTGroupDetail = ({ group }: Props) => {
  return (
    <Card size="3" style={{ maxWidth: 600 }}>
      <Heading mb="4">Nhóm báo cáo</Heading>

      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Tên báo cáo</DataList.Label>
          <DataList.Value>{group.name}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Số thứ tự</DataList.Label>
          <DataList.Value>{group.stt}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Card>
  );
};

export default ReportXNTGroupDetail;
