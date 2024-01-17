"use client";
import DatePicker from "react-datepicker";
import CustomInput from "../CustomInput/index";
import styles from "./index.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import ptBR from "date-fns/locale/pt-BR";

type CustomDatePickerRangeProps = {
  label?: string;
  type?: string;
  onChange?: (e: any) => void;
  startDate?: Date;
  endDate?: Date;
  id: string;
  disabled?: boolean;
};

type DatePickerInput = {
  onClick?: (e: any) => void;
};

export default function CustomDatePickerRange({
  label,
  onChange = () => {},
  startDate,
  endDate,
  id,
  disabled = false,
}: CustomDatePickerRangeProps) {
  const formatDate = (date: Date) => {
    return moment(date).format("DD/MM/YYYY");
  };
  const DatePickerInput = ({ onClick }: DatePickerInput) => {
    return (
      <div className={styles.rangeContainer}>
        <CustomInput
          disabled={disabled}
          id={id}
          readOnly
          onClick={onClick}
          label={label}
          placeholder="dd/mm/aaaa"
          value={startDate ? formatDate(startDate) : ""}
          showIcon
          icon="calendar"
        />
        <CustomInput
          disabled={disabled}
          id={id}
          readOnly
          onClick={onClick}
          label=""
          placeholder="dd/mm/aaaa"
          value={endDate ? formatDate(endDate) : ""}
          showIcon
          icon="calendar"
        />
      </div>
    );
  };
  return (
    <DatePicker
      wrapperClassName={styles.datePicker}
      onChange={onChange}
      selected={startDate}
      startDate={startDate}
      endDate={endDate}
      locale={ptBR}
      customInput={<DatePickerInput />}
      selectsRange
    />
  );
}
