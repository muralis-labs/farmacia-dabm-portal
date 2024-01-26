"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomButton from "@/app/common/CustomButton/index";
import CustomInput from "@/app/common/CustomInput/index";
import { Col, Form, Row } from "react-bootstrap";
import styles from "./page.module.scss";
import CustomDatePicker from "@/app/common/CustomDatePicker/index";
import CustomAutoComplete from "@/app/common/CustomAutoComplete/index";
import { UNIT_OF_MEASUREMENT } from "../../constants/selectors";
import CustomDataTable from "@/app/common/CustomDataTable/index";
import { useHandleShelves } from "@/app/hooks/useHandleShelves";
import { useHandleCreateShelf } from "@/app/hooks/useHandleCreateShelf";
import { useHandleGetMedicine } from "@/app/hooks/useHandleGetMedicine";
import { useDeviceSelectors } from "react-device-detect";
import { useHandleUploadMedicines } from "@/app/hooks/useHandleUploadMedicines";
import Scan from "./components/Scan";
import { useHandleListMedicines } from "@/app/hooks/useHandleListMedicines";
import CustomModal from "@/app/common/CustomModal/index";

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

export default function Entry() {
  const getShelvesService = useHandleShelves();
  const createShelfService = useHandleCreateShelf();
  const getMedicineService = useHandleGetMedicine();
  const uploadMedicinesService = useHandleUploadMedicines();
  const listMedicinesService = useHandleListMedicines();

  const {
    data: shelves,
    fetchData: getShelvesFetchData,
    isLoading: getShelvesLoading,
  } = getShelvesService;
  const { fetchData: createShelfData, isLoading: createShelfLoading } =
    createShelfService;
  const { fetchData: getMedicineData, isLoading: getMedicineLoading } =
    getMedicineService;
  const {
    fetchData: uploadMedicinesFetchData,
    isLoading: uploadMedicinesLoading,
  } = uploadMedicinesService;
  const {
    data: listMedicinesData,
    refetchData: listMedicinesFetchData,
    isLoading: listMedicinesLoading,
  } = listMedicinesService;

  const { push } = useRouter();

  const searchParams = useSearchParams();
  const scan = searchParams.get("scan");

  const [scanCode, setScanCode] = useState("");
  const [code, setCode] = useState("");
  const [commercialName, setCommercialName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [expiration, setExpiration] = useState<Date | undefined>();
  const [unitOfMeasurement, setUnitOfMeasurement] = useState("");
  const [shelf, setShelf] = useState("");
  const [medicineId, setMedicineId] = useState(null);
  const [shelfId, setShelfId] = useState(null);
  const [dosage, setDosage] = useState<number | undefined>(0);
  const [pharmaceutical, setPharmaceutical] = useState("");
  const [batch, setBatch] = useState("");
  const [quantity, setQuantity] = useState<number | undefined>(0);
  const [medicinesList, setMedicineList] = useState<any[]>([]);
  const [key, setKey] = useState(Math.random());
  const [edit, setEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectors] = useDeviceSelectors(window.navigator.userAgent);

  const { isMobile } = selectors;

  const headers = [
    {
      title: "Cód Barras",
      field: "code",
    },
    {
      title: "Nome Comercial",
      field: "commercialName",
    },
    {
      title: "Nome Genérico",
      field: "genericName",
    },
    {
      title: "Lote",
      field: "batch",
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
      title: "Data de entrada",
      field: "entry",
    },
  ];

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

  const handleAddMedicine = () => {
    const medicineIndex = medicinesList.findIndex((item) => item.code === code);

    const data = {
      code,
      commercialName,
      genericName,
      expiration,
      unitOfMeasurement,
      shelf,
      medicineId,
      shelfId,
      dosage,
      pharmaceutical,
      batch,
      quantity,
      entry: new Date(),
    };

    let info = medicinesList;
    if (medicineIndex !== -1) {
      info[medicineIndex] = data;
    } else {
      info.push(data);
    }
    setMedicineList(info);
    setKey(Math.random);
    clearFields();
  };

  const clearMedicineFields = () => {
    setMedicineId(null);
    setGenericName("");
    setCommercialName("");
    setUnitOfMeasurement("");
    setDosage(0);
  };

  const clearFields = () => {
    setCode("");
    clearMedicineFields();
    setExpiration(undefined);
    setQuantity(0);
    setBatch("");
    setShelf("");
    setShelfId(null);
    setPharmaceutical("");
    setMedicineId(null);
  };

  const handleCreateNewShelf = async (data: string) => {
    const res = await createShelfData(data as any);
    setShelf(res[0].name);
    setShelfId(res[0].id);
    await getShelvesFetchData();
  };

  const handleRemoveMedicine = (medicine: any) => {
    const list = medicinesList;
    const index = list.findIndex((item) => item === medicine);
    list.splice(index, 1);
    setMedicineList(list);
    setKey(Math.random());
  };

  const handleEditMedicine = (medicine: any) => {
    setEdit(true);
    setCode(medicine.code);
    setGenericName(medicine.genericName);
    setCommercialName(medicine.commercialName);
    setPharmaceutical(medicine.pharmaceutical);
    setBatch(medicine.batch);
    setShelf(medicine.shelf);
    setDosage(medicine.dosage);
    setUnitOfMeasurement(medicine.unitOfMeasurement);
    setExpiration(new Date(medicine.expiration));
    setQuantity(medicine.quantity);
  };

  const handleUploadAllMedicines = async () => {
    uploadMedicinesFetchData(medicinesList);
    setMedicineList([]);
    clearFields();
  };

  const handleUploadAllMedicinesMobile = async () => {
    const data = [
      {
        code,
        commercialName,
        genericName,
        expiration,
        unitOfMeasurement,
        shelf,
        medicineId,
        shelfId,
        dosage,
        pharmaceutical,
        batch,
        quantity,
        entry: new Date(),
      },
    ];
    uploadMedicinesFetchData(data);
    setMedicineList([]);
    clearFields();
  };

  const handleSelectCode = (selectedMedicine: Medicine) => {
    setCode(selectedMedicine.code);
    setCommercialName(selectedMedicine.commercialName);
    setGenericName(selectedMedicine.genericName);
    setDosage(selectedMedicine.dosage);
    setUnitOfMeasurement(selectedMedicine.unitOfMeasurement);
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      if (scanCode) {
        push("/pages/entry");
        setCode(scanCode);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [scanCode]);

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
    const getData = async () => {
      const data = await getMedicineData({ code });

      if (data) {
        const unit: any = UNIT_OF_MEASUREMENT.find(
          (item) => item.name === data.unitOfMeasurement
        );

        setMedicineId(data.id);
        setCommercialName(data.commercialName);
        setDosage(data.dosage);
        setGenericName(data.genericName);
        setUnitOfMeasurement(unit.name);
      } else {
        clearMedicineFields();
      }
    };

    let timer = setTimeout(() => {
      if (!edit) getData();
    }, 700);
    setEdit(false);
    return () => clearTimeout(timer);
  }, [code]);

  return (
    <>
      <div
        className={`${styles.entry} ${scan ? styles.mobileScan : ""} ${
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
            key={key}
            className={`${styles.entryContainer} ${styles.flexColDirection}`}
          >
            <div className={styles.topInfo}>
              <h2 className={styles.title}>Informações do Medicamento</h2>
              <div className={styles.divider} />
            </div>
            <Form className={styles.flexColDirection}>
              <Row className={`${isMobile ? styles.mobileRow : ""}`}>
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
              <Row className={`${isMobile ? styles.mobileRow : ""}`}>
                <Col>
                  <CustomAutoComplete
                    value={unitOfMeasurement ?? ""}
                    id="unitOfMeasurement"
                    label="Unidade de medida"
                    placeholder="Selecione a unidade de medida"
                    disabled={getMedicineLoading || medicineId !== null}
                    items={UNIT_OF_MEASUREMENT as any}
                    onItemSelect={(item) => setUnitOfMeasurement(item.name)}
                    field="name"
                  />
                </Col>
                <Col>
                  <CustomInput
                    value={dosage}
                    onChange={(event) => setDosage(event.target.value)}
                    disabled={getMedicineLoading || medicineId !== null}
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
                    id="quantity"
                    type="number"
                    label="Quantidade"
                    placeholder="Digite a quantidade"
                  />
                </Col>
              </Row>
              <Row className={`${isMobile ? styles.mobileRow : ""}`}>
                <Col>
                  <CustomInput
                    value={batch}
                    onChange={(event) => setBatch(event.target.value)}
                    id="batch"
                    label="Lote"
                    placeholder="Digite o lote do produto"
                  />
                </Col>
                <Col>
                  <CustomDatePicker
                    value={expiration}
                    onChange={(date) => setExpiration(date)}
                    id="expiration"
                    label="Data de validade"
                    placeholder="Data de validade"
                  />
                </Col>
                <Col>
                  <CustomInput
                    value={pharmaceutical}
                    onChange={(event) => setPharmaceutical(event.target.value)}
                    id="pharmaceutical"
                    label="Farmacêutico"
                    placeholder="Nome do farmacêutico"
                  />
                </Col>
                <Col>
                  <CustomAutoComplete
                    value={shelf ?? ""}
                    id="shelf"
                    label="Prateleira"
                    placeholder="Selecione a prateleira"
                    disabled={getShelvesLoading || createShelfLoading}
                    handleNewItem={(item) => handleCreateNewShelf(item)}
                    items={shelves as any}
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
                  <Col xs={isMobile ? 12 : 6}>
                    <CustomButton
                      fullWidth
                      disabled={validateForm() || getShelvesService.isLoading}
                      onClick={handleAddMedicine}
                      label="Adicionar Medicamento"
                    />
                  </Col>
                </Row>
              )}
            </Form>

            {!isMobile && (
              <>
                <h2 className={`${styles.title} ${styles.mt}`}>
                  Medicamentos Adicionados
                </h2>
                <CustomDataTable
                  headers={headers}
                  rows={medicinesList}
                  showOptions
                  isLoading={uploadMedicinesLoading}
                  onRemoveAction={handleRemoveMedicine}
                  onEditAction={handleEditMedicine}
                />
                <div className={styles.options}>
                  <CustomButton
                    onClick={() => setShowModal(true)}
                    disabled={
                      medicinesList.length <= 0 || uploadMedicinesLoading
                    }
                    label="Registrar entrada"
                  />
                </div>
              </>
            )}
            <CustomModal
              show={showModal}
              icon="arrow_up"
              confirm
              confirmButton="Registrar entrada"
              description=" Tem certeza que deseja realizar a entrada desses medicamentos? Essa
      ação não poderá ser desfeita"
              title="Entrada de medicamentos"
              onHide={() => setShowModal(false)}
              handleConfirm={() => isMobile ? handleUploadAllMedicinesMobile() : handleUploadAllMedicines()}
            />
          </div>
        )}
      </div>
      {isMobile && !scan && !validateForm() && (
        <div className={styles.mobileOptions}>
          <CustomButton
            onClick={() => setShowModal(true)}
            disabled={uploadMedicinesLoading}
            largeButton
            label="Registrar entrada"
          />
        </div>
      )}
    </>
  );
}
