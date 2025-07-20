export function toStringVN(
  value: number,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 0
) {
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function toNumberVN(input: string): number {
  if (!input) return 0;

  // Loại bỏ ký tự không phải số, dấu chấm, phẩy, hoặc trừ
  const cleaned = input.replace(/[^\d.,-]/g, "").trim();

  // Trường hợp có cả "," và ".", giả định: dấu . là phân cách nghìn, , là dấu thập phân
  if (cleaned.includes(",") && cleaned.includes(".")) {
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    return parseFloat(normalized);
  }

  // Nếu chỉ có ",", xem là dấu thập phân
  if (cleaned.includes(",") && !cleaned.includes(".")) {
    return parseFloat(cleaned.replace(",", "."));
  }

  // Nếu chỉ có ".", nhưng KHÔNG có ",", và có nhiều dấu ".", giả định là dấu phân cách hàng nghìn → loại bỏ hết dấu .
  if (!cleaned.includes(",") && (cleaned.match(/\./g)?.length ?? 0) >= 1) {
    return parseFloat(cleaned.replace(/\./g, ""));
  }

  // Trường hợp mặc định: chỉ số đơn giản
  return parseFloat(cleaned);
}

import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const toDateStringVn = (
  input: string | Date | null | undefined
): string => {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  return format(date, "dd/MM/yyyy HH:mm:ss", { locale: vi });
};

export const toDateStringIso = (input: string | Date): string => {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toISOString(); // ✅ lưu data
};

export const DateToStringVN = (
  input: string | Date | null | undefined
): string => {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;

  // Kiểm tra date hợp lệ
  if (isNaN(date.getTime())) return "";

  return format(date, "dd/MM/yyyy HH:mm:ss", { locale: vi });
};
