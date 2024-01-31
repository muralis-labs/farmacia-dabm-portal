"use client";
import { useState, useEffect } from "react";
import "./page.scss";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./page.module.scss";
import ptBR from "date-fns/locale/pt-BR";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import Icon from "@/app/common/icon/index";
import { useHandleGetCalendarList } from "@/app/hooks/useHandleGetCalendarList";
import CustomButton from "@/app/common/CustomButton/index";
import CustomModal from "@/app/common/CustomModal/index";
import { useHandleDiscardBatch } from "@/app/hooks/useHandleDiscardBatch";
import { useDeviceSelectors } from "react-device-detect";

export default function Calendar() {
  moment.locale("pt-br");
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDayMedicines, setSelectedDayMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const getCalendarList = useHandleGetCalendarList({ formatLabel: false });
  const discardBatchesService = useHandleDiscardBatch();
  const {
    refetchData: getStockList,
    data: stockList,
    isLoading: stockListLoading,
  } = getCalendarList;

  const { fetchData: discardBatches, isLoading: discardBatchesLoading } =
    discardBatchesService;

  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { isMobile } = selectors;

  const renderCustomHeader = ({ date, increaseMonth, decreaseMonth }) => {
    return (
      <div className="header">
        {isMobile && (
          <Icon onClick={decreaseMonth} icon="arrow_left_simple" size={14} />
        )}
        {moment(date).format("MMM, YYYY")}
        {isMobile && (
          <Icon onClick={increaseMonth} icon="arrow_right_simple" size={14} />
        )}
      </div>
    );
  };

  const renderDayContents = (day, date) => {
    const dayMedicines =
      stockList?.data?.filter(
        (item) =>
          moment(date).isSame(moment(item.expiration).format("YYYY-MM-DD")) &&
          item
      ) ?? [];

    return (
      <div className="dayContainer">
        <label className="dayLabel">{day}</label>
        {dayMedicines.length > 0 && !isMobile ? (
          <div className="info">
            <Icon icon="trash" size={12} />
            {dayMedicines.length}
          </div>
        ) : (
          <div className="divider" />
        )}
      </div>
    );
  };

  const translateDayOfWeek = (dayOfWeek) => {
    const translatedDays = {
      Mon: "S",
      Tue: "T",
      Wed: "Q",
      Thu: "Q",
      Fri: "S",
      Sat: "S",
      Sun: "D",
    };
    return translatedDays[dayOfWeek];
  };

  const daysOfMonth = ({ year, month }) => {
    moment.locale("pt-br");

    const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    const daysArray = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");
      const dayOfMonth = date.format("D");
      const dayOfWeek = translateDayOfWeek(date.format("ddd"));
      daysArray.push(`${dayOfMonth} ${dayOfWeek}`);
    }

    return (
      <div className="selector">
        {daysArray.map((day, index) => (
          <div
            className={`daySelector ${
              moment(startDate).format("D") === day.split(" ")[0]
                ? "selected"
                : ""
            }`}
            key={index}
          >
            {day.split(" ")[0]}
            <span className="dayNumber">{day.split(" ")[1]}</span>
          </div>
        ))}
      </div>
    );
  };

  const handleDiscardMedicines = async () => {
    await discardBatches(selectedDayMedicines);
    await getStockList({
      page: 1,
      limit: 999,
      expirationDateStart: moment()
        .startOf("month")
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      expirationDateEnd: moment()
        .endOf("month")
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    });
  };

  const handleSelectDate = (date) => {
    const formatedDate = moment(date).format("YYYY-MM-DD");
    const dayMedicines =
      stockList?.data?.filter(
        (item) =>
          moment(formatedDate).isSame(
            moment(item.expiration).format("YYYY-MM-DD")
          ) && item
      ) ?? [];

    setStartDate(date);
    setSelectedDayMedicines(dayMedicines);
  };

  useEffect(() => {
    setTimeout(() => handleSelectDate(new Date()), 3000);
  }, [stockList]);

  return (
    <div className={`page ${isMobile ? "mobilePage" : ""}`}>
      <CustomModal
        show={showModal}
        confirmButton="Registrar descarte"
        description=" Tem certeza que deseja realizar o descarte desses medicamentos? Essa
      ação não poderá ser desfeita"
        title="Descarte de medicamentos"
        onHide={() => setShowModal(false)}
        handleConfirm={() => handleDiscardMedicines()}
      />

      {!isMobile && (
        <ReactDatePicker
          selected={startDate}
          renderCustomHeader={renderCustomHeader}
          onChange={(date) => handleSelectDate(date)}
          formatWeekDay={(nameOfDay) => nameOfDay.split("-")[0]}
          locale={ptBR}
          calendarClassName="calendarContainer"
          renderDayContents={renderDayContents}
          inline
        />
      )}

      <div className={`sidebar ${isMobile ? "mobileSidebar" : ""}`}>
        <div className={`title ${isMobile ? "mobileTitle" : ""}`}>
          Vencimentos
          {!isMobile && (
            <div className="selectedDate">
              {moment(startDate).format("DD/MM/YYYY")}
            </div>
          )}
        </div>

        {isMobile && (
          <ReactDatePicker
            selected={startDate}
            renderCustomHeader={renderCustomHeader}
            onChange={(date) => handleSelectDate(date)}
            formatWeekDay={(nameOfDay) => nameOfDay.charAt(0).toUpperCase()}
            locale={ptBR}
            calendarClassName="mobileCalendarContainer"
            renderDayContents={renderDayContents}
            inline
          />
        )}

        {!isMobile &&
          daysOfMonth({
            year: moment().format("YYYY"),
            month: moment().format("MM"),
          })}

        <div className="expiratedMedicines">
          <div className="circleBigger">
            <div className="circleSmaller">
              <Icon icon="battery" size={36} />
            </div>
          </div>
          <span className="info">{selectedDayMedicines.length}</span>
          <span className="text">Medicamentos</span>
          {!isMobile && (
            <CustomButton
              label="Descartar todos"
              onClick={() => setShowModal(true)}
            />
          )}
        </div>

        {isMobile && (
          <div className={`date ${isMobile ? "mobileTitle" : ""}`}>
            {moment().format("DD/MM/YYYY") === moment(startDate).format("DD/MM/YYYY") ? 'Hoje' :  moment(startDate).format("DD/MM/YYYY")}
          </div>
        )}

        {selectedDayMedicines.length > 0 && (
          <div className="medicines">
            {selectedDayMedicines.map((item) => (
              <div className="medicine">
                <div className="pillContainer">
                  <Icon icon="pill" size={16} />
                </div>
                <div className="divider" />
                <div className="medicineInfo">
                  <div className="top">{item.generic_name}</div>
                  <div className="bottom">
                    <div className="itemInfo">
                      <Icon icon="hash" size={9} />
                      {item.number}
                    </div>
                    <div className="itemInfo">
                      <Icon icon="calendar" size={9} />
                      {moment(item.updatedAt).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
                <div className="total">{item.quantity}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
