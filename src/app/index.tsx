'use client'
import React, { useMemo } from "react";
import { Inter } from "next/font/google";
import { usePathname, useSearchParams } from "next/navigation";
import { useDeviceSelectors } from "react-device-detect";
import CustomFloatButton from "./common/CustomFloatButton/index";
import CustomFooter from "./common/CustomFooter/index";
import CustomHeader from "./common/CustomHeader/index";
import CustomSideBar from "./common/CustomSideBar/index";
import styles from "./index.module.scss";

const inter = Inter({ subsets: ["latin"] });

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("scan");
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { isMobile } = selectors;

  const menus = useMemo(() => [
    { name: "Entrada", icon: "arrow_up", route: "/pages/entry" },
    { name: "Saída", icon: "arrow_down", route: "/pages/outflow" },
    { name: "Estoque", icon: "bag", route: "/pages/stock", subMenuRoute: "/pages/movement" },
  ], []);

  const selectedPath = useMemo(() => menus.find(menu => menu.route === pathname || menu?.subMenuRoute === pathname), [menus, pathname]);

  const mobileMenus = useMemo(() => [
    { name: "Dashboard", icon: "home", route: "/pages/entry" },
    { name: "Estoque", icon: "screen", route: "/pages/stock" },
    { name: "Calendário", icon: "calendar", route: "/pages" },
  ], []);

  const showScan = useMemo(() => {
    return pathname.includes("/pages/entry") && query;
  }, [pathname, query]);

  const renderSideBar = () => (
    !pathname.includes("/pages/login") && !isMobile && <CustomSideBar menus={menus} selectedPath={pathname} />
  );

  const renderHeader = () => (
    !pathname.includes("/pages/login") && <CustomHeader isMobile={isMobile} selectedPath={selectedPath} />
  );

  const renderMobileFooter = () => (
    !pathname.includes("/pages/login") && isMobile && !showScan && <CustomFooter menus={mobileMenus} selectedPath={pathname} />
  );

  const renderScanButton = () => (
    !pathname.includes("/pages/login") && showScan && <CustomFloatButton />
  );

  return (
    <body className={inter.className}>
      <div className={styles.mainContainer}>
        {renderSideBar()}
        <div className={`${styles.safeArea} ${isMobile || pathname.includes("/pages/login") ? styles.removePadding : ""}`}>
          {renderHeader()}
          {renderMobileFooter()}
          {renderScanButton()}
          {children}
        </div>
      </div>
    </body>
  );
};

export default Layout;
