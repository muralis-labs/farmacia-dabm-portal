"use client";
import { useState, useEffect, useRef } from "react";
import CustomDataTable from "@/app/common/CustomDataTable/index";
import Pagination from "@/app/common/Pagination/index";
import styles from "./page.module.scss";
import CustomInput from "@/app/common/CustomInput/index";
import colors from "@/app/sass/_variables.module.scss";
import Icon from "@/app/common/icon/index";
import CustomDatePickerRange from "@/app/common/CustomDatePickerRange/index";
import CustomButton from "@/app/common/CustomButton/index";
import moment from "moment";
import { useDeviceSelectors } from "react-device-detect";
import { useHandleGetMovementList } from "@/app/hooks/useHandleGetMovementList";
import CustomAutoComplete from "@/app/common/CustomAutoComplete/index";
import { MOVEMENTS_TYPES } from "@/app/constants/selectors";
import { useHandleConvertList } from "@/app/hooks/useHandleConvertList";

export default function Page() {
  const getMovementListService = useHandleGetMovementList(false);
  const convertListService = useHandleConvertList();
  const {
    refetchData: getMovementList,
    data: movementList,
    isLoading: movementLoading,
  } = getMovementListService;
  const { fetchData: convertListFetchData, isLoading: convertListLoading } =
    convertListService;

  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { isMobile } = selectors;

  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchMovementType, setSearchMovementType] = useState({
    name: undefined,
    value: undefined,
  });
  const [searchGenericName, setSearchGenericName] = useState("");
  const [searchCommercialName, setSearchCommercialName] = useState("");
  const [searchPharmaceutical, setSearchPharmaceutical] = useState("");
  const [startEntryDate, setStartEntryDate] = useState(null);
  const [endEntryDate, setEndEntryDate] = useState(null);
  const [startExpirationDate, setStartExpirationDate] = useState(null);
  const [endExpirationDate, setEndExpirationDate] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [key, setKey] = useState(Math.random());
  const [pageLimit, setPageLimit] = useState(10);
  const containerRef = useRef<any>(null);

  const headers = [
    {
      title: "N. Genérico",
      field: "generic_name",
    },
    {
      title: "N. Comercial",
      field: "commercial_name",
    },
    {
      title: "Prateleira",
      field: "name",
    },
    {
      title: "Cód Barras",
      field: "code",
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
    {
      title: "Farmacêutico",
      field: "pharmaceutical",
    },
    {
      title: "Atividade",
      field: "movement_type",
      showIcon: true,
    },
    {
      title: "Data",
      field: "updated_at",
    },
  ];

  const clearFilters = () => {
    setSearch("");
    setSearchMovementType({ name: undefined, value: undefined });
    setSearchCommercialName("");
    setSearchGenericName("");
    setStartEntryDate(null);
    setEndEntryDate(null);
    setEndExpirationDate(null);
    setStartExpirationDate(null);
    setSearchPharmaceutical("");
    getMovementList({ page: 1, limit: 10 });
  };

  const handleChangeLimit = (limit: number) => {
    setPageLimit(limit);
    handleChangePage(selectedPage, limit);
  };

  const handleChangePage = (page: number, limit: number) => {
    setSelectedPage(page);
    getMovementList({ page, limit });
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
    if (
      showFilters &&
      containerRef.current &&
      !containerRef.current.contains(event.target)
    ) {
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
    if (selectedRows.length === movementList.data.length) setSelectedRows([]);
    else setSelectedRows(movementList.data);
  };

  const renderTagFilters = () => {
    return (
      <div className={styles.tagsContainer}>
        {search && (
          <div className={styles.tag}>
            {search}
            <Icon
              icon="close"
              size={8}
              onClick={() => {
                setSearch("");
                getMovementListWithFilters();
              }}
            />
          </div>
        )}
        {searchMovementType?.name && (
          <div className={styles.tag}>
            {searchMovementType.name}
            <Icon
              icon="close"
              size={8}
              onClick={() => {
                setSearchMovementType({ name: undefined, value: undefined });
                getMovementListWithFilters();
              }}
            />
          </div>
        )}
        {searchGenericName && (
          <div className={styles.tag}>
            {searchGenericName}
            <Icon
              icon="close"
              size={8}
              onClick={() => {
                setSearchGenericName("");
                getMovementListWithFilters();
              }}
            />
          </div>
        )}{" "}
        {searchCommercialName && (
          <div
            className={styles.tag}
            onClick={() => {
              setSearchCommercialName("");
              getMovementListWithFilters();
            }}
          >
            {searchCommercialName}
            <Icon icon="close" size={8} />
          </div>
        )}{" "}
        {searchPharmaceutical && (
          <div
            className={styles.tag}
            onClick={() => {
              setSearchPharmaceutical("");
              getMovementListWithFilters();
            }}
          >
            {searchPharmaceutical}
            <Icon icon="close" size={8} />
          </div>
        )}
        {moment(startEntryDate).isValid() && moment(endEntryDate).isValid() && (
          <div className={styles.tag}>
            {`${moment(startEntryDate).format("DD/MM/YYYY")} - ${moment(
              endEntryDate
            ).format("DD/MM/YYYY")}`}
            <Icon
              icon="close"
              size={8}
              onClick={() => {
                setStartEntryDate(null);
                setEndEntryDate(null);
                getMovementListWithFilters();
              }}
            />
          </div>
        )}
        {moment(startExpirationDate).isValid() &&
          moment(endExpirationDate).isValid() && (
            <div className={styles.tag}>
              {`${moment(startExpirationDate).format("DD/MM/YYYY")} - ${moment(
                endExpirationDate
              ).format("DD/MM/YYYY")}`}
              <Icon
                icon="close"
                size={8}
                onClick={() => {
                  setStartExpirationDate(null);
                  setEndExpirationDate(null);
                  getMovementListWithFilters();
                }}
              />
            </div>
          )}
      </div>
    );
  };

  const handleConvertList = async () => {
    const rows =
      selectedRows.length > 0
        ? selectedRows.map((item) => ({
            ...item,
            expiration: moment(item.expiration).format("DD-MM-YYYY"),
            updated_at: moment(item.updated_at).format("DD-MM-YYYY"),
            movement_type: item.movement_type === "entry" ? "Entrada" : "Saída",
          }))
        : [];
    const res = await convertListFetchData({ rows, headers });

    if (res) {
      const link = document.createElement("a");
      link.href = `data:application/octet-stream;base64, ${res}`;
      link.download = `movimentação-${moment().format("DD-MM-YYYY")}.xlsx`;
      link.click();
    }
  };

  const getMovementListWithFilters = () => {
    const entryDate = {
      start: moment(startEntryDate).subtract(1, "days").format("YYYY-MM-DD"),
      end: moment(endEntryDate).subtract(1, "days").format("YYYY-MM-DD"),
    };
    const expirationDate = {
      start: moment(startExpirationDate)
        .subtract(1, "days")
        .format("YYYY-MM-DD"),
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
      movementType: searchMovementType?.value ?? "",
    };
    getMovementList(filter as any);
    setShowFilters(false);
  };

  const renderMobileCard = (item) => {
    return (
      <div className={styles.card}>
        <div className={styles.cardRow}>
          <span className={styles.name}>Nome Comercial: </span>
          <span className={styles.info}>{item["commercial_name"] ?? ""}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.name}>Nome Genérico: </span>
          <span className={styles.info}>{item["generic_name"] ?? ""}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.name}>Prateleira: </span>
          <span className={styles.info}>{item["name"] ?? ""}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.name}>Código: </span>
          <span className={styles.info}>{item["code"] ?? ""}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.name}>Lote: </span>
          <span className={styles.info}>{item["number"] ?? ""}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.name}>Validade: </span>
          <span className={styles.info}>
            {moment(item.expiration).format("DD/MM/YYYY") ?? ""}
          </span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.name}>Quantidade: </span>
          <span className={styles.info}>{item.quantity ?? ""}</span>
        </div>
      </div>
    );
  };

  const handleScroll = (e) => {
    const next = selectedPage + 1;

    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom && isMobile && limit < movementList.total) {
      getMovementList({ limit: limit + 5, page: 1 });
      setLimit(limit + 5);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let timer = setTimeout(() => {
      getMovementListWithFilters();
    }, 700);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      {!isMobile ? (
        <div className={styles.page}>
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
                <div ref={containerRef} className={styles.filterForm}>
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
                  <CustomAutoComplete
                    value={searchMovementType?.name ?? ""}
                    id="searchMovementType"
                    label="Tipo de movimentação"
                    placeholder="Selecione a unidade de medida"
                    items={MOVEMENTS_TYPES as any}
                    onItemSelect={(item) => setSearchMovementType(item)}
                    field="name"
                  />
                  <CustomInput
                    id="searchGenericName"
                    placeholder="Buscar nome genérico"
                    label="Nome genérico"
                    onChange={(event) =>
                      setSearchGenericName(event.target.value)
                    }
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
                    onClick={getMovementListWithFilters}
                    label="Aplicar"
                    fullWidth
                  />
                </div>
              )}
            </div>

            <div className={styles.icon} onClick={handleConvertList}>
              <Icon
                icon="download"
                color={colors.neutralColorGraySoftest}
                size={12}
              />
            </div>
          </div>
          {renderTagFilters()}
          <CustomDataTable
            key={key}
            selection
            onSelectRow={handleSelectRow}
            onSelectAllRows={handleSelectAllRows}
            selectionList={selectedRows}
            headers={headers}
            rows={movementList ? (movementList.data as any[]) : []}
            isLoading={movementLoading}
          />
          {!movementLoading && movementList.data && (
            <Pagination
              onSelectPage={(page) => handleChangePage(page, pageLimit)}
              limit={pageLimit}
              onChangeLimit={handleChangeLimit}
              total={movementList.total}
              selectedPage={selectedPage}
            />
          )}
        </div>
      ) : (
        <div>
          {movementList.data && movementList.data.length > 0 && (
            <div onScroll={handleScroll} className={styles.listContainer}>
              {movementList.data.map((item) => renderMobileCard(item))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
