import { RawReportXNTForm } from "@/app/validationSchemas";
import { toStringVN } from "@/utils";
import { DataList, Flex, Text } from "@radix-ui/themes";

const ReportXNTDetail = ({ report }: { report: RawReportXNTForm }) => {
  return (
    <Flex direction="column" gap="4" className="max-w-4xl mx-auto mt-6">
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Mã sản phẩm báo cáo</DataList.Label>
          <DataList.Value>{report.id}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tên sản phẩm báo cáo</DataList.Label>
          <DataList.Value>{report.name}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tồn đầu kỳ</DataList.Label>
          <DataList.Value>
            <Flex direction="column" gap="3">
              <Text>
                Trọng lượng:{" "}
                {report?.tonDauKyQuantity
                  ? toStringVN(+report.tonDauKyQuantity)
                  : "0"}{" "}
                {report.unit}
              </Text>
              <Text>
                Giá trị:{" "}
                {report?.tonDauKyValue
                  ? toStringVN(+report.tonDauKyValue)
                  : "0"}{" "}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Nhập trong kỳ</DataList.Label>
          <DataList.Value>
            <Flex direction="column" gap="3">
              <Text>
                Trọng lượng:{" "}
                {report?.nhapQuantity ? toStringVN(+report.nhapQuantity) : "0"}{" "}
                {report.unit}
              </Text>
              <Text>
                Giá trị:{" "}
                {report?.nhapValue ? toStringVN(+report.nhapValue) : "0"}{" "}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Xuất trong kỳ</DataList.Label>
          <DataList.Value>
            <Flex direction="column" gap="3">
              <Text>
                Trọng lượng:{" "}
                {report?.xuatQuantity ? toStringVN(+report.xuatQuantity) : "0"}
                {report.unit}
              </Text>
              <Text>
                Giá trị:{" "}
                {report?.xuatValue ? toStringVN(+report.xuatValue) : "0"}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tồn cuối kỳ</DataList.Label>
          <DataList.Value>
            <Flex direction="column" gap="3">
              <Text>
                Trọng lượng:{" "}
                {report?.tonCuoiKyQuantity
                  ? toStringVN(+report.tonCuoiKyQuantity)
                  : "0"}
                {report.unit}
              </Text>
              <Text>
                Giá trị:{" "}
                {report?.tonCuoiKyValue
                  ? toStringVN(+report.tonCuoiKyValue)
                  : "0"}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Xuất thực tế</DataList.Label>
          <DataList.Value>
            {report?.xuatThucTe ? toStringVN(+report.xuatThucTe) : "0"}
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Thuế</DataList.Label>
          <DataList.Value>
            {report?.thue ? toStringVN(+report.thue) : "0"}
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Flex>
  );
};

export default ReportXNTDetail;
