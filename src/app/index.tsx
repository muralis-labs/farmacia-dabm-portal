"use client";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import CustomSideBar from "./common/CustomSideBar/index";
import styles from "./index.module.scss";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const menus = [
    {
      name: "Entrada",
      icon: "arrow_up",
      route: "/pages/entry"
    },
    {
      name: "Estoque",
      icon: "bag",
      route: "/pages/stock"
    },
  ];

  return (
    <body className={inter.className}>
      <div className={styles.mainContainer}>
        {!pathname.includes("/pages/login") && <CustomSideBar menus={menus} selectedPath={pathname}/>}
        <div className={styles.safeArea}>{children}</div>
      </div>
    </body>
  );
}
