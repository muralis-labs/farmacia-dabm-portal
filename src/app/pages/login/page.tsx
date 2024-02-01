"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import banner from "@/app/assets/ilustracao.png";
import logo from "@/app/assets/farma_logo.png";
import { useDeviceSelectors } from "react-device-detect";
import { useHandleLogin } from "@/app/hooks/useHandleLogin";
import CustomInput from "@/app/common/CustomInput/index";
import CustomButton from "@/app/common/CustomButton/index";
import CustomCheckbox from "@/app/common/CustomCheckbox/index";

export default function Home() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error, fetchData } = useHandleLogin();
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);

  const { isMobile } = selectors;

  const handleLoginClient = async() => {
    await fetchData({ login, password });
  };
  useEffect(() => {
  
  }, [error]);

  const renderBanner = () => {
    return (
      <div className={`${styles.banner} ${styles.centerInfo}`}>
        <span className={styles.bannerText}>
          Farmácia Comunitária Benedicto Motenegro
        </span>
        <div className={`${styles.biggerCircle} ${styles.centerInfo}`}>
          <div className={`${styles.smallerCircle} ${styles.centerInfo}`}>
            <Image className={styles.image} src={banner} alt="Banner Logo" />
          </div>
        </div>
      </div>
    );
  };

  const renderBubbles = () => {
    return (
      <>
        <div className={styles.bubbleTop} />
        <div className={styles.bubbleBottom} />
      </>
    );
  };

  return (
    <main className={`${styles.main} ${isMobile ? styles.mainMobile : ""}`}>
      <div
        className={`${styles.login} ${isMobile ? styles.mobile : ""} ${
          styles.centerInfo
        }`}
      >
        {isMobile && renderBubbles()}
        <div className={styles.loginForm}>
          <Image className={styles.formImage} src={logo} alt="form Logo" />
          <span className={styles.loginTitle}>Faça login na conta</span>
          <CustomInput
            id="user"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            label="Usuário"
            placeholder="usuario@email.com"
          />
          <CustomInput
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            label="Senha"
            type="password"
            placeholder="******"
          />
          <CustomButton
            fullWidth
            disabled={isLoading || login.length <= 0 || password.length <= 0}
            onClick={handleLoginClient}
            label="Login"
            largeButton
          />
          <div
            className={` ${styles.options} ${isMobile ? styles.mobile : ""}`}
          >
            {!isMobile && <CustomCheckbox label="Lembrar de mim" />}
            <a className={styles.link}>Esqueceu a senha?</a>
          </div>
        </div>
      </div>

      {!isMobile && renderBanner()}
    </main>
  );
}
