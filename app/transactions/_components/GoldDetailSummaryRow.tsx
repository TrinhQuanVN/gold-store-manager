import { Grid, Text } from "@radix-ui/themes";

interface Props {
  totalCount: number;
  totalWeight: number;
  totalDiscount: number;
  totalAmount: number;
}

const formatVN = (val: number, digits = 0) =>
  val.toLocaleString("vi-VN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const GoldDetailSummaryRow = ({
  totalCount,
  totalWeight,
  totalDiscount,
  totalAmount,
}: Props) => {
  return (
    <Grid columns="7" gap="3" align="center">
      <Text size="2" weight="bold" color="red">
        Tổng
      </Text>
      <Text size="2" color="red">
        {totalCount} sản phẩm
      </Text>
      <Text size="2" align="right" color="red">
        {formatVN(totalWeight, 4)}
      </Text>
      <Text size="2" align="right" color="red">
        {/* Giá: thường không có tổng */}
        {/* Có thể để trống hoặc dấu `-` */}–
      </Text>
      <Text size="2" align="right" color="red">
        {formatVN(totalDiscount, 0)}
      </Text>
      <Text size="2" align="right" color="red">
        {formatVN(totalAmount, 0)}
      </Text>
      <div /> {/* Cột nút X trống */}
    </Grid>
  );
};

export default GoldDetailSummaryRow;
