export function formatNumberVN(
  value: number,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 0
) {
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(value);
}
export function parseNumberVN(value: string): number {
  return parseFloat(value.replace(/\./g, "").replace(",", "."));
}

export function transformCurrencyStringToNumber(input: string): number {
  if (!input) return 0;

  const cleaned = input
    .replace(/\./g, "") // Xoá dấu phân cách hàng nghìn (.)
    .replace(",", "."); // Đổi dấu thập phân từ , → .

  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}
