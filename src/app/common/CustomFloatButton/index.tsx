import Icon from "../icon/index";
import styles from "./index.module.scss";
import colors from "@/app/sass/_variables.module.scss";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeviceSelectors } from "react-device-detect";

export default function CustomFloatButton() {
  const { push } = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("scan");
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { isMobile } = selectors;

  const validateRoute = () => {
    return pathName.includes("/pages/entry") && query;
  };

  const route =
    pathName.includes("/pages/entry") || pathName.includes("/pages/outflow")
      ? pathName
      : "/pages/entry";

  const handleClick = () => {
    validateRoute() ? push(route) : push(`${route}?scan=true`);
  };

  return (
    <div onClick={handleClick} className={`${styles.floatButton} ${isMobile ? styles.mobileButton : {}}`}>
      <Icon
        icon={`${validateRoute() ? "close" : "scan"}`}
        size={validateRoute() ? 24 : 32}
        color={colors.neutralColorGraySoftest}
      />
    </div>
  );
}
