"use client";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useDeviceSelectors } from "react-device-detect";
import CustomFooter from "./common/CustomFooter/index";
import CustomHeader from "./common/CustomHeader/index";
import CustomSideBar from "./common/CustomSideBar/index";
import styles from "./index.module.scss";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { isMobile } = selectors;

  const menus = [
    {
      name: "Entrada",
      icon: "arrow_up",
      route: "/pages/entry",
    },
    {
      name: "Estoque",
      icon: "bag",
      route: "/pages/stock",
    },
  ];

  const mobileMenus = [
    {
      name: "Dashboard",
      icon: "home",
      route: "/pages/entry",
    },
    {
      name: "Estoque",
      icon: "screen",
      route: "/pages/stock",
    },
    {
      name: "Calendário",
      icon: "calendar",
      route: "/pages",
    },
  ];

  const pathTitle = pathname.includes("/pages/entry")
    ? "Atualizar entrada de estoque"
    : "Estoque";

  return (
    <body className={inter.className}>
      <div className={styles.mainContainer}>
        {!pathname.includes("/pages/login") && !isMobile && (
          <CustomSideBar menus={menus} selectedPath={pathname} />
        )}
        <div
          className={`${styles.safeArea} ${
            isMobile || pathname.includes("/pages/login")
              ? styles.removePadding
              : ""
          }`}
        >
          {!pathname.includes("/pages/login") && !isMobile && (
            <CustomHeader title={pathTitle} />
          )}

          {!pathname.includes("/pages/login") && isMobile && (
            <CustomFooter menus={mobileMenus} selectedPath={pathname} />
          )}

          {children}
        </div>
      </div>
    </body>
  );
}
