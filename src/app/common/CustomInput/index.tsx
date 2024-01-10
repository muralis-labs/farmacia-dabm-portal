import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FormControl, FormLabel, InputGroup } from "react-bootstrap";
import styles from "./index.module.scss";

type CustomInputProps = {
  placeholder?: string;
  label?: string;
  type?: string;
};
export default function CustomInput({
  placeholder,
  label,
  type = "text",
}: CustomInputProps) {
  return (
    <div className={styles.group}>
      {label && <FormLabel className={styles.label}>{label}</FormLabel>}
      <FormControl
        className={styles.input}
        type={type}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-describedby="basic-addon1"
      />
    </div>
  );
}
