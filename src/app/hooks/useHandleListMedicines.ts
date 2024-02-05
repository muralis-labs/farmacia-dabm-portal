"use client";
import { useEffect } from "react";
import axios from "axios";
import { BaseURL, environment } from "../constants/config";
import { useState } from "react";
import { useRouter } from "next/navigation";

type StockListProps = {
  genericName?: string;
  commercialName?: string;
};

export const useHandleListMedicines = <T>() => {
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

      const limit = 20;
      let queryParams = "";
      const keys = Object.keys(filter);

      for (const key of keys) {
        if (key === "genericName" && filter.genericName) {
          queryParams += `&genericName=${filter.genericName}`;
        }

        if (key === "commercialName" && filter.commercialName) {
          queryParams += `&commercialName=${filter.commercialName}`;
        }
      }

      const res = await axios.get(
        `${BaseURL}/medicines?limit=${limit}${queryParams}`,
        { headers }
      );

      if (res) {
        const list = res.data.map((medicine) => ({
          ...medicine,
          genericName: `${medicine.genericName} (${medicine.commercialName} ${medicine.dosage}${medicine.unitOfMeasurement})`,
          commercialName: `(${medicine.genericName}) ${medicine.commercialName} ${medicine.dosage}${medicine.unitOfMeasurement}`,
        }));
        setData({ data: list });
      } else {
        setData([]);
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
    fetchData({});
  }, []);

  return { data, isLoading, error, refetchData };
};
