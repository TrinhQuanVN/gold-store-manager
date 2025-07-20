"use client";

import JewelryBadge from "@/app/components/JewelryBadge";
import { ConvertedJewelryWithCateogryAndType } from "@/prismaRepositories/StringConverted";
import { Card, DataList, Flex, Heading } from "@radix-ui/themes";

interface Props {
  jewelry: ConvertedJewelryWithCateogryAndType;
}

const JewelryDetail = ({ jewelry }: Props) => {
  return (
    <Card size="3" style={{ maxWidth: 600 }}>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Heading size="5">{jewelry.name}</Heading>
          <JewelryBadge
            category={jewelry.category}
            jewelryType={jewelry.jewelryType}
          />
        </Flex>

        <DataList.Root>
          <DataList.Item>
            <DataList.Label>Mã của nhà</DataList.Label>
            <DataList.Value>{jewelry.supplierId || "Không có"}</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Trọng lượng vàng</DataList.Label>
            <DataList.Value>{jewelry.goldWeight} chỉ</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Trọng lượng đá</DataList.Label>
            <DataList.Value>{jewelry.gemWeight} chỉ</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Tổng trọng lượng</DataList.Label>
            <DataList.Value>{jewelry.totalWeight} chỉ</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Tên đá</DataList.Label>
            <DataList.Value>{jewelry.gemName || "Không rõ"}</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Xuất xứ</DataList.Label>
            <DataList.Value>{jewelry.madeIn || "Không rõ"}</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Kích thước</DataList.Label>
            <DataList.Value>{jewelry.size || "Không rõ"}</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Mã báo cáo</DataList.Label>
            <DataList.Value>{jewelry.reportXNTId || "Không có"}</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Mô tả</DataList.Label>
            <DataList.Value>{jewelry.description || "Không có"}</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Ngày tạo</DataList.Label>
            <DataList.Value>{jewelry.createdAt}</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Flex>
    </Card>
  );
};

export default JewelryDetail;
