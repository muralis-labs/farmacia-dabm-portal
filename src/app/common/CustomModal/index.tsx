import { Modal } from "react-bootstrap";
import colors from "@/app/sass/_variables.module.scss";
import Icon from "@/app/common/icon/index";
import styles from "./index.module.scss";
import CustomButton from "../CustomButton/index";

interface CustomModalProps {
  confirm?: boolean;
  warning?: boolean;
  icon?: string;
  show: boolean;
  onHide: () => void;
  title: string;
  description: string;
  handleConfirm: () => void;
  confirmButton: string;
}

export default function CustomModal({
  confirm = false,
  warning = false,
  icon = "trash",
  show,
  onHide,
  title,
  description,
  handleConfirm,
  confirmButton,
}: CustomModalProps) {
  const handleClickConfirm = () => {
    handleConfirm();
    onHide();
  };

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
          <div
            className={`${confirm ? styles.confirm : {}} ${warning ? styles.warning : {}} ${
              styles.actionContainer
            }`}
          >
            <Icon
              icon={icon}
              size={33}
              color={confirm ? colors.greenDarkest : warning ? colors.orangeDarkest : colors.volcanoStrong}
            />
          </div>
          <Icon
            onClick={onHide}
            icon="close"
            size={8}
            color={colors.brandColorPrimaryDarkActive}
          />
        </div>

        <div className={styles.modalInfo}>
          <span className={styles.topLine}>{title}</span>
          <span className={styles.bottomLine}>{description}</span>
        </div>

        <div className={styles.modalOptions}>
          <CustomButton onClick={onHide} label="Cancelar" onlyText />
          <CustomButton
            onClick={handleClickConfirm}
            label={confirmButton}
            success={confirm}
            warning={warning && !confirm}
            danger={!confirm && !warning}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}
