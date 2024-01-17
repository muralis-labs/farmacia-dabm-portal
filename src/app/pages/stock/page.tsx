"use client";
import { useState, useEffect, useRef } from "react";
import CustomDataTable from "@/app/common/CustomDataTable/index";
import { useHandleGetStockList } from "@/app/hooks/useHandleGetStockList";
import Pagination from "@/app/common/Pagination/index";
import styles from "./page.module.scss";
import CustomInput from "@/app/common/CustomInput/index";
import colors from "@/app/sass/_variables.module.scss";
import Icon from "@/app/common/icon/index";
import CustomDatePickerRange from "@/app/common/CustomDatePickerRange/index";
import CustomButton from "@/app/common/CustomButton/index";
import moment from "moment";

export default function Page() {
  const getStockListService = useHandleGetStockList();
  const {
    refetchData: getStockList,
    data: stockList,
    isLoading: stockListLoading,
  } = getStockListService;

  const [showFilters, setShowFilters] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchGenericName, setSearchGenericName] = useState("");
  const [searchCommercialName, setSearchCommercialName] = useState("");
  const [searchPharmaceutical, setSearchPharmaceutical] = useState("");
  const [startEntryDate, setStartEntryDate] = useState(null);
  const [endEntryDate, setEndEntryDate] = useState(null);
  const [startExpirationDate, setStartExpirationDate] = useState(null);
  const [endExpirationDate, setEndExpirationDate] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [key, setKey] = useState(Math.random());
  const containerRef = useRef<any>(null);

  const headers = [
    {
      title: "N. Genérico",
      field: "medicine.genericName",
    },
    {
      title: "N. Comercial",
      field: "medicine.commercialName",
    },
    {
      title: "Prateleira",
      field: "shelf.name",
    },
    {
      title: "Cód Barras",
      field: "medicine.code",
    },
    {
      title: "Lote",
      field: "number",
    },
    {
      title: "Validade",
      field: "expiration",
    },
    {
      title: "Quantidade",
      field: "quantity",
    },
  ];

  const clearFilters = () => {
    setSearch("");
    setSearchCommercialName("");
    setSearchGenericName("");
    setStartEntryDate(null);
    setEndEntryDate(null);
    setEndExpirationDate(null);
    setStartExpirationDate(null);
    setSearchPharmaceutical("");
    getStockList({ page: 1, limit: 10 });
  };

  const handleChangePage = (page: number) => {
    setSelectedPage(page);
    getStockList({ page, limit: 10 });
  };

  const onChangeEntryDate = (dates: any) => {
    const [start, end] = dates;
    setStartEntryDate(start);
    setEndEntryDate(end);
  };

  const onChangeExpirationDate = (dates: any) => {
    const [start, end] = dates;
    setStartExpirationDate(start);
    setEndExpirationDate(end);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowFilters(false);
    }
  };

  const handleSelectRow = (row: any) => {
    let list = selectedRows;
    if (list.includes(row as never)) list.splice(list.indexOf(row as never), 1);
    else list.push(row as never);

    setKey(Math.random());
    setSelectedRows(list);
  };

  const handleSelectAllRows = () => {
    if (selectedRows.length === stockList.data.length) setSelectedRows([]);
    else setSelectedRows(stockList.data);
  };

  const getStockListWithFilters = () => {
    const entryDate = {
      start: moment(startEntryDate).subtract(1, "days").format("YYYY-MM-DD"),
      end: moment(endEntryDate).subtract(1, "days").format("YYYY-MM-DD"),
    };
    const expirationDate = {
      start: moment(startExpirationDate).subtract(1, "days").format("YYYY-MM-DD"),
      end: moment(endExpirationDate).subtract(1, "days").format("YYYY-MM-DD"),
    };
    const filter = {
      search,
      creationDateStart: entryDate.start,
      creationDateEnd: entryDate.end,
      expirationDateStart: expirationDate.start,
      expirationDateEnd: expirationDate.end,
      pharmaceutical: searchPharmaceutical,
      genericName: searchGenericName,
      commercialName: searchCommercialName,
    };
    getStockList(filter as any);
    setShowFilters(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let timer = setTimeout(() => {
      getStockListWithFilters();
    }, 700);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div>
      <div className={styles.filters}>
        <CustomInput
          id="search"
          placeholder="Buscar"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          search
          showIcon
          icon="lupe"
          iconSize={18}
          iconColor={colors.neutralColorGrayStrong}
        />

        <div className={styles.filterButton}>
          <div
            className={styles.icon}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Icon
              icon="funil"
              color={colors.neutralColorGraySoftest}
              size={12}
            />
          </div>

          {showFilters && (
            <div className={styles.filterForm}>
              <div className={styles.filterText}>
                <h2>Filtros</h2>
                <h3 onClick={clearFilters}>Limpar tudo</h3>
              </div>
              <CustomDatePickerRange
                id="entryDate"
                label="Data de atendimento"
                onChange={onChangeEntryDate}
                startDate={startEntryDate as any}
                endDate={endEntryDate as any}
              />
              <CustomInput
                id="searchGenericName"
                placeholder="Buscar nome genérico"
                label="Nome genérico"
                onChange={(event) => setSearchGenericName(event.target.value)}
                value={searchGenericName}
                showIcon
                icon="lupe"
                iconSize={15}
                iconColor={colors.neutralColorGrayStrong}
              />
              <CustomInput
                id="searchCommercialName"
                placeholder="Buscar Nome comercial"
                label="Nome comercial"
                onChange={(event) =>
                  setSearchCommercialName(event.target.value)
                }
                value={searchCommercialName}
                showIcon
                icon="lupe"
                iconSize={15}
                iconColor={colors.neutralColorGrayStrong}
              />
              <CustomInput
                id="searchPharmaceutical"
                placeholder="Buscar farmacêutico"
                label="Farmacêutico"
                onChange={(event) =>
                  setSearchPharmaceutical(event.target.value)
                }
                value={searchPharmaceutical}
                showIcon
                icon="lupe"
                iconSize={15}
                iconColor={colors.neutralColorGrayStrong}
              />
              <CustomDatePickerRange
                id="expirationDate"
                label="Data de validade"
                onChange={onChangeExpirationDate}
                startDate={startExpirationDate as any}
                endDate={endExpirationDate as any}
              />
              <CustomButton
                onClick={getStockListWithFilters}
                label="Aplicar"
                fullWidth
              />
            </div>
          )}
        </div>

        <div className={styles.icon}>
          <Icon
            icon="download"
            color={colors.neutralColorGraySoftest}
            size={12}
          />
        </div>
      </div>
      <CustomDataTable
      key={key}
        selection
        onSelectRow={handleSelectRow}
        onSelectAllRows={handleSelectAllRows}
        selectionList={selectedRows}
        headers={headers}
        rows={stockList ? (stockList.data as any[]) : []}
        isLoading={stockListLoading}
      />
      {!stockListLoading && stockList.data && (
        <Pagination
          onSelectPage={handleChangePage}
          limit={10}
          total={stockList.total}
          selectedPage={selectedPage}
        />
      )}
    </div>
  );
}
