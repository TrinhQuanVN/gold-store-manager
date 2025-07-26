import { RawReportXNTForm } from "@/app/validationSchemas";
import { toStringVN } from "@/utils";
import { DataList, Flex, Text, Separator } from "@radix-ui/themes";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text size="3" weight="bold" mt="2" mb="1">
    {children}
  </Text>
);

const ReportXNTDetail = ({ report }: { report: RawReportXNTForm }) => {
  return (
    <Flex direction="column" gap="3" className="">
      <DataList.Root>
        <SectionTitle>Thông tin sản phẩm</SectionTitle>
        <DataList.Item>
          <DataList.Label>Mã sản phẩm</DataList.Label>
          <DataList.Value>{report.id}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Tên sản phẩm</DataList.Label>
          <DataList.Value>{report.name}</DataList.Value>
        </DataList.Item>

        <Separator my="2" />

        <SectionTitle>Tồn đầu kỳ</SectionTitle>
        <DataList.Item>
          <DataList.Label>Trọng lượng</DataList.Label>
          <DataList.Value>
            {toStringVN(+report?.tonDauKyQuantity, 4, 4)} {report.unit}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Giá trị</DataList.Label>
          <DataList.Value>
            {toStringVN(+report?.tonDauKyValue, 1, 1)}
          </DataList.Value>
        </DataList.Item>

        <Separator my="2" />

        <SectionTitle>Nhập trong kỳ</SectionTitle>
        <DataList.Item>
          <DataList.Label>Trọng lượng</DataList.Label>
          <DataList.Value>
            {toStringVN(+report?.nhapQuantity, 4, 4)} {report.unit}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Giá trị</DataList.Label>
          <DataList.Value>
            {toStringVN(+report?.nhapValue, 1, 1)}
          </DataList.Value>
        </DataList.Item>

        <Separator my="2" />

        <SectionTitle>Xuất trong kỳ</SectionTitle>
        <DataList.Item>
          <DataList.Label>Trọng lượng</DataList.Label>
          <DataList.Value>
            {toStringVN(+report?.xuatQuantity, 4, 4)} {report.unit}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Giá trị</DataList.Label>
          <DataList.Value>
            {toStringVN(+report?.xuatValue, 1, 1)}
          </DataList.Value>
        </DataList.Item>

        <Separator my="2" />

        <SectionTitle>Tồn cuối kỳ</SectionTitle>
        <DataList.Item>
          <DataList.Label>Trọng lượng</DataList.Label>
          <DataList.Value>
            {toStringVN(+report?.tonCuoiKyQuantity, 4, 4)} {report.unit}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Giá trị</DataList.Label>
          <DataList.Value>
            {toStringVN(+report?.tonCuoiKyValue, 1, 1)}
          </DataList.Value>
        </DataList.Item>

        <Separator my="2" />

        {report?.xuatThucTe != undefined && (
          <DataList.Item>
            <DataList.Label>Xuất thực tế</DataList.Label>
            <DataList.Value>
              {toStringVN(+report?.xuatThucTe, 1, 1)}
            </DataList.Value>
          </DataList.Item>
        )}

        {report?.thue != undefined && (
          <DataList.Item>
            <DataList.Label>Thuế</DataList.Label>
            <DataList.Value>{toStringVN(+report?.thue, 1, 1)}</DataList.Value>
          </DataList.Item>
        )}
      </DataList.Root>
    </Flex>
  );
};

export default ReportXNTDetail;
