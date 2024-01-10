'use client';
import {useState, useEffect} from 'react';
import Image from "next/image";
import styles from "./page.module.scss";
import banner from "./assets/ilustracao.png";
import logo from "./assets/farma_logo.png";
import CustomInput from "./common/CustomInput/index";
import CustomButton from "./common/CustomButton/index";
import CustomCheckbox from "./common/CustomCheckbox/index";
import { useHandleLogin } from './hooks/useHandleLogin';

export default function Home() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const {data, isLoading, error, fetchData} = useHandleLogin();
  
  const handleLoginClient = () => {
    fetchData({login, password});
  }

  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <main className={styles.main}>
      <div className={`${styles.login} ${styles.centerInfo}`}>
        <div className={styles.loginForm}>
          <Image className={styles.formImage} src={logo} alt="form Logo" />
          <span className={styles.loginTitle}>Faça login na conta</span>
          <CustomInput value={login} onChange={event => setLogin(event.target.value)} label="Usuário" placeholder="usuario@email.com" />
          <CustomInput value={password} onChange={event => setPassword(event.target.value)} label="Senha" type="password" placeholder="******" />
          <CustomButton isLoading={isLoading} onClick={handleLoginClient} label="Login"/>
          <div className={styles.options}>
            <CustomCheckbox label="Lembrar de mim" />
            <a className={styles.link}>Esqueceu a senha?</a>
          </div>
        </div>
      </div>
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
    </main>
  );
}
