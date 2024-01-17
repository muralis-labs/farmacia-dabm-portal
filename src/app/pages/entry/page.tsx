"use client";
import { useEffect, useState } from "react";
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

export default function Entry() {
  const getShelvesService = useHandleShelves();
  const createShelfService = useHandleCreateShelf();
  const getMedicineService = useHandleGetMedicine();
  const uploadMedicinesService = useHandleUploadMedicines();

  const { fetchData: getShelvesFetchData, isLoading: getShelvesLoading } =
    getShelvesService;
  const { fetchData: createShelfData, isLoading: createShelfLoading } =
    createShelfService;
  const { fetchData: getMedicineData, isLoading: getMedicineLoading } =
    getMedicineService;
  const {
    fetchData: uploadMedicinesFetchData,
    isLoading: uploadMedicinesLoading,
  } = uploadMedicinesService;

  const [code, setCode] = useState("");
  const [commercialName, setCommercialName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [expiration, setExpiration] = useState<
    string | Date | undefined
  >();
  const [unitOfMeasurement, setUnitOfMeasurement] = useState("");
  const [shelf, setShelf] = useState("");
  const [medicineId, setMedicineId] = useState(null);
  const [shelfId, setShelfId] = useState(null);
  const [dosage, setDosage] = useState();
  const [pharmaceutical, setPharmaceutical] = useState("");
  const [batch, setBatch] = useState("");
  const [quantity, setQuantity] = useState();
  const [medicinesList, setMedicineList] = useState<any[]>([]);
  const [key, setKey] = useState(Math.random());

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
  const isDisabled = () => {
    if (!code || code === "" || code?.length <= 0) return true;
    if (!commercialName || commercialName === "" || commercialName?.length <= 0)
      return true;
    if (!genericName || genericName === "" || genericName?.length <= 0)
      return true;
    if (
      !unitOfMeasurement ||
      unitOfMeasurement === "" ||
      unitOfMeasurement?.length <= 0
    )
      return true;
    if (!shelf || shelf === "" || shelf?.length <= 0) return true;
    if (!pharmaceutical || pharmaceutical === "" || pharmaceutical?.length <= 0)
      return true;
    if (!batch || batch === "" || batch?.length <= 0) return true;
    if (!dosage || dosage === 0) return true;
    if (!quantity || quantity === 0) return true;

    return false;
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
    setDosage(undefined);
  }

  const clearFields = () => {
    setCode("");
    clearMedicineFields();
    setExpiration(undefined);
    setQuantity(undefined);
    setBatch("");
    setShelf("");
    setShelfId(null);
    setPharmaceutical("");
    setMedicineId(null);
  };

  const handleCreateNewShelf = async (data: string) => {
    await createShelfData(data as any);
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
    setCode(medicine.code);
    setGenericName(medicine.genericName);
    setCommercialName(medicine.commercialName);
    setPharmaceutical(medicine.pharmaceutical);
    setBatch(medicine.batch);
    setShelf(medicine.shelf);
    setUnitOfMeasurement(medicine.unitOfMeasurement);
    setExpiration(new Date(medicine.expiration));
    setQuantity(medicine.quantity);
  };

  const handleUploadAllMedicines = async () => {
    uploadMedicinesFetchData(medicinesList);
  };

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
      if (code) getData();
    }, 700);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <>
      <div className={`${styles.entry} ${isMobile ? styles.mobile : ""}`}>
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
              <Col xs={isMobile ? 12 : 6}>
                <CustomInput
                  value={code}
                  onChange={(event) => setCode(event?.target.value)}
                  id="code"
                  label="Código de barras"
                  placeholder="Código de barras do produto"
                  showIcon
                  icon="pencil"
                />
              </Col>
              <Col>
                <CustomInput
                  value={commercialName}
                  onChange={(event) => setCommercialName(event?.target.value)}
                  disabled={getMedicineLoading || medicineId !== null}
                  id="commercial-name"
                  label="Nome comercial"
                  placeholder="Nome comercial do produto"
                />
              </Col>
              <Col>
                <CustomInput
                  value={genericName}
                  onChange={(event) => setGenericName(event?.target.value)}
                  disabled={getMedicineLoading || medicineId !== null}
                  id="generic-name"
                  label="Nome genérico"
                  placeholder="Nome genérico do produto"
                />
              </Col>
            </Row>
            <Row className={`${isMobile ? styles.mobileRow : ""}`}>
              <Col>
                <CustomDatePicker
                  value={expiration as any}
                  onChange={(date) => setExpiration(date)}
                  id="expiration"
                  label="Data de validade"
                  placeholder="Data de validade"
                />
              </Col>
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
                <CustomAutoComplete
                  value={shelf ?? ""}
                  id="shelf"
                  label="Prateleira"
                  placeholder="Selecione a prateleira"
                  disabled={getShelvesLoading}
                  handleNewItem={(item) => handleCreateNewShelf(item)}
                  items={getShelvesService.data as any}
                  field="name"
                  onItemSelect={(item) => {
                    setShelf(item.name);
                    setShelfId(item.id);
                  }}
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
                  placeholder="Dosagem do produto"
                />
              </Col>
            </Row>
            <Row className={`${isMobile ? styles.mobileRow : ""}`}>
              <Col xs={isMobile ? 12 : 6}>
                <CustomInput
                  value={pharmaceutical}
                  onChange={(event) => setPharmaceutical(event.target.value)}
                  id="pharmaceutical"
                  label="Farmacêutico"
                  placeholder="Nome do farmacêutico"
                />
              </Col>
              <Col>
                <CustomInput
                  value={batch}
                  onChange={(event) => setBatch(event.target.value)}
                  id="batch"
                  label="Lote"
                  placeholder="Número do lote"
                />
              </Col>
              <Col>
                <CustomInput
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  id="quantity"
                  type="number"
                  label="Quantidade"
                  placeholder="Quantidade de produtos"
                />
              </Col>
            </Row>

            {!isMobile && (
              <Row xs={4} md={4} lg={4}>
                <Col xs={isMobile ? 12 : 6}>
                  <CustomButton
                    fullWidth
                    disabled={isDisabled() || getShelvesService.isLoading}
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
                onRemoveAction={handleRemoveMedicine}
                onEditAction={handleEditMedicine}
              />
              <div className={styles.options}>
                <CustomButton
                  onClick={handleUploadAllMedicines}
                  disabled={medicinesList.length <= 0 || uploadMedicinesLoading}
                  label="Registrar entrada"
                />
              </div>
            </>
          )}
        </div>
      </div>
      {isMobile && (
        <div className={styles.mobileOptions}>
          <CustomButton
            onClick={handleUploadAllMedicines}
            disabled={medicinesList.length <= 0 || uploadMedicinesLoading}
            largeButton
            label="Registrar entrada"
          />
        </div>
      )}
    </>
  );
}