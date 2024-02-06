"use client";
import { useState, useEffect } from "react";
import { environment } from "@/app/constants/config";
import styles from "./page.module.scss";
import colors from "@/app/sass/_variables.module.scss";
import Icon from "@/app/common/icon/index";
import CustomButton from "@/app/common/CustomButton/index";
import logo from "@/app/assets/farma_logo_large.png";
import Image from "next/image";
import CustomInput from "@/app/common/CustomInput/index";
import { Col, Form, Row } from "react-bootstrap";
import CustomModal from "@/app/common/CustomModal/index";
import { useHandleUpdateUser } from "@/app/hooks/useHandleUpdateUser";
import { useRouter } from "next/navigation";

import { useDeviceSelectors } from "react-device-detect";

export default function User() {
  const userService = useHandleUpdateUser();
  const userString = localStorage.getItem(`user_${environment}`);
  const user = userString ? JSON.parse(userString) : null;
  const { push, refresh } = useRouter();

  const [edit, setEdit] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [name, setName] = useState<string>(user?.name);
  const [email, setEmail] = useState<string>(user?.login);
  const [password, setPassword] = useState<string>("");
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { isMobile } = selectors;

  const handleExitUser = () => {
    localStorage.removeItem(`user_${environment}`);
    push("/");
  };

  const handleUpdateUser = async () => {
    const data: {
      id: string | null;
      name: string;
      login: string;
      password?: string | null | undefined;
    } = {
      id: user.id ?? null,
      name,
      login: email,
    };

    if (password !== null && password !== "") {
      data.password = password;
    }

    const res = await userService.fetchData(data);

    if (res) {
      setName(res.name);
      setEmail(res.login);

      const data = {
        name: res.name,
        login: res.login,
        id: user.id,
        refreshToken: user.refreshToken,
        token: user.token,
      };

      setEdit(false);
      localStorage.setItem(`user_${environment}`, JSON.stringify(data));
      refresh();
    }
  };

  useEffect(() => {
    if(!user) {
      handleExitUser();
    }
  }, [])

  return (
    <div className={styles.page}>
      <CustomModal
        show={showModal}
        confirmButton="Atualizar Cadastro"
        description=" Tem certeza que deseja realizar a autalização de cadastro?"
        title="Atualizar cadastro"
        confirm
        icon="person"
        onHide={() => setShowModal(false)}
        handleConfirm={() => handleUpdateUser()}
      />
      <div className={`${styles.userForm} ${isMobile ? styles.mobile : {}}`}>
        {!isMobile && (
          <div className={styles.options}>
            <span className={styles.user}>
              <Icon
                icon="person"
                size={18}
                color={colors.brandColorPrimaryMedium}
              />
              Dados de cadastro
            </span>

            <CustomButton
              label="Salvar"
              success
              onClick={() => setShowModal(true)}
            />
          </div>
        )}
        <div className={styles.userPhoto}>
          <Image className={styles.photo} src={logo} alt="form Logo" />
        </div>
        <Form className={styles.form}>
          <Row className={isMobile ? styles.mobileRow : ''}>
            <Col>
              <CustomInput
                value={email}
                onChange={(event) => setEmail(event?.target.value)}
                disabled={!isMobile && !edit}
                id="email"
                label="E-mail"
                placeholder="exemplo@email.com"
              />
            </Col>
          </Row>
          <Row className={isMobile ? styles.mobileRow : ''}>
            <Col>
              <CustomInput
                value={name}
                onChange={(event) => setName(event?.target.value)}
                disabled={!isMobile && !edit}
                id="name"
                label="Usuário"
                placeholder="Usuário"
              />
            </Col>
            <Col>
              <CustomInput
                value={password}
                onChange={(event) => setPassword(event?.target.value)}
                disabled={!isMobile && !edit}
                id="password"
                label="Senha"
                placeholder="********"
              />
            </Col>
          </Row>
        </Form>

        {!isMobile ? (
          <div className={styles.options}>
            <div className={styles.edit} onClick={() => setEdit(true)}>
              <Icon
                icon="pencil"
                size={16}
                color={colors.brandColorPrimaryDarkest}
              />
              Editar dados
            </div>

            <div className={styles.exit} onClick={handleExitUser}>
              <Icon icon="out_door" size={16} color={colors.volcanoStrong} />
              Sair
            </div>
          </div>
        ) : (
          <div className={styles.mobileOptions}>
            <CustomButton fullWidth onClick={() => setShowModal(true)} label="Editar dados"  />

            <CustomButton fullWidth danger onClick={handleExitUser} label="Sair"  />
          </div>
        )}
      </div>
    </div>
  );
}
