"use client";
import { useState, useEffect } from "react";
import CustomDataTable from "@/app/common/CustomDataTable/index";
import styles from "./page.module.scss";
import { Col, Form, Modal, Row } from "react-bootstrap";
import CustomInput from "@/app/common/CustomInput/index";
import CustomAutoComplete from "@/app/common/CustomAutoComplete/index";
import { useHandleShelves } from "@/app/hooks/useHandleShelves";
import { useHandleCreateShelf } from "@/app/hooks/useHandleCreateShelf";
import { useHandleGetMedicine } from "@/app/hooks/useHandleGetMedicine";
import { useHandleListMedicines } from "@/app/hooks/useHandleListMedicines";
import { UNIT_OF_MEASUREMENT } from "@/app/constants/selectors";
import CustomDatePicker from "@/app/common/CustomDatePicker/index";
import CustomButton from "@/app/common/CustomButton/index";
import { useHandleGetStockList } from "@/app/hooks/useHandleGetStockList";
import { useDeviceSelectors } from "react-device-detect";
import Scan from "./components/Scan";
import { useRouter, useSearchParams } from "next/navigation";
import CustomModal from "@/app/common/CustomModal/index";
import { useHandleDiscardBatch } from "@/app/hooks/useHandleDiscardBatch";
import CustomModalNotification from "@/app/common/CustomModalNotification/index";

interface Medicine {
  code: string;
  commercialName: string;
  genericName: string;
  expiration: Date;
  unitOfMeasurement: string;
  shelf: string;
  medicineId: string | null;
  batchId: string | null;
  shelfId: string | null;
  dosage: number | undefined;
  pharmaceutical: string;
  batch: string;
  quantity: number | undefined;
  entry: Date;
}

interface Batch {
  batch_id: string;
  id: string;
  medicine_id: string;
  shelf_id: string;
  quantity: number;
  expiration: Date;
  pharmaceutical: string;
  number: string;
  code: string;
  commercial_name: string;
  generic_name: string;
  dosage: number;
  unit_of_measurement: string;
  name: string;
}

interface MedicineData {
  id: string;
  commercialName: string;
  dosage: number;
  genericName: string;
  unitOfMeasurement: string;
}

