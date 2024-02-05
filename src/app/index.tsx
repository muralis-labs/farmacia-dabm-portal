'use client'
import React, { useEffect, useMemo } from "react";
import { Inter } from "next/font/google";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeviceSelectors } from "react-device-detect";
import CustomFloatButton from "./common/CustomFloatButton/index";
import CustomFooter from "./common/CustomFooter/index";
import CustomHeader from "./common/CustomHeader/index";
import CustomSideBar from "./common/CustomSideBar/index";
import styles from "./index.module.scss";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { isMobile } = selectors;
  const isScanning = searchParams.get("scan");
  const { push } = useRouter();

  const menus = useMemo(() => [
    { name: "Dashboard", title: 'Dashboard', icon: "home", route: "/pages/dashboard" },
    { name: "Estoque",  title: 'Estoque', icon: "bag", route: "/pages/stock" },
    { name: "Movimentação",  title: 'Movimentação', icon: "battery", route: "/pages/movement" },
    { name: "Entrada",  title: 'Entrada de medicamentos', success: true, icon: "arrow_up", route: "/pages/entry" },
    { name: "Saída",  title: 'Saída de medicamentos', danger: true, icon: "arrow_down", route: "/pages/outflow" },
    { name: "Descarte",  title: 'Descarte de medicamentos', warning: true, icon: "block", route: "/pages/discard" },
    { name: "Calendário",  title: 'Calendário de Vencimentos', icon: "calendar", route: "/pages/calendar" },
    { name: "Perfil",  title: 'Perfil', icon: "", route: "/pages/user", hide: true },
  ], []);

  const selectedPath = useMemo(() => menus.find(menu => menu.route === pathname), [menus, pathname]);

  const mobileMenus = useMemo(() => [
    { name: "Dashboard", icon: "home", route: "/pages/dashboard" },
    { name: "Estoque", icon: "screen", route: "/pages/stock" },
    { name: "Calendário", icon: "calendar", route: "/pages/calendar" },
  ], []);

  const renderSideBar = () => (
    !pathname.includes("/pages/login") && !isMobile && <CustomSideBar menus={menus} selectedPath={pathname} />
  );

  const renderHeader = () => (
    !pathname.includes("/pages/login") && <CustomHeader isScanning={isScanning} isMobile={isMobile} selectedPath={selectedPath} />
  );

  const renderMobileFooter = () => (
    !pathname.includes("/pages/login") && !isScanning && isMobile && <CustomFooter menus={mobileMenus} selectedPath={pathname} />
  );

  const renderScanButton = () => (
    !pathname.includes("/pages/login") && !isMobile && <CustomFloatButton />
  );

  useEffect(() => {
    if(isMobile && pathname.includes("/pages/movement")) {
      push("/pages/stock")
    }
  }, [])

  return (
    <body className={inter.className}>
      <ToastContainer />
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
