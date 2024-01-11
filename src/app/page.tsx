"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import banner from "./assets/ilustracao.png";
import logo from "./assets/farma_logo.png";
import CustomInput from "./common/CustomInput/index";
import CustomButton from "./common/CustomButton/index";
import CustomCheckbox from "./common/CustomCheckbox/index";
import { useHandleLogin } from "./hooks/useHandleLogin";
import { useDeviceSelectors } from "react-device-detect";

export default function Home() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { data, isLoading, error, fetchData } = useHandleLogin();
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);

  const { isMobile } = selectors;

  const handleLoginClient = () => {
    fetchData({ login, password });
  };

  useEffect(() => {
    console.log(error);
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
    )
  }

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
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            label="Usuário"
            placeholder="usuario@email.com"
          />
          <CustomInput
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            label="Senha"
            type="password"
            placeholder="******"
          />
          <CustomButton
            disabled={isLoading || login.length <= 0 || password.length <= 0}
            onClick={handleLoginClient}
            label="Login"
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
