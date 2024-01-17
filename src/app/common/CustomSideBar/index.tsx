import { useState } from "react";
import logo from "@/app/assets/farma_logo_large.png";
import Image from "next/image";
import Icon from "../icon/index";
import styles from "./index.module.scss";
import color from "@/app/sass/_variables.module.scss";
import { useRouter } from "next/navigation";

type CustomSideBarProps = {
  selectedPath: string;
  menus: {
    name: string;
    icon: string;
    route: string;
  }[];
};

export default function CustomSideBar({
  selectedPath,
  menus,
}: CustomSideBarProps) {
  const { push } = useRouter();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const renderMenu = (
    menu: { name: string; icon: string; route: string },
    index: number
  ) => {
    return (
      <div
        onClick={() => push(menu.route)}
        key={index}
        className={`${styles.menu} ${
          selectedPath === menu.route ? styles.selected : ""
        }`}
      >
        <Icon
          icon={menu.icon}
          size={18}
          color={color.neutralColorGrayStrongest}
        />
        {!collapsed && <span className={styles.menuTitle}>{menu.name}</span>}
      </div>
    );
  };

  return (
    <div
      className={`${styles.sideBar} ${
        collapsed ? styles.sideBarCollapsed : ""
      }`}
    >
      <div className={styles.options}>
        <div
          className={styles.iconContainer}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Icon
            icon={collapsed ? "double_arrow_right" : "double_arrow_left"}
            size={14}
            color={color.brandColorPrimaryMedium}
          />
        </div>
      </div>
      <Image
        className={`${styles.formImage} ${
          collapsed ? styles.collapsedImage : ""
        }`}
        src={logo}
        alt="form Logo"
      />

      {menus && menus.length > 0 && (
        <div className={styles.menus}>
          {menus.map((item, index) => renderMenu(item, index))}
        </div>
      )}
    </div>
  );
}
