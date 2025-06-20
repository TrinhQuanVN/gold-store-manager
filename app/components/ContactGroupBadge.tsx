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
  ContactGroup,
}: {
  ContactGroup: ContactGroup;
}) => {
  const fallbackColor: BadgeColor = "gray";

  const badgeColor: BadgeColor = isBadgeColor(ContactGroup.color)
    ? ContactGroup.color
    : fallbackColor;

  return (
    <Badge color={badgeColor} variant="soft" radius="full">
      {ContactGroup.name}
    </Badge>
  );
};

export default ContactStatusBadge;
