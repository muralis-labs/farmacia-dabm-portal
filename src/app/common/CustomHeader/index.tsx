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
  };
  isMobile: boolean;
};

export default function CustomHeader({
  selectedPath,
  isMobile = false,
}: CustomHeaderProps) {
  const pathname = usePathname();
  const { push } = useRouter();
  const userString = localStorage.getItem(`user_${environment}`);
  const user = userString ? JSON.parse(userString) : null;

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>{selectedPath.name}</h1>

        <div className={styles.user}>
          <Image className={styles.formImage} src={logo} alt="form Logo" />
          <span>{user.data.name}</span>
        </div>
      </div>
      {!isMobile &&
        (pathname.includes("/pages/stock") ||
          pathname.includes("/pages/movement")) && (
          <Nav defaultActiveKey="entry" className={styles.navOptions} variant="underline">
            <Nav.Item onClick={() => push("/pages/stock")}>
              <Nav.Link eventKey="entry">
                <Icon icon="battery" size={18} />
                Estoque
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => push("/pages/movement")}>
              <Nav.Link eventKey="movement">
                <Icon icon="asc_bars" size={18} />
                Movimentações
              </Nav.Link>
            </Nav.Item>
          </Nav>
        )}
    </>
  );
}
