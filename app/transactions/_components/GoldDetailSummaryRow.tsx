import { toStringVN } from "@/utils";
import { Grid, Text } from "@radix-ui/themes";

interface Props {
  totalCount?: number;
  totalWeight?: number;
  totalDiscount?: number;
  totalAmount?: number;
}

const GoldDetailSummaryRow = ({
  totalCount,
  totalWeight,
  totalDiscount,
  totalAmount,
}: Props) => {
  return (
    <Grid
      columns="7"
      gap="3"
      align="center"
      style={{
        gridTemplateColumns: "60px 4fr 1fr 1fr 1fr 1fr 1fr",
      }}
    >
      <Text size="2" weight="bold" color="indigo">
        Tổng
      </Text>
      <Text size="2" color="indigo">
        {totalCount} sản phẩm
      </Text>
      <Text size="2" align="right" color="indigo">
        {toStringVN(totalWeight ?? 0, 0, 4)}
      </Text>
      <Text size="2" align="right" color="indigo">
        {/* Giá: thường không có tổng */}
        {/* Có thể để trống hoặc dấu `-` */}–
      </Text>
      <Text size="2" align="right" color="indigo">
        {toStringVN(totalDiscount ?? 0, 0)}
      </Text>
      <Text size="2" align="right" color="indigo">
        {toStringVN(totalAmount ?? 0, 0)}
      </Text>
      <div /> {/* Cột nút X trống */}
    </Grid>
  );
};

export default GoldDetailSummaryRow;
