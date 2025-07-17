"use client";

import { Card, Flex, Text, Heading, DataList } from "@radix-ui/themes";
import { Jewelry, JewelryCategory, JewelryType } from "@prisma/client";
import JewelryBadge from "@/app/components/JewelryBadge";
import React from "react";

interface Props {
  jewelry: Jewelry & {
    category: JewelryCategory;
    jewelryType: JewelryType;
  };
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
            <DataList.Value>
              {Number(jewelry.goldWeight).toLocaleString("vi-VN", {
                maximumFractionDigits: 4,
              })}{" "}
              chỉ
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Trọng lượng đá</DataList.Label>
            <DataList.Value>
              {Number(jewelry.gemWeight).toLocaleString("vi-VN", {
                maximumFractionDigits: 4,
              })}{" "}
              chỉ
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Tổng trọng lượng</DataList.Label>
            <DataList.Value>
              {Number(jewelry.totalWeight).toLocaleString("vi-VN", {
                maximumFractionDigits: 4,
              })}{" "}
              chỉ
            </DataList.Value>
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
            <DataList.Value>
              {new Date(jewelry.createdAt).toLocaleString("vi-VN")}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Flex>
    </Card>
  );
};

export default JewelryDetail;
