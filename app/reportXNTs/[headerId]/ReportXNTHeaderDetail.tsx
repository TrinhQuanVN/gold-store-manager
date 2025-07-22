"use client";

import { RawReportXNTHeaderForm } from "@/app/validationSchemas";
import { DateToStringVN } from "@/utils";
import { Card, DataList, Heading } from "@radix-ui/themes";

interface Props {
  header: RawReportXNTHeaderForm;
}

const ReportXNTHeaderDetail = ({ header }: Props) => {
  return (
    <Card size="3" style={{ maxWidth: 600 }}>
      <Heading mb="4">Thông tin báo cáo</Heading>

      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Tên báo cáo</DataList.Label>
          <DataList.Value>{header.name}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Quý</DataList.Label>
          <DataList.Value>{header.quarter}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Năm</DataList.Label>
          <DataList.Value>{header.year}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Ngày bắt đầu</DataList.Label>
          <DataList.Value>{DateToStringVN(header.startDate)}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Ngày kết thúc</DataList.Label>
          <DataList.Value>{DateToStringVN(header.endDate)}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Người nộp thuế</DataList.Label>
          <DataList.Value>{header.taxPayer?.name}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Mã số thuế</DataList.Label>
          <DataList.Value>{header.taxPayer?.taxCode}</DataList.Value>
        </DataList.Item>

        {header.taxPayer?.address && (
          <DataList.Item>
            <DataList.Label>Địa chỉ</DataList.Label>
            <DataList.Value>{header.taxPayer.address}</DataList.Value>
          </DataList.Item>
        )}
      </DataList.Root>
    </Card>
  );
};

export default ReportXNTHeaderDetail;
