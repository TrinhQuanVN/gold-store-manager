"use client";

import { JewelryCategoryNumber, JewelryTypeNumber } from "@/prismaRepositories";
import { JewelryCategory, JewelryType } from "@prisma/client";
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
  type: { name: string; color: string };
  category: { name: string; color: string };
}

const JewelryBadge = ({ type, category }: Props) => {
  const typeColor: BadgeColor = isBadgeColor(type.color) ? type.color : "gray";

  const categoryColor: BadgeColor = isBadgeColor(category.color)
    ? category.color!
    : "gray";

  return (
    <Flex gap="2" align="center" wrap="wrap">
      <Badge color={typeColor} variant="soft" radius="full">
        {type.name}
      </Badge>

      <Badge color={categoryColor} variant="soft" radius="full">
        {category.name}
      </Badge>
    </Flex>
  );
};

export default JewelryBadge;
