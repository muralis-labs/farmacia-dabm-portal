'use client';
import { Button } from "react-bootstrap";
import styles from "./index.module.scss";

type CustomButtonProps = {
  label: string;
  isLoading?: boolean;
  onClick?: (e: any) => void;
}

export default function CustomButton({
  label,
  isLoading = false,
  onClick = () => {},
}: CustomButtonProps) {
  return (
    <Button disabled={isLoading} onClick={onClick} className={styles.customButton} as="input" type="button" value={label} />
  );
}
