import React from "react";
import Icon from "../icon/index";
import colors from "@/app/sass/_variables.module.scss";
import styles from "./index.module.scss";
import { Dropdown } from "react-bootstrap";

type PaginationProps = {
  selectedPage: number;
  total: number;
  limit: number;
  maxVisiblePages?: number;
  onSelectPage?: (e: any) => void;
  onChangeLimit?: (e: any) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  selectedPage,
  total,
  limit,
  maxVisiblePages = 5,
  onSelectPage = () => {},
  onChangeLimit = () => {},
}) => {
  const pageCount = Math.ceil(total / limit);
  const limitValues = [10, 20, 40, 80, 100];

  const generatePageNumbers = () => {
    const pages: (number | string | null)[] = [];

    if (pageCount <= maxVisiblePages) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      const middle = Math.floor(maxVisiblePages / 2);

      pages.push(1);

      if (selectedPage > middle + 1) {
        pages.push(null);
      }

      const start = Math.max(selectedPage - middle, 2);
      const end = Math.min(selectedPage + middle, pageCount - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (selectedPage < pageCount - middle) {
        pages.push(null);
      }

      pages.push(pageCount);
    }

    return pages;
  };

  const handleNavigate = (navigate?: string) => {
    let nav = selectedPage;

    switch (navigate) {
      case "all_back":
        nav = 1;
        break;
      case "all_next":
        nav = pageCount;
        break;
      case "back":
        nav--;
        break;
      default:
        nav++;
        break;
    }

    onSelectPage(nav);
  };

  const pages = generatePageNumbers();
  const allowNavBack = selectedPage > 1;
  const allowNavNext = selectedPage < pageCount;

  return (
    <div className={styles.pagination}>
      <div
        className={styles.nav}
        onClick={() => allowNavBack && handleNavigate("all_back")}
      >
        <Icon
          icon="double_arrow_left"
          size={9}
          color={
            allowNavBack
              ? colors.brandColorPrimaryMedium
              : colors.neutralColorGrayStrongest
          }
        />
      </div>
      <div
        className={styles.nav}
        onClick={() => allowNavBack && handleNavigate("back")}
      >
        <Icon
          icon="arrow_left_simple"
          size={9}
          color={
            allowNavBack
              ? colors.brandColorPrimaryMedium
              : colors.neutralColorGrayStrongest
          }
        />
      </div>
      {pages.map((page, index) => (
        <span
          onClick={() => onSelectPage(page)}
          key={index}
          className={`${styles.page} ${
            page === selectedPage ? styles.selected : ""
          }`}
        >
          {page !== null ? page === "..." ? page : <>{page}</> : "..."}
        </span>
      ))}

      <div
        className={styles.nav}
        onClick={() => allowNavNext && handleNavigate()}
      >
        <Icon
          icon="arrow_right_simple"
          size={9}
          color={
            allowNavNext
              ? colors.brandColorPrimaryMedium
              : colors.neutralColorGrayStrongest
          }
        />
      </div>
      <div
        className={styles.nav}
        onClick={() => allowNavNext && handleNavigate("all_next")}
      >
        <Icon
          icon="double_arrow_right"
          size={9}
          color={
            allowNavNext
              ? colors.brandColorPrimaryMedium
              : colors.neutralColorGrayStrongest
          }
        />
      </div>

      <Dropdown className={styles.paginationDropdown}>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {limit}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {limitValues.map((value, index) => (
            <Dropdown.Item key={index} onClick={() => onChangeLimit(value)}>
              {value}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default Pagination;
