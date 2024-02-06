'use client';
import { Button } from "react-bootstrap";
import styles from "./index.module.scss";

type CustomButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: (e: any) => void;
  largeButton?: boolean,
  fullWidth?: boolean,
  danger?: boolean,
  success?: boolean,
  warning?: boolean,
  onlyText?: boolean,
}

export default function CustomButton({
  label,
  disabled = false,
  onClick = () => {},
  largeButton = false,
  fullWidth = false,
  danger = false,
  success = false,
  warning = false,
  onlyText = false,
}: CustomButtonProps) {
  return (
    <Button  disabled={disabled} onClick={onClick} className={`${styles.customButton} ${onlyText ? styles.onlyText : {}} ${warning ? styles.warning : {}} ${success ? styles.success : {}} ${danger ? styles.danger : {}} ${largeButton ? styles.largeButton : {}} ${fullWidth ? styles.fullWidth : {}}`} as="input" type="button" value={label} />
  );
}
