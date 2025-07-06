import { ErrorMessage } from "@/app/components";
import { formatNumberVN } from "@/utils";
import { Flex, TextField } from "@radix-ui/themes";

interface Props {
  label?: string;
  placeholder: string;
  error?: string;
  readOnly?: boolean;
  registerProps?: any;
  value?: string;
  align?: "left" | "center" | "right";
}

export const FormField = ({
  placeholder,
  error,
  registerProps,
  readOnly = false,
  value,
  align,
}: Props) => {
  return (
    <Flex direction="column">
      <TextField.Root
        placeholder={placeholder}
        readOnly={readOnly}
        {...registerProps}
        value={value}
        style={{
          textAlign: align ?? "left",
        }}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Flex>
  );
};
