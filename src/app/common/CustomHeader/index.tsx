"use client";
import { environment } from "@/app/constants/config";
import Image from "next/image";
import logo from "@/app/assets/farma_logo_large.png";
import styles from "./index.module.scss";

type CustomHeaderProps = {
  title?: string;
};

export default function CustomHeader({ title = "" }: CustomHeaderProps) {
  const user =  JSON.parse(localStorage.getItem(`user_${environment}`));
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.user}>
        <Image className={styles.formImage} src={logo} alt="form Logo" />
        <span>{user.data.name}</span>
      </div>
    </div>
  );
}
