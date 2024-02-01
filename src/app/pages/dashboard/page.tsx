"use client";
import { useState, useEffect } from "react";
import "./page.scss";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import Icon from "@/app/common/icon/index";
import { useHandleGetCalendarList } from "@/app/hooks/useHandleGetCalendarList";
import { useHandleDiscardBatch } from "@/app/hooks/useHandleDiscardBatch";
import { useDeviceSelectors } from "react-device-detect";
import { useHandleGetMovementList } from "@/app/hooks/useHandleGetMovementList";
import CustomDataTable from "@/app/common/CustomDataTable/index";
import "moment/locale/pt-br";
import Image from "next/image";
import entry from "@/app/assets/entry.png";
import outflow from "@/app/assets/outflow.png";
import stock from "@/app/assets/stock.png";
import background from "@/app/assets/medicines_background.png";
import calendar_ilustr from "@/app/assets/calendar_ilustr.png";
import { useRouter } from "next/navigation";
import notFound from "@/app/assets/no_results_found.svg";
import CustomFloatButton from "@/app/common/CustomFloatButton/index";

export default function Dashboard() {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDayMedicines, setSelectedDayMedicines] = useState([]);
  const getCalendarList = useHandleGetCalendarList({ formatLabel: false });
  const { push } = useRouter();

  const {
    refetchData: getStockList,
    data: stockList,
    isLoading: stockListLoading,
  } = getCalendarList;

  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { isMobile } = selectors;

  const getMovementListService = useHandleGetMovementList(true);
  const {
    refetchData: getMovementList,
    data: movementList,
    isLoading: movementLoading,
  } = getMovementListService;

  const headers = [
    {
      title: "Nome Comercial",
      field: "commercial_name",
    },
    {
      title: "Quantidade",
      field: "quantity",
    },
    {
      title: "Lote",
      field: "number",
    },
    {
      title: "Atividade",
      field: "movement_type",
      showIcon: true,
    },
  ];

  const renderCustomHeader = ({ date, increaseMonth, decreaseMonth }) => {
    return (
      <div className="header">
        <Icon onClick={decreaseMonth} icon="arrow_left_simple" size={14} />

        {moment(date).format("MMM, YYYY")}

        <Icon onClick={increaseMonth} icon="arrow_right_simple" size={14} />
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
      </div>
    );
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
      <div className="left">
        {isMobile && <CustomFloatButton />}

        <div className="expirations">
          <div className="view">
            <div className="text">
              <span className="information">
                Vencimentos de {moment(startDate).format("MMMM")}
              </span>
              <span className="total">{stockList?.data?.length ?? 0}</span>
              <span className="medicines_label">medicamentos</span>
            </div>
            <Image
              className="calendar_illustration"
              alt="calendar_illustration"
              src={calendar_ilustr}
            />
          </div>
          <Image className="background" alt="background" src={background} />
        </div>

        {isMobile && <span className="actions">Ações</span>}
        <div className="routes">
          <div className="route" onClick={() => push("/pages/entry")}>
            <div className="routeInfo">
              <Image alt="route" src={entry} />
              <span className="routeName">Entrada</span>
            </div>
            {!isMobile && (
              <div className="routeButton">
                <Icon icon="arrow_right_simple" size={12} />
              </div>
            )}
          </div>
          <div className="route" onClick={() => push("/pages/outflow")}>
            <div className="routeInfo">
              <Image alt="route" src={outflow} />
              <span className="routeName">Saída</span>
            </div>
            {!isMobile && (
              <div className="routeButton">
                <Icon icon="arrow_right_simple" size={12} />
              </div>
            )}
          </div>
          <div className="route" onClick={() => push("/pages/stock")}>
            <div className="routeInfo">
              <Image alt="route" src={stock} />
              <span className="routeName">Estoque</span>
            </div>
            {!isMobile && (
              <div className="routeButton">
                <Icon icon="arrow_right_simple" size={12} />
              </div>
            )}
          </div>
        </div>

        {isMobile && movementList?.data?.length > 0 && (
          <div className="medicines mobile">
            <span className="actions">Ultimas atualizações</span>
            {movementList?.data?.map((item) => (
              <div className="medicine mobile">
                <div className="pillContainer">
                  <Icon icon="pill" size={16} />
                </div>
                <div className="divider" />
                <div className="medicineInfo">
                  <div className="top">
                    <div className="topTitle">{item.generic_name}</div>
                    <div className="movement_type">
                      <Icon
                        icon={
                          item.movement_type === "entry"
                            ? "arrow_up"
                            : item.movement_type === "discard"
                            ? "block"
                            : "arrow_down"
                        }
                        size={10}
                      />
                      {item.movement_type === "entry"
                        ? "Entrada"
                        : item.movement_type === "discard"
                        ? "Descarte"
                        : "Saída"}
                    </div>
                  </div>
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
              </div>
            ))}
          </div>
        )}

        {isMobile && movementList?.data?.length <= 0 && (
          <div className="notFoundContainer">
            <Image src={notFound} alt="not found" />
            <span className="notFoundText">Nenhum medicamento encontrado</span>
          </div>
        )}

        {!isMobile && (
          <div className="table">
            <span className="title">Últimas atualizações</span>
            <CustomDataTable
              key="tale-key"
              headers={headers}
              rows={movementList ? (movementList.data as any[]) : []}
              isLoading={movementLoading}
            />
          </div>
        )}
      </div>

      {!isMobile && (
        <div className={`sidebar ${isMobile ? "mobileSidebar" : ""}`}>
          <div className={`title ${isMobile ? "mobileTitle" : ""}`}>
            Vencimentos
            <div className="selectedDate">
              {moment(startDate).format("DD/MM/YYYY")}
            </div>
          </div>

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

          <div className="date  mobileTitle">
            {moment().format("DD/MM/YYYY") ===
            moment(startDate).format("DD/MM/YYYY")
              ? "Hoje"
              : moment(startDate).format("DD/MM/YYYY")}
          </div>

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
      )}
    </div>
  );
}
