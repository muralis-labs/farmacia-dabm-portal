"use client";

import CustomButton from "@/app/common/CustomButton/index";
import CustomInput from "@/app/common/CustomInput/index";
import { Col, Form, Row } from "react-bootstrap";
import styles from "./page.module.scss";
import variables from "@/app/sass/_variables.module.scss";
import CustomDatePicker from "@/app/common/CustomDatePicker/index";
import CustomAutoComplete from "@/app/common/CustomAutoComplete/index";

export default function Entry() {
  const { neutralColorGrayStrongest } = variables;
  return (
    <div className={styles.entry}>
      <div className={`${styles.entryContainer} ${styles.flexColDirection}`}>
        <div className={styles.topInfo}>
          <h2 className={styles.title}>Informações do Medicamento</h2>
          <div className={styles.divider} />
        </div>
        <Form className={styles.flexColDirection}>
          <Row>
            <Col xs={6}>
              <CustomInput
                id="code"
                label="Código de barras"
                placeholder="Código de barras do produto"
              />
            </Col>
            <Col>
              <CustomInput
                id="commercial-name"
                label="Nome comercial"
                placeholder="Nome comercial do produto"
              />
            </Col>
            <Col>
              <CustomInput
                id="commercial-name"
                label="Nome genérico"
                placeholder="Nome genérico do produto"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CustomDatePicker
                id="expiration"
                label="Data de validade"
                placeholder="Data de validade"
                value={new Date()}
              />
            </Col>
            <Col>
              <CustomInput
                id="commercial-name"
                label="Nome comercial"
                placeholder="Nome comercial do produto"
              />
            </Col>
            <Col>
              <CustomInput
                id="commercial-name"
                label="Nome comercial"
                placeholder="Nome comercial do produto"
              />
            </Col>
            <Col>
              <CustomAutoComplete
                id="unidade de medida"
                label="unidade de medida"
                placeholder="Selecione a unidade de medida"
                items={[
                  { id: 1, name: "L" },
                  { id: 2, name: "ml" },
                  { id: 3, name: "teste" },
                  { id: 4, name: "aaaaa" },
                ]}
                onItemSelect={item => console.log(item.name)}
              />
            </Col>
          </Row>
          {/*<Row>
            <Col xs={6}>
              <CustomInput label="Nome comercial" />
            </Col>
            <Col>
              <CustomInput label="Nome comercial" />
            </Col>
            <Col>
              <CustomInput label="Nome comercial" />
            </Col>
          </Row> */}
          <Row xs={4} md={4} lg={4}>
            <Col xs={6}>
              <CustomButton label="Adicionar Medicamento" />
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
