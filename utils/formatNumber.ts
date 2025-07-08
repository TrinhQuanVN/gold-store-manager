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

  // Loại bỏ khoảng trắng và ký tự không số/trừ/phẩy/chấm
  const cleaned = input.replace(/[^\d.,-]/g, "").trim();

  // Nếu có cả "," và ".", giả định định dạng kiểu `vi-VN`: "10.000,25"
  if (cleaned.includes(",") && cleaned.includes(".")) {
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    return parseFloat(normalized);
  }

  // Nếu chỉ có "," => cũng là dấu thập phân
  if (cleaned.includes(",") && !cleaned.includes(".")) {
    return parseFloat(cleaned.replace(",", "."));
  }

  // Trường hợp mặc định: chỉ số không có dấu thập phân hoặc đã đúng định dạng
  return parseFloat(cleaned);
}
