import { Badge } from "@radix-ui/themes";
import { ContactGroup } from "@prisma/client";
import React from "react";

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

function isBadgeColor(value: string | null): value is BadgeColor {
  return allowedColors.includes(value as BadgeColor);
}

const ContactStatusBadge = ({
  name,
  color,
}: {
  name: string;
  color: string | "gray";
}) => {
  const fallbackColor: BadgeColor = "gray";

  const badgeColor: BadgeColor = isBadgeColor(color) ? color : fallbackColor;

  return (
    <Badge color={badgeColor} variant="soft" radius="full">
      {name}
    </Badge>
  );
};

export default ContactStatusBadge;