export default function Page() {
  const getShelvesService = useHandleShelves();
  const createShelfService = useHandleCreateShelf();
  const getMedicineService = useHandleGetMedicine();
  const listMedicinesService = useHandleListMedicines();
  const getStockListService = useHandleGetStockList({ formatLabel: true });
  const discardBatchesService = useHandleDiscardBatch();

  const { data: shelves, fetchData: getShelvesFetchData } = getShelvesService;
  const { fetchData: createShelfData } = createShelfService;
  const { fetchData: getMedicineData, isLoading: getMedicineLoading } =
    getMedicineService;
  const {
    data: listMedicinesData,
    refetchData: listMedicinesFetchData,
    isLoading: listMedicinesLoading,
  } = listMedicinesService;
  const {
    refetchData: getStockList,
    data: stockList,
    isLoading: stockListLoading,
  } = getStockListService;
  const { fetchData: discardBatches, isLoading: discardBatchesLoading } =
    discardBatchesService;

  const { push } = useRouter();
  const searchParams = useSearchParams();
  const scan = searchParams.get("scan");
  const [rows, setRows] = useState<Medicine[]>([]);
  const [code, setCode] = useState<string>("");
  const [commercialName, setCommercialName] = useState<string>("");
  const [genericName, setGenericName] = useState<string>("");
  const [unitOfMeasurement, setUnitOfMeasurement] = useState<string>("");
  const [dosage, setDosage] = useState<number | undefined>(0);
  const [quantity, setQuantity] = useState<number | undefined>(0);
  const [batch, setBatch] = useState<string>("");
  const [expiration, setExpiration] = useState<Date | undefined>(undefined);
  const [pharmaceutical, setPharmaceutical] = useState<string>("");
  const [shelf, setShelf] = useState<string>("");
  const [shelfId, setShelfId] = useState<string | null>(null);
  const [medicineId, setMedicineId] = useState<string | null>(null);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const [scanCode, setScanCode] = useState("");
  const { isMobile } = selectors;

  const headers = [
    { title: "Cód Barras", field: "code" },
    { title: "Nome Comercial", field: "commercialName" },
    { title: "Nome Genérico", field: "genericName" },
    { title: "Lote", field: "batch" },
    { title: "Validade", field: "expiration" },
    { title: "Quantidade", field: "quantity" },
    { title: "Data de entrada", field: "entry" },
  ];

  const handleCreateNewShelf = async (data: string) => {
    const res = await createShelfData(data as any);
    setShelf(res[0].name);
    setShelfId(res[0].id);
    await getShelvesFetchData();
  };

  const handleSelectCode = (selectedMedicine: Medicine) => {
    setCode(selectedMedicine.code);
    setCommercialName(selectedMedicine.commercialName);
    setGenericName(selectedMedicine.genericName);
    setDosage(selectedMedicine.dosage);
    setUnitOfMeasurement(selectedMedicine.unitOfMeasurement);
  };

  const handleSelectBatch = (selectedBatch: Batch) => {
    const unit = UNIT_OF_MEASUREMENT.find(
      (item) => item.name === selectedBatch["unit_of_measurement"]
    );

    setCode(selectedBatch["code"]);
    setBatch(selectedBatch["number"]);
    setBatchId(selectedBatch["batch_id"]);
    setMedicineId(selectedBatch["medicine_id"]);
    setCommercialName(selectedBatch["commercial_name"]);
    setGenericName(selectedBatch["generic_name"]);
    setDosage(selectedBatch["dosage"]);
    setPharmaceutical(selectedBatch["pharmaceutical"]);
    setUnitOfMeasurement(unit?.name ?? "");
    setShelf(selectedBatch["name"]);
    setShelfId(selectedBatch["shelf_id"]);
    setQuantity(selectedBatch["quantity"]);
    setExpiration(new Date(selectedBatch["expiration"]));
  };

  const resetFields = () => {
    setCode("");
    setBatch("");
    setBatchId("");
    setMedicineId("");
    setCommercialName("");
    setGenericName("");
    setDosage(0);
    setPharmaceutical("");
    setUnitOfMeasurement("");
    setShelf("");
    setShelfId("");
    setQuantity(0);
    setExpiration(undefined);
  };

  const updateMedicineList = () => {
    const existingMedicineIndex = rows.findIndex(
      (medicine) => medicine.code === code
    );

    if (existingMedicineIndex !== -1) {
      const updatedRows = [...rows];
      updatedRows[existingMedicineIndex] = {
        ...updatedRows[existingMedicineIndex],
        commercialName,
        genericName,
        expiration: expiration ?? new Date(),
        unitOfMeasurement,
        shelf,
        medicineId: medicineId ?? null,
        batchId: batchId ?? null,
        shelfId,
        dosage,
        pharmaceutical,
        batch,
        quantity: quantity ?? 0,
        entry: new Date(),
      };
      setRows(updatedRows);
    } else {
      const newMedicine = {
        code,
        commercialName,
        genericName,
        expiration: expiration ?? new Date(),
        unitOfMeasurement,
        shelf,
        medicineId: medicineId ?? null,
        batchId: batchId ?? null,
        shelfId,
        dosage,
        pharmaceutical,
        batch,
        quantity: quantity ?? 0,
        entry: new Date(),
      };

      const updatedRows = [...rows, newMedicine];
      setRows(updatedRows);
    }

    resetFields();
  };

  const handleUploadAllMedicinesMobile = async () => {
    const newMedicine = {
      code,
      commercialName,
      genericName,
      expiration: expiration ?? new Date(),
      unitOfMeasurement,
      shelf,
      medicineId: medicineId ?? null,
      batchId: batchId ?? null,
      shelfId,
      dosage,
      pharmaceutical,
      batch,
      quantity: quantity ?? 0,
      entry: new Date(),
    };

    await discardBatches([newMedicine]);
    resetFields();
    setShowSuccess(true);
  };

  const setMedicineFields = (data: MedicineData) => {
    const unit = UNIT_OF_MEASUREMENT.find(
      (item) => item.name === data.unitOfMeasurement
    );

    setMedicineId(data.id);
    setCommercialName(data.commercialName);
    setDosage(data.dosage);
    setGenericName(data.genericName);
    setUnitOfMeasurement(unit?.name || ""); // Garante que não seja 'undefined'
  };

  const clearMedicineFields = () => {
    setMedicineId(null);
    setGenericName("");
    setCommercialName("");
    setUnitOfMeasurement("");
    setDosage(0);
  };

  const validateForm = (): boolean => {
    const requiredFieldsFilled =
      code.trim() !== "" &&
      commercialName.trim() !== "" &&
      genericName.trim() !== "" &&
      unitOfMeasurement.trim() !== "" &&
      dosage !== 0 &&
      quantity !== 0 &&
      batch.trim() !== "" &&
      expiration !== null &&
      pharmaceutical.trim() !== "" &&
      shelf.trim() !== "";

    return !requiredFieldsFilled;
  };

  const handleUpdateStock = async () => {
    await discardBatches(rows);
    resetFields();
    setRows([]);
    setShowSuccess(true);
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      if (scanCode) {
        push("/pages/outflow");
        setCode(scanCode);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [scanCode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        getStockList({ page: 1, limit: 10, search: batch });
      } catch (error) {
        console.error("Erro ao obter dados do medicamento:", error);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 700);

    return () => clearTimeout(timer);
  }, [batch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const body = commercialName ? { commercialName } : { genericName };
        await listMedicinesFetchData(body);
      } catch (error) {
        console.error("Erro ao obter dados do medicamento:", error);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 700);

    return () => clearTimeout(timer);
  }, [commercialName, genericName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMedicineData({ code });
        getStockList({ page: 1, limit: 10, search: code });

        if (data) {
          setMedicineFields(data);
        } else {
          clearMedicineFields();
        }
      } catch (error) {
        console.error("Erro ao obter dados do medicamento:", error);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 700);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <>
      <div
        className={`${styles.entry} ${styles.mobileScan} ${
          isMobile ? styles.mobile : ""
        }`}
      >
        {scan ? (
          <Scan
            isMobile={isMobile}
            onScanMobile={(code) => setScanCode(code)}
            onChange={(event) => setScanCode(event.target.value)}
          />
        ) : (
          <div
            className={`${styles.entryContainer} ${styles.flexColDirection}`}
          >
            <div className={styles.topInfo}>
              <h2 className={`${styles.title} ${styles.warning}`}>Informações do Medicamento</h2>
              <div className={styles.divider} />
            </div>
            <Form className={styles.flexColDirection}>
              <Row className={isMobile ? styles.mobileRow : ""}>
                <Col>
                  <CustomInput
                    value={code}
                    onChange={(event) => setCode(event?.target.value)}
                    id="code"
                    label="Código de barras"
                    placeholder="Digite o código de barras"
                    showIcon
                    icon="scan"
                  />
                </Col>
                <Col>
                  <CustomAutoComplete
                    value={commercialName}
                    id="commercial-name"
                    label="Nome Comercial"
                    placeholder="Digite o nome comercial do produto"
                    allowCreation={false}
                    disabled={getMedicineLoading}
                    items={listMedicinesData.data}
                    onSearchItem={(event) =>
                      setCommercialName(event.target.value)
                    }
                    loadSearch={listMedicinesLoading}
                    onItemSelect={(item) => handleSelectCode(item)}
                    field="commercialName"
                  />
                </Col>
                <Col>
                  <CustomAutoComplete
                    value={genericName}
                    id="generic-name"
                    label="Nome Genérico"
                    placeholder="Digite o nome genérico do produto"
                    allowCreation={false}
                    disabled={getMedicineLoading}
                    items={listMedicinesData.data as any}
                    onSearchItem={(event) => setGenericName(event.target.value)}
                    loadSearch={listMedicinesLoading}
                    onItemSelect={(item) => handleSelectCode(item)}
                    field="genericName"
                  />
                </Col>
              </Row>
              <Row className={isMobile ? styles.mobileRow : ""}>
                <Col>
                  <CustomAutoComplete
                    value={unitOfMeasurement ?? ""}
                    id="unitOfMeasurement"
                    label="Unidade de medida"
                    placeholder="Selecione a unidade de medida"
                    disabled={true}
                    items={UNIT_OF_MEASUREMENT as any}
                    onItemSelect={(item) => setUnitOfMeasurement(item.name)}
                    field="name"
                  />
                </Col>
                <Col>
                  <CustomInput
                    value={dosage}
                    onChange={(event) => setDosage(event.target.value)}
                    disabled={true}
                    id="dosage"
                    type="number"
                    label="Dosagem"
                    placeholder="Digite a dosagem"
                  />
                </Col>
                <Col>
                  <CustomInput
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    disabled={true}
                    id="quantity"
                    type="number"
                    label="Quantidade"
                    placeholder="Digite a quantidade"
                  />
                </Col>
              </Row>
              <Row className={isMobile ? styles.mobileRow : ""}>
                <Col>
                  <CustomAutoComplete
                    value={batch}
                    id="batch"
                    label="Lote"
                    placeholder="Digite o lote do produto"
                    allowCreation={false}
                    disabled={getMedicineLoading}
                    items={stockList.data as any}
                    onSearchItem={(event) => setBatch(event.target.value)}
                    loadSearch={stockListLoading}
                    onItemSelect={(item) => handleSelectBatch(item)}
                    field="number"
                  />
                </Col>
                <Col>
                  <CustomDatePicker
                    value={expiration}
                    onChange={(date) => setExpiration(date)}
                    id="expiration"
                    label="Data de validade"
                    placeholder="Data de validade"
                    disabled={true}
                  />
                </Col>
                <Col>
                  <CustomInput
                    value={pharmaceutical}
                    onChange={(event) => setPharmaceutical(event.target.value)}
                    id="pharmaceutical"
                    label="Farmacêutico"
                    placeholder="Nome do farmacêutico"
                    disabled={true}
                  />
                </Col>

                <Col>
                  <CustomAutoComplete
                    value={shelf ?? ""}
                    id="shelf"
                    label="Prateleira"
                    placeholder="Selecione a prateleira"
                    disabled={true}
                    handleNewItem={(item) => handleCreateNewShelf(item)}
                    items={shelves as any[]}
                    field="name"
                    onItemSelect={(item) => {
                      setShelf(item.name);
                      setShelfId(item.id);
                    }}
                  />
                </Col>
              </Row>

              {!isMobile && (
                <Row xs={4} md={4} lg={4}>
                  <Col>
                    <CustomButton
                      key="enter-medicine"
                      fullWidth
                      disabled={validateForm()}
                      onClick={updateMedicineList}
                      warning
                      label="Adicionar item à lista de descarte"
                    />
                  </Col>
                </Row>
              )}
            </Form>
            {!isMobile && (
              <>
                <h2
                  className={`${styles.title} ${styles.warning} ${styles.mt}`}
                >
                  Lista de registro para descarte
                </h2>
                <CustomDataTable
                  isLoading={discardBatchesLoading}
                  headers={headers}
                  rows={rows}
                  key="data-table"
                />
                <div className={styles.options}>
                  <CustomButton
                    // disabled={rows.length <= 0}
                    onClick={() => setShowModal(true)}
                    label="Registrar Descarte"
                    warning
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {isMobile && !validateForm() && (
        <div className={styles.mobileOptions}>
          <CustomButton
            onClick={() => setShowModal(true)}
            largeButton
            warning
            label="Registrar Descarte"
          />
        </div>
      )}

      <CustomModalNotification
        title="Medicamentos descartados com sucesso!"
        onHide={() => setShowSuccess(false)}
        show={showSuccess}
      />

      <CustomModal
        show={showModal}
        confirmButton="Registrar Descarte"
        description=" Tem certeza que deseja realizar o descarte desses medicamentos? Essa
      ação não poderá ser desfeita"
        title="Descarte de medicamentos"
        onHide={() => setShowModal(false)}
        warning
        icon="warning"
        handleConfirm={() =>
          isMobile ? handleUploadAllMedicinesMobile() : handleUpdateStock()
        }
      />
    </>
  );
}
