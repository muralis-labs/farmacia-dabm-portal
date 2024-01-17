import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import Icon from "../icon/index";
import { Spinner } from "react-bootstrap";
import CustomCheckbox from "../CustomCheckbox/index";

type header = {
  title: string;
  field: string;
  key?: string;
};
type CustomDataTable = {
  headers: header[];
  rows: any[];
  isLoading?: boolean;
  showOptions?: boolean;
  selection?: boolean;
  selectionList?: any[];
  onSelectAllRows?: (e: any) => void;
  onSelectRow?: (e: any) => void;
  onRemoveAction?: (e: any) => void;
  onEditAction?: (e: any) => void;
};

export default function CustomDataTable({
  headers,
  rows,
  isLoading = false,
  showOptions,
  selection = false,
  selectionList = [],
  onSelectAllRows = () => {},
  onSelectRow = () => {},
  onRemoveAction,
  onEditAction,
}: CustomDataTable) {
  const [tableKey, setTableKey] = useState(Math.random());
  const renderTableHeader = (item: any) => (
    <th key={item.title}>{item.title}</th>
  );

  const validateCellType = (cell: any) => {
    return moment(cell, true).isValid();
  };

  const getItemContent = (header: header, item: any) => {
    return header.key ? item[header.key][header.field] : item[header.field];
  };
  const renderTableRow = (item: any, index: number) => {
    return (
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
        {headers.map((header) => (
          <td key={header.field}>
            {console.log(header.field)}
            {validateCellType(getItemContent(header, item))
              ? moment(getItemContent(header, item)).format("DD/MM/YYYY")
              : getItemContent(header, item)}
          </td>
        ))}

        {showOptions && (
          <td>
            <div className={styles.options}>
              {onRemoveAction && (
                <div
                  className={styles.option}
                  onClick={() => onRemoveAction(item)}
                >
                  <Icon icon="trash" size={12} />
                </div>
              )}

              {onEditAction && (
                <div
                  className={styles.option}
                  onClick={() => onEditAction(item)}
                >
                  <Icon icon="pencil" size={12} />
                </div>
              )}
            </div>
          </td>
        )}
      </tr>
    );
  };

  useEffect(() => {
    setTableKey(Math.random());
  }, [rows]);

  return (
    <table key={tableKey} className={styles.table}>
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
          {headers.map((item) => renderTableHeader(item))}
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
        {!isLoading &&
          rows &&
          rows.length >= 1 &&
          rows.map((item, index) => renderTableRow(item, index))}{" "}
        {!isLoading && rows && rows.length < 1 && (
          <tr>
            <td className={styles.emptyText} colSpan={headers.length}>
              Sem itens disponíveis para exibição
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
