"use client";
import "./index.styles.scss";
import { environment } from "@/app/constants/config";
import Image from "next/image";
import logo from "@/app/assets/farma_logo_large.png";
import styles from "./index.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { Nav } from "react-bootstrap";
import Icon from "../icon/index";

type CustomHeaderProps = {
  selectedPath: {
    name: string;
    icon: string;
    route: string;
    title: string;
    danger?: boolean;
    success?: boolean;
    warning?: boolean;
  };
  isMobile: boolean;
  isScanning: boolean;
};

export default function CustomHeader({
  selectedPath,
  isMobile = false,
  isScanning = false,
}: CustomHeaderProps) {
  const pathname = usePathname();
  const { push } = useRouter();
  const userString = localStorage.getItem(`user_${environment}`);
  const user = userString ? JSON.parse(userString) : null;

  return (
    <>
      <div
        className={`${styles.header} ${isMobile ? styles.mobileHeader : {}} ${
          isMobile && isScanning ? styles.hideHeader : {}
        }`}
      >
        {pathname.includes("/pages/stock") && isMobile && (
          <div className={styles.user} onClick={() => push("/pages/user")}>
            <Image className={styles.formImage} src={logo} alt="form Logo" />
          </div>
        )}

        {!pathname.includes("/pages/stock") && isMobile && (
          <Icon
            onClick={() => push("/pages/stock")}
            icon="arrow_left_simple"
            size={12}
          />
        )}

        <h1
          className={`${styles.title} ${
            selectedPath.success ? styles.success : ""
          } ${selectedPath.danger ? styles.danger : ""} ${
            selectedPath.warning ? styles.warning : ""
          }`}
        >
          {selectedPath.title}
        </h1>

        {pathname.includes("/pages/stock") && isMobile ? (
          <div
            className={styles.filterButton}
            onClick={() => push("/pages/stock?filter=true")}
          >
            <Icon icon="funil" size={12} />
          </div>
        ) : (
          <div
            onClick={() => push("/pages/user")}
            className={`${styles.user} ${
              pathname.includes("/pages/user") ? styles.selected : {}
            }`}
          >
            <Image className={styles.formImage} src={logo} alt="form Logo" />
            {!isMobile && <span>{user?.name}</span>}
          </div>
        )}
      </div>
      {isMobile &&
        (pathname.includes("/pages/entry") ||
          pathname.includes("/pages/outflow")) && (
          <Nav
            defaultActiveKey="entry"
            className={`${styles.navOptions} ${styles.mobileNav} ${
              isMobile && isScanning ? styles.hideHeader : {}
            }`}
            variant="underline"
          >
            <Nav.Item onClick={() => push("/pages/entry")}>
              <Nav.Link eventKey="entry">
                <Icon
                  icon={`${
                    pathname.includes("/pages/entry")
                      ? "arrow_up_filled"
                      : "arrow_up"
                  }`}
                  size={18}
                />
                Entrada
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => push("/pages/outflow")}>
              <Nav.Link eventKey="movement">
                <Icon
                  icon={`${
                    pathname.includes("/pages/outflow")
                      ? "arrow_down_filled"
                      : "arrow_down"
                  }`}
                  size={18}
                />
                Saída
              </Nav.Link>
            </Nav.Item>
          </Nav>
        )}
    </>
  );
}
