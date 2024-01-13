"use client";
import { FormLabel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import CustomInput from "../CustomInput/index";
import styles from "./index.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import ptBR from "date-fns/locale/pt-BR";
type CustomDatePickerProps = {
  placeholder?: string;
  label?: string;
  type?: string;
  onChange?: (e: any) => void;
  value?: Date;
  id: string;
};

type DatePickerInput = {
  onClick?: (e: any) => void;
};

export default function CustomDatePicker({
  placeholder,
  label,
  onChange = () => {},
  value,
  id,
}: CustomDatePickerProps) {
  const formatDate = (date: Date) => {
    return moment(date).format("DD/MM/YYYY");
  };
  const DatePickerInput = ({ onClick }: DatePickerInput) => {
    return (
      <CustomInput
        id={id}
        readOnly
        label={label}
        onClick={onClick}
        placeholder={placeholder}
        value={value ? formatDate(value) : ''}
        showIcon
        icon="calendar"
      />
    );
  };
  return (
    <DatePicker
    wrapperClassName={styles.datePicker}
      selected={value}
      onChange={onChange}
      locale={ptBR}
      customInput={<DatePickerInput />}
    />
  );
}
