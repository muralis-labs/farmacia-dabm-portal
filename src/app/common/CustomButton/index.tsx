'use client';
import { Button } from "react-bootstrap";
import styles from "./index.module.scss";

type CustomButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: (e: any) => void;
  largeButton?: boolean,
}

export default function CustomButton({
  label,
  disabled = false,
  onClick = () => {},
  largeButton = false,
}: CustomButtonProps) {
  return (
    <Button disabled={disabled} onClick={onClick} className={`${styles.customButton} ${largeButton ? styles.largeButton : {}}`} as="input" type="button" value={label} />
  );
}
