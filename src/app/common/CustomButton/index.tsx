'use client';
import { Button } from "react-bootstrap";
import styles from "./index.module.scss";

type CustomButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: (e: any) => void;
}

export default function CustomButton({
  label,
  disabled = false,
  onClick = () => {},
}: CustomButtonProps) {
  return (
    <Button disabled={disabled} onClick={onClick} className={styles.customButton} as="input" type="button" value={label} />
  );
}
