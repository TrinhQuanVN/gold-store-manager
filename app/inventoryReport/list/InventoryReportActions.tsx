"use client";

import { format, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Đăng ký locale tiếng Việt
registerLocale("vi", vi);

const InventoryReportActions = () => {
  const router = useRouter();
  const params = useSearchParams();

  const currentMonth =
    params.get("month") || new Date().toISOString().slice(0, 7);

  const [selectedDate, setSelectedDate] = useState<Date>(
    parse(currentMonth, "yyyy-MM", new Date())
  );

  const handleMonthChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    const newMonth = format(date, "yyyy-MM");
    router.push(`/inventoryReport/list?month=${newMonth}`);
  };

  return (
    <DatePicker
      locale="vi"
      selected={selectedDate}
      onChange={handleMonthChange}
      dateFormat="MM/yyyy"
      showMonthYearPicker
      showFullMonthYearPicker
      placeholderText="Chọn tháng"
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
};

export default InventoryReportActions;
