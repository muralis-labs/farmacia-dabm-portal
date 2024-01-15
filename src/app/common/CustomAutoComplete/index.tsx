"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import CustomInput from "../CustomInput/index";
import styles from "./index.module.scss";

type CustomAutoCompleteProps = {
  items: any[];
  onItemSelect?: (e: any) => void;
  handleNewItem?: (e: any) => void;
  field: string;
  label?: string;
  placeholder?: string;
  id: string;
  disabled?: boolean;
  value: string;
};

export default function CustomAutoComplete({
  items = [{}],
  onItemSelect = () => {},
  handleNewItem = () => {},
  field,
  label,
  placeholder,
  id,
  disabled = false,
  value
}: CustomAutoCompleteProps) {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showCreateButton, setShowCreateButton] = useState<boolean>(false);
  const [filterItems, setFilterItems] = useState<any[]>(items);
  const [search, setSearch] = useState<string>(value);
  const [key, setKey] = useState(Math.random());
  const containerRef = useRef<any>(null);

  const handleItemClick = (item: any) => {
    setSearch(item[field]);
    setShowOptions(false);
    setKey(Math.random());
    onItemSelect(item);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  const clickNew = () => {
    handleNewItem({ name: search })
    setShowOptions(false);
    setKey(Math.random());
  }

  const renderItems = (item: any) => {
    return (
      <div
        key={item.id}
        className={styles.item}
        onClick={() => handleItemClick(item)}
      >
        {item[field]}
      </div>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      const filter = items?.filter((item) =>
        item[field]?.toLocaleLowerCase().includes(search?.toLocaleLowerCase())
      );
      setFilterItems(filter as any);
      setShowCreateButton(search.length >= 1);
    }, 300);
  }, [search, items, field]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    setSearch(value)
  }, [value]);

  return (
    <div
      className={styles.autocompleteContainer}
      onClick={() => setShowOptions(true)}
      ref={containerRef}
    >
      <CustomInput
        disabled={disabled}
        value={search ?? undefined}
        onChange={(event) => setSearch(event.target.value)}
        id={id}
        label={label}
        placeholder={placeholder}
        showIcon
        icon="arrow_down_bold"
        iconSize={12}
      />

      {showOptions && (
        <div key={key} className={styles.options}>
          {!filterItems || filterItems.length <= 0 ? (
            <span className={styles.noItems}>Nenhum item foi encontrado</span>
          ) : (
            filterItems.map((item) => renderItems(item))
          )}
          {showCreateButton && (
            <div
              className={`${styles.item} ${styles.newItem}`}
              onClick={clickNew}
            >
              Criar novo
            </div>
          )}
        </div>
      )}
    </div>
  );
}
