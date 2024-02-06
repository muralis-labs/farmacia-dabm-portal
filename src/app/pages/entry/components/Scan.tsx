import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import banner from "@/app/assets/bar_code_scan_image.png";
import style from "./scan.module.scss";
import CustomButton from "@/app/common/CustomButton/index";
import { useZxing } from "react-zxing";
import { useRouter } from "next/navigation";

type ScanProps = {
  isMobile: boolean;
  onChange: (e: any) => void;
  onScanMobile: (e: any) => void;
};

export default function Scan({
  isMobile = false,
  onChange = (e) => {},
  onScanMobile = (e) => {},
}: ScanProps) {
  const { push } = useRouter();
  const { ref } = useZxing({
    onDecodeResult(result) {
      onScanMobile(result.getText());
    },
  });
  const inputRef = useRef(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    inputRef?.current?.focus();
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return isMobile ? (
    <div className={style.scanMobile}>
      <video className={style.scan} ref={ref} />
      <div className={style.ocrloader}>
        <em></em>
        <span></span>
      </div>
      <div className={style.buttonContainer}>
        <CustomButton
          onClick={() => push("/pages/entry")}
          label="Adicionar código manualmente"
        />
      </div>
    </div>
  ) : (
    <div className={style.scanContainer}>
      <Image src={banner} className={style.image} alt="scan code" />
      <span className={style.text}>
        Scaneie o código de barras ou adicione manualmente
      </span>
      <CustomButton
        onClick={() => push("/pages/entry")}
        label="Adicionar código manualmente"
      />
      <input className={style.scanInput} onChange={onChange} ref={inputRef} />
    </div>
  );
}
