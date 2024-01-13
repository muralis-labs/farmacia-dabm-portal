"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import CustomInput from "../CustomInput/index";
import styles from "./index.module.scss";

type CustomAutoCompleteProps = {
  items: any[];
  onItemSelect?: (e: any) => void;
  handleNewItem?: (e: any) => void;
  value?: any;
  label?: string;
  placeholder?: string;
  id: string;
};

export default function CustomAutoComplete({
  items = [{}],
  onItemSelect = () => {},
  handleNewItem = () => {},
  value,
  label,
  placeholder,
  id,
}: CustomAutoCompleteProps) {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showCreateButton, setShowCreateButton] = useState<boolean>(false);
  const [filterItems, setFilterItems] = useState<any[]>(items);
  const [search, setSearch] = useState<string>("");
  const containerRef = useRef<any>(null);

  const handleItemClick = (item: any) => {
    onItemSelect(item);
    setShowOptions(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  const renderItems = (item: any) => {
    return (
      <div
        key={item.id}
        className={styles.item}
        onClick={() => handleItemClick(item)}
      >
        {item.name}
      </div>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      const filter = items.filter((item) =>
        item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
      setFilterItems(filter as any);
      setShowCreateButton(search.length >= 1);
    }, 300);
  }, [search, items]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={styles.autocompleteContainer}
      onClick={() => setShowOptions(true)}
      ref={containerRef}
    >
      <CustomInput
        value={value?.name ?? undefined}
        onChange={(event) => setSearch(event.target.value)}
        id={id}
        label={label}
        placeholder={placeholder}
        showIcon
        icon="arrow_down_bold"
        iconSize={12}
      />

      {showOptions && (
        <div className={styles.options}>
          {filterItems.length <= 0 ? (
            <span className={styles.noItems}>Nenhum item foi encontrado</span>
          ) : (
            filterItems.map((item) => renderItems(item))
          )}
          {showCreateButton && (
            <div
              className={`${styles.item} ${styles.newItem}`}
              onClick={() => handleNewItem({ name: search })}
            >
              Criar novo
            </div>
          )}
        </div>
      )}
    </div>
  );
}
