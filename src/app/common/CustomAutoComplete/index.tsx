import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Spinner } from "react-bootstrap";
import CustomInput from "../CustomInput/index";
import styles from "./index.module.scss";

type CustomAutoCompleteProps = {
  items: any[];
  onItemSelect?: (item: any) => void;
  handleNewItem?: (newItem: any) => void;
  field: string;
  label?: string;
  placeholder?: string;
  id: string;
  disabled?: boolean;
  value: string;
  allowCreation?: boolean;
  onSearchItem?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loadSearch?: boolean;
};

export default function CustomAutoComplete({
  items = [],
  onItemSelect = () => {},
  handleNewItem = () => {},
  field,
  label,
  placeholder,
  id,
  disabled = false,
  value,
  allowCreation = true,
  onSearchItem = () => {},
  loadSearch = false,
}: CustomAutoCompleteProps) {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showCreateButton, setShowCreateButton] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(value);
  const [key, setKey] = useState(Math.random());
  const containerRef = useRef<HTMLDivElement>(null);

  const handleItemClick = useCallback(
    (item: any) => {
      setSearch(item[field]);
      setShowOptions(false);
      setKey(Math.random());
      onItemSelect(item);
    },
    [field, onItemSelect]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setShowOptions(false);
    }
  }, []);

  const clickNew = useCallback(() => {
    handleNewItem({ name: search });
    setShowOptions(false);
    setKey(Math.random());
  }, [handleNewItem, search]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = event.target.value;
      onSearchItem(event);
      setSearch(searchTerm);

      const filteredItems = items.filter((item) =>
        item[field].toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      );

      setShowCreateButton(allowCreation && searchTerm.length >= 1);
    },
    [allowCreation, field, items, onSearchItem]
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);


  const memoizedItems = useMemo(() => {
    const renderItems = (item: any) => (
      <div
        key={item.id}
        className={styles.item}
        onClick={() => handleItemClick(item)}
      >
        {item[field]}
      </div>
    );

    if (!loadSearch) {
      return (
        <>
          {!items || items.length <= 0 ? (
            <span className={styles.noItems}>Nenhum item foi encontrado</span>
          ) : (
            items.map(renderItems)
          )}
          {showCreateButton && allowCreation && (
            <div
              className={`${styles.item} ${styles.newItem}`}
              onClick={clickNew}
            >
              Criar novo
            </div>
          )}
        </>
      );
    } else {
      return <Spinner animation="border" role="status" />;
    }
  }, [allowCreation, clickNew, field, handleItemClick, items, loadSearch, showCreateButton]);

  useEffect(() => {
    setSearch(value)
  }, [value])
  return (
    <div
      className={styles.autocompleteContainer}
      onClick={() => setShowOptions(true)}
      ref={containerRef}
    >
      <CustomInput
        disabled={disabled}
        value={search ?? value}
        onChange={(event) => handleSearch(event)}
        id={id}
        label={label}
        placeholder={placeholder}
        showIcon
        icon="arrow_down_bold"
        iconSize={12}
      />

      {showOptions && (
        <div key={key} className={styles.options}>
          {memoizedItems}
        </div>
      )}
    </div>
  );
}
