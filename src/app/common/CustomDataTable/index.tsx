import React, { useMemo } from "react";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import Icon from "../icon/index";
import CustomCheckbox from "../CustomCheckbox/index";
import styles from "./index.module.scss";
import notFound from "@/app/assets/no_results_found.svg";
import Image from "next/image";
import colors from "@/app/sass/_variables.module.scss";

type Header = {
  title: string;
  field: string;
  key?: string;
  showIcon?: boolean;
};

type CustomDataTableProps = {
  headers: Header[];
  rows: any[];
  isLoading?: boolean;
  showOptions?: boolean;
  showProgress?: boolean;
  selection?: boolean;
  selectionList?: any[];
  onSelectAllRows?: (e: any) => void;
  onSelectRow?: (e: any) => void;
  onRemoveAction?: (e: any) => void;
  onEditAction?: (e: any) => void;
};

const CustomDataTable: React.FC<CustomDataTableProps> = ({
  headers,
  rows,
  isLoading = false,
  showOptions,
  showProgress,
  selection = false,
  selectionList = [],
  onSelectAllRows = () => {},
  onSelectRow = () => {},
  onRemoveAction,
  onEditAction,
}: CustomDataTableProps) => {
  const renderTableHeader = (item: Header) => (
    <th key={item.title}>{item.title}</th>
  );

  const formattedHeaders = useMemo(() => {
    return headers.map((item) => renderTableHeader(item));
  }, [headers]);

  const validateCellType = (cell: any) => {
    return String(cell).length > 4 && moment(cell, true).isValid();
  };

  const formatDate = (date: string) => moment(date).format("DD/MM/YYYY");

  const getItemIconContent = (header: Header, item: any) => {
    return (
      <div className={styles.iconContainer}>
        <Icon
          icon={
            item[header.field] === "entry"
              ? "arrow_up"
              : item[header.field] === "discard"
              ? "block"
              : "arrow_down"
          }
          size={20}
          color={
            item[header.field] === "entry"
              ? colors.feedbackColorSuccess
              : item[header.field] === "discard"
              ? colors.feedbackColorWarning
              : colors.feedbackColorDanger
          }
        />
        {item[header.field] === "entry"
          ? "Entrada"
          : item[header.field] === "discard"
          ? "Descarte"
          : "Saída"}
      </div>
    );
  };

  const getItemContent = (header: Header, item: any) => {
    return header.key ? item[header.key][header.field] : item[header.field];
  };

  const renderTableRow = (item: any, index: number) => (
    <tr className={`${styles.row} ${styles.info}`} key={item.id}>
      {selection && (
        <td className={styles.selection}>
          <CustomCheckbox
            key={`checkbox_${index}`}
            id={`${index}`}
            checked={selectionList.includes(item)}
            onChange={() => onSelectRow(item)}
          />
        </td>
      )}
      {headers.map((header, index) => (
        <td key={index}>
          {validateCellType(getItemContent(header, item))
            ? formatDate(getItemContent(header, item))
            : header.showIcon
            ? getItemIconContent(header, item)
            : getItemContent(header, item)}
        </td>
      ))}

      {showProgress && (
        <>
          {item.status === "done" ? (
            <td>
              <span className={styles.done}>Sucesso</span>
            </td>
          ) : item.status === "waiting" ? (
            <td>
              <span className={styles.waiting}>Aguardando</span>
            </td>
          ) : (
            <td>
              <span className={styles.pending}>Pendente</span>
            </td>
          )}
        </>
      )}

      {showOptions && (
        <td>
          <div className={styles.options}>
            {onRemoveAction && (
              <div
                className={styles.option}
                onClick={() => item.status !== 'done' && onRemoveAction(item)}
              >
                <Icon icon="trash" size={12} />
              </div>
            )}

            {onEditAction && (
              <div className={styles.option} onClick={() => item.status !== 'done' && onEditAction(item)}>
                <Icon icon="pencil" size={12} />
              </div>
            )}
          </div>
        </td>
      )}
    </tr>
  );

  const formattedRows = () => {
    return rows?.map((item, index) => renderTableRow(item, index));
  };

  return (
    <table key="table-key" className={styles.table}>
      <thead>
        <tr className={`${styles.headers} ${styles.row}`}>
          {selection && (
            <th>
              <CustomCheckbox
                key={`checkbox_header`}
                id={"header"}
                checked={selectionList.length === rows?.length}
                onChange={onSelectAllRows}
              />
            </th>
          )}
          {formattedHeaders}
          {showProgress && <th>Status</th>}
          {showOptions && <th>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {isLoading && (
          <tr>
            <td className={styles.emptyText} colSpan={headers.length}>
              <Spinner animation="border" role="status"></Spinner>
            </td>
          </tr>
        )}
        {!isLoading && rows && rows.length >= 1 && formattedRows()}
        {!isLoading && rows && rows.length < 1 && (
          <tr>
            <td className={styles.emptyText} colSpan={headers.length}>
              <div className={styles.notFoundContainer}>
                <Image src={notFound} alt="not found" />
                <span className={styles.notFoundText}>
                  Nenhum medicamento adicionado
                </span>
                <span className={styles.notFoundSubtitle}>
                  Insira as informações acima e adicione um medicamento
                </span>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CustomDataTable;
