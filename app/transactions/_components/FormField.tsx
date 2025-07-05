import { ErrorMessage } from "@/app/components";
import { Flex, TextField } from "@radix-ui/themes";

interface Props {
  label?: string;
  placeholder: string;
  error?: string;
  readOnly?: boolean;
  registerProps?: any;
  value?: string;
}

export const FormField = ({
  placeholder,
  error,
  registerProps,
  readOnly = false,
  value,
}: Props) => {
  return (
    <Flex direction="column">
      <TextField.Root
        placeholder={placeholder}
        readOnly={readOnly}
        {...registerProps}
        value={value}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Flex>
  );
};
