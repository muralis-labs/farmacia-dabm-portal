import { FormCheck } from "react-bootstrap";

type CustomCheckboxProps = {
  label?: string;
  checked?: boolean;
  id?: string;
  key?: string;
  index?: string | number;
  onChange?: (e: any) => void;
};

export default function CustomCheckbox({
  label = "",
  checked = false,
  onChange = () => {},
  id = "",
  key = "",
}: CustomCheckboxProps) {
  return (
    <FormCheck
      checked={checked}
      id={id}
      key={key}
      onChange={onChange}
      type="checkbox"
      label={label}
    />
  );
}
