"use client";
import axios from "axios";
import { BaseURL } from "../constants/config";
import { useState } from "react";

type medicineProps = {
  code: string;
};

export const useHandleGetMedicine = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fetchData = async (data: medicineProps) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BaseURL}/medicine?code=${data.code}`);

      if (res.data) {
        setIsLoading(false);
        return res.data.data;
      }
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  };

  return { isLoading, error, fetchData };
};
