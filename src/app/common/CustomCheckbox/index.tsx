import { FormCheck } from "react-bootstrap";

type CustomCheckboxProps = {
  label: string;
}

export default function CustomCheckbox({label}: CustomCheckboxProps) {
  return (
    <FormCheck type="checkbox" label={label} />
  );
}
