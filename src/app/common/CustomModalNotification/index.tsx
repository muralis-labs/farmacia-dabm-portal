import { Modal } from "react-bootstrap";
import colors from "@/app/sass/_variables.module.scss";
import Icon from "@/app/common/icon/index";
import styles from "./index.module.scss";
import CustomButton from "../CustomButton/index";

interface CustomModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
}

export default function CustomModalNotification({
  show,
  onHide,
  title,
}: CustomModalProps) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Body className={styles.modalBody}>
        <div className={styles.modalHeader}>
          <Icon
            onClick={onHide}
            icon="close"
            size={8}
            color={colors.brandColorPrimaryDarkActive}
          />
        </div>

        <div className={styles.modalInfo}>
          <span className={styles.topLine}>{title}</span>
        </div>

        <div className={styles.modalOptions}>
          <CustomButton onClick={onHide} success label="Confirmar" />

        </div>
      </Modal.Body>
    </Modal>
  );
}
