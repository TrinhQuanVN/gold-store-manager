"use client";

import { Card, Flex, Text, Heading } from "@radix-ui/themes";
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
            inStock={jewelry.inStock}
            category={jewelry.category}
            jewelryType={jewelry.jewelryType}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text>
            <strong>Mã của nhà:</strong> {jewelry.supplierId || "Không có"}
          </Text>
          <Text>
            <strong>Trọng lượng vàng:</strong> {jewelry.goldWeight} chỉ
          </Text>
          <Text>
            <strong>Trọng lượng đá:</strong> {jewelry.gemWeight} chỉ
          </Text>
          <Text>
            <strong>Tổng trọng lượng:</strong> {jewelry.totalWeight} chỉ
          </Text>
          {jewelry.gemName && (
            <Text>
              <strong>Tên đá:</strong> {jewelry.gemName}
            </Text>
          )}
          <Text>
            <strong>Xuất xứ:</strong> {jewelry.madeIn || "Không rõ"}
          </Text>
          <Text>
            <strong>Kích thước:</strong> {jewelry.size || "Không rõ"}
          </Text>
          <Text>
            <strong>Mã báo cáo:</strong> {jewelry.reportXNTId || "Không có"}
          </Text>
          <Text>
            <strong>Mô tả:</strong> {jewelry.description || "Không có"}
          </Text>
          <Text size="1" color="gray">
            Tạo lúc: {new Date(jewelry.createdAt).toLocaleString("vi-VN")}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default JewelryDetail;
