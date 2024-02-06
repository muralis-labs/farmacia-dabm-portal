// Icon.tsx
import IcoMoon, { IconProps } from "react-icomoon";
import iconSet from "./selection.json";

export default function Icon(props: IconProps) {
  return <IcoMoon iconSet={iconSet} {...props} />;
}
