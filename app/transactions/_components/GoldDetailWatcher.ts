import { useEffect, useRef } from "react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { RawTransactionDataForm } from "@/app/validationSchemas";
import axios from "axios";

interface Props {
  index: number;
  control: Control<RawTransactionDataForm>;
  setValue: UseFormSetValue<RawTransactionDataForm>;
  lastestGoldPrice?: number;
  setGoldName: (index: number, name: string) => void;
}

const GoldDetailWatcher = ({
  index,
  control,
  setValue,
  lastestGoldPrice,
  setGoldName,
}: Props) => {
  const field = useWatch({ control, name: `goldDetails.${index}` });
  const fetchedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const { id, goldId, weight, price, discount } = field || {};

    // Nếu goldId mới được nhập và chưa từng fetch
    if (goldId && !fetchedIds.current.has(goldId)) {
      fetchedIds.current.add(goldId);

      axios
        .get(`/api/gold/${goldId}`)
        .then((res) => {
          const gold = res.data;
          console.log(gold);
          setGoldName(index, gold.name);

          if (!id) {
            setValue(
              `goldDetails.${index}.price`,
              (lastestGoldPrice ?? 0).toString()
            );
          }

          // Có thể set thêm: setValue(`goldDetails.${index}.goldIdDisabled`, true);
        })
        .catch(() => {
          setGoldName(index, "Không tìm thấy vàng");
        });
    }

    // Tự tính amount
    if (id) {
      const w = parseFloat(weight || "0");
      const p = parseFloat(price || "0");
      const d = parseFloat(discount || "0");
      const amount = (w * p - d).toFixed(0);
      setValue(`goldDetails.${index}.amount`, amount);
    }
  }, [field]);

  return null;
};

export default GoldDetailWatcher;
