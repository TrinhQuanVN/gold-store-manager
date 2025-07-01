"use client";

import { Badge, Flex } from "@radix-ui/themes";

// Các màu hợp lệ với Radix Badge
const allowedColors = [
  "red",
  "violet",
  "green",
  "blue",
  "gray",
  "yellow",
  "orange",
  "crimson",
  "indigo",
  "purple",
  "iris",
  "teal",
  "mint",
  "lime",
  "cyan",
  "brown",
  "gold",
  "bronze",
  "tomato",
  "plum",
  "pink",
  "ruby",
] as const;

type BadgeColor = (typeof allowedColors)[number];

function isBadgeColor(value: string | null | undefined): value is BadgeColor {
  return allowedColors.includes(value as BadgeColor);
}

interface Props {
  inStock?: boolean;
  jewelryType: { name: string; color: string };
  category: { name: string; color: string };
}

const JewelryBadge = ({ inStock, jewelryType, category }: Props) => {
  const inStockColor: BadgeColor = inStock ? "green" : "red";

  const typeColor: BadgeColor = isBadgeColor(jewelryType.color)
    ? jewelryType.color!
    : "gray";

  const categoryColor: BadgeColor = isBadgeColor(category.color)
    ? category.color!
    : "gray";

  return (
    <Flex gap="2" align="center" wrap="wrap">
      {inStock !== undefined && (
        <Badge color={inStockColor} variant="soft" radius="full">
          {inStock ? "Còn hàng" : "Hết hàng"}
        </Badge>
      )}

      <Badge color={typeColor} variant="soft" radius="full">
        {jewelryType.name}
      </Badge>

      <Badge color={categoryColor} variant="soft" radius="full">
        {category.name}
      </Badge>
    </Flex>
  );
};

export default JewelryBadge;
