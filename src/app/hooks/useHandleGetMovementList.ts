"use client";
import { useEffect } from "react";
import axios from "axios";
import { BaseURL, environment } from "../constants/config";
import { useState } from "react";
import moment from "moment";
import { redirect, useRouter } from "next/navigation";

type StockListProps = {
  page: number;
  limit: number;
  search?: string;
  movementType?: string;
  creationDateStart?: Date;
  creationDateEnd?: Date;
  expirationDateStart?: Date;
  expirationDateEnd?: Date;
  pharmaceutical?: string;
  genericName?: string;
  commercialName?: string;
};

export const useHandleGetMovementList = <T>(dashboard: boolean) => {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { push } = useRouter();

  const fetchData = async (filter: StockListProps) => {
    setIsLoading(true);
    try {
      const user = localStorage.getItem(`user_${environment}`)
        ? JSON.parse(localStorage.getItem(`user_${environment}`) as any)
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

        if (key === "movementType" && filter.movementType) {
          queryParams += `&movementType=${filter.movementType}`;
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
        `${BaseURL}/movement?limit=${limit}&offset=${offset}${queryParams}`,
        {headers}
      );

      setData(res.data ?? []);
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
    fetchData({ page: 1, limit: dashboard ? 6 : 10 });
  }, []);

  return { data, isLoading, error, refetchData };
};
