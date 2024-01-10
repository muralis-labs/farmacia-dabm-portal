import Image from "next/image";
import styles from "./page.module.scss";
import banner from "./assets/ilustracao.png";
import CustomInput from "./common/CustomInput/index";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={`${styles.login} ${styles.centerInfo}`}>
        <div className={styles.loginForm}>
          <CustomInput placeholder="usuario@email.com" label="Usuário" />
          <CustomInput
            type="password"
            placeholder="*******"
            label="Senha"
          />
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
