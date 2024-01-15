import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import Icon from "../icon/index";
type CustomDataTable = {
  headers: {
    title: string;
    field: string;
  }[];
  rows: any[];
  showOptions?: boolean;
  onRemoveAction?: (e: any) => void;
  onEditAction?: (e: any) => void;
};

export default function CustomDataTable({
  headers,
  rows,
  showOptions,
  onRemoveAction,
  onEditAction,
}: CustomDataTable) {
  const [tableKey, setTableKey] = useState(Math.random());
  const renderTableHeader = (item: any) => (
    <th key={item.title}>{item.title}</th>
  );

  const renderTableRow = (item: any) => {
    return (
      <tr className={`${styles.row} ${styles.info}`} key={item.id}>
        {headers.map((header) => (
          <td key={header.field}>


            {moment(item[header.field], "MM/DD/YYYY", true).isValid()
              ? moment(item[header.field]).format("DD/MM/YYYY")
              : item[header.field]}
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
          {headers.map((item) => renderTableHeader(item))}
          {showOptions && <th>Ações</th>}
        </tr>
      </thead>
      <tbody>{rows.map((item) => renderTableRow(item))}</tbody>
    </table>
  );
}
