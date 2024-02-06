"use client";
import Icon from "../icon/index";
import styles from "./index.module.scss";
import color from "@/app/sass/_variables.module.scss";
import { useRouter } from "next/navigation";

type CustomFooterProps = {
  menus: any[];
  selectedPath: string;
};

export default function CustomFooter({
  menus,
  selectedPath = "",
}: CustomFooterProps) {
  const { push } = useRouter();

  return (
    <div className={styles.footer}>
      {menus.map((item, index) => (
        <div
          key={index}
          className={styles.item}
          onClick={() => push(item.route)}
        >
          <Icon
            icon={item.icon}
            size={20}
            color={
              selectedPath === item.route
                ? color.brandColorPrimaryMedium
                : color.neutralColorGrayStrongest
            }
          />
          <span
            className={`${styles.text} ${
              selectedPath === item.route ? styles.select : ""
            }`}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}
