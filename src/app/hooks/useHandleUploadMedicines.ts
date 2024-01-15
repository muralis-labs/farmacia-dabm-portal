"use client";
import axios from "axios";
import { BaseURL } from "../constants/config";
import { useState } from "react";

export const useHandleUploadMedicines = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (data: any[]) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BaseURL}/stock`, data);

      if (res.data) {
        setData(res.data.data);
      }
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  };

  return { data, isLoading, error, fetchData };
};
