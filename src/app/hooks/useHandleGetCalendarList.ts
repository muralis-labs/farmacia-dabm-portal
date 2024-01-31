"use client";
import { useEffect } from "react";
import axios from "axios";
import { BaseURL, environment } from "../constants/config";
import { useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";

type StockListProps = {
  page: number;
  limit: number;
  search?: string;
  expirationDateStart?: Date;
  expirationDateEnd?: Date;
  genericName?: string;
  commercialName?: string;
};

type HookProps = {
  formatLabel?: boolean;
};

export const useHandleGetCalendarList = <T>({
  formatLabel = false,
}: HookProps) => {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { push } = useRouter();

  const fetchData = async (filter: StockListProps) => {
    setIsLoading(true);
    try {
      const user = localStorage.getItem(`user_${environment}`)
        ? JSON.parse(localStorage.getItem(`user_${environment}`))
        : undefined;

      if (!user) {
        push("/");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      };

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
        `${BaseURL}/stock?limit=${limit}&offset=${offset}${queryParams}`,
        { headers }
      );

      if (formatLabel && res) {
        const list = res.data.data.map((stock) => ({
          ...stock,
          number: `${stock.number} (${stock.commercial_name} - ${stock.generic_name})`,
        }));
        setData({ data: list });
      } else {
        const list = res.data.data.filter((stock) => !stock.discarded && stock);
        setData(list.length > 0 ? {data: list} : []);
      }
      setIsLoading(false);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        push("/");
      }
      setError(error);
    }
    setIsLoading(false);
  };

  const refetchData = (data: StockListProps) => {
    fetchData(data);
  };

  useEffect(() => {
    fetchData({
      page: 1,
      limit: 999,
      expirationDateStart: moment().startOf("month").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      expirationDateEnd: moment().endOf("month").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    });
  }, []);

  return { data, isLoading, error, refetchData };
};
