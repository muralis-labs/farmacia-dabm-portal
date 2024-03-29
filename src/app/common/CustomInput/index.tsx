"use client";
import { FormControl, FormLabel, InputGroup } from "react-bootstrap";
import Icon from "../icon/index";
import styles from "./index.module.scss";
import colors from "@/app/sass/_variables.module.scss";

type CustomInputProps = {
  placeholder?: string;
  label?: string;
  type?: string;
  onChange?: (e: any) => void;
  onClick?: (e: any) => void;
  value?: string | number | string[] | undefined;
  id: string;
  readOnly?: boolean;
  showIcon?: boolean;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  disabled?: boolean;
  search?: boolean;
  showError?: boolean;
  showTip?: boolean;
  tip?: string;
};

export default function CustomInput({
  placeholder,
  label,
  type = "text",
  onChange = () => {},
  onClick = () => {},
  value,
  id,
  readOnly = false,
  showIcon = false,
  icon = "",
  iconSize = 18,
  iconColor = colors.neutralColorGrayStrongest,
  disabled = false,
  search = false,
  showError = false,
  showTip = false,
  tip = ''
}: CustomInputProps) {
  return (
    <div className={styles.group}>
      {label && (
        <FormLabel className={`${styles.label} ${showError ? styles.errorLabel : ''}`} htmlFor={id}>
          {label}
        </FormLabel>
      )}
      <div className={styles.inputContainer} onClick={onClick}>
        <FormControl
          disabled={disabled}
          id={id}
          className={`${styles.input} ${showError ? styles.errorSearch : ''} ${search ? styles.search : ''} shadow-none`}
          type={type}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-describedby="basic-addon1"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          min="0"
          autoComplete="off"
        />
        {showIcon && <Icon icon={icon} size={iconSize} color={iconColor} />}
      </div>
      {showTip && <label className={`${styles.tip} ${showError ? styles.errorLabel : ''}`}>{tip}</label>}
    </div>
  );
}
