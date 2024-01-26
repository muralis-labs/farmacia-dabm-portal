import axios from "axios";
import { BaseURL } from "../constants/config";
import { useState } from "react";

type convertListBody = {
  rows: any[];
  headers: {
    title: string;
    field: string;
  }[]
};

export const useHandleConvertList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (data: convertListBody) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BaseURL}/convert`, data);

      return res.data;
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, fetchData };
};