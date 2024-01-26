"use client";
import { useEffect } from "react";
import axios from "axios";
import { BaseURL } from "../constants/config";
import { useState } from "react";
import moment from "moment";

type StockListProps = {
  page: number;
  limit: number;
  search?: string;
  creationDateStart?: Date;
  creationDateEnd?: Date;
  expirationDateStart?: Date;
  expirationDateEnd?: Date;
  pharmaceutical?: string;
  genericName?: string;
  commercialName?: string;
};

type HookProps = {
  formatLabel?: boolean;
};

export const useHandleGetStockList = <T>({
  formatLabel = false,
}: HookProps) => {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (filter: StockListProps) => {
    setIsLoading(true);
    try {
      const page = filter.page ?? 1;
      const limit = filter.limit ?? 10;
      const offset = page * limit - limit;
      let queryParams = "";
      const keys = Object.keys(filter);

      for (const key of keys) {
        if (key === "search" && filter.search) {
          queryParams += `&search=${filter.search}`;
        }

        if (key === "genericName" && filter.genericName) {
          queryParams += `&genericName=${filter.genericName}`;
        }

        if (key === "commercialName" && filter.commercialName) {
          queryParams += `&commercialName=${filter.commercialName}`;
        }

        if (key === "pharmaceutical" && filter.pharmaceutical) {
          queryParams += `&pharmaceutical=${filter.pharmaceutical}`;
        }

        if (
          key === "creationDateStart" &&
          moment(filter.creationDateStart).isValid()
        ) {
          queryParams += `&creationDateStart=${filter.creationDateStart}`;
        }

        if (
          key === "creationDateEnd" &&
          moment(filter.creationDateEnd).isValid()
        ) {
          queryParams += `&creationDateEnd=${filter.creationDateEnd}`;
        }

        if (
          key === "expirationDateStart" &&
          moment(filter.expirationDateStart).isValid()
        ) {
          queryParams += `&expirationDateStart=${filter.expirationDateStart}`;
        }

        if (
          key === "expirationDateEnd" &&
          moment(filter.expirationDateEnd).isValid()
        ) {
          queryParams += `&expirationDateEnd=${filter.expirationDateEnd}`;
        }
      }

      const res = await axios.get(
        `${BaseURL}/stock?limit=${limit}&offset=${offset}${queryParams}`
      );


      if (formatLabel && res) {
        const list = res.data.data.map((stock) => ({
          ...stock,
          number: `${stock.number} (${stock.commercial_name} - ${stock.generic_name})`,
        }));  
        setData({ data: list });
      } else {
        setData(res.data ?? []);
      }
      setIsLoading(false);
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  };

  const refetchData = (data: StockListProps) => {
    fetchData(data);
  };

  useEffect(() => {
    fetchData({ page: 1, limit: 10 });
  }, []);

  return { data, isLoading, error, refetchData };
};
