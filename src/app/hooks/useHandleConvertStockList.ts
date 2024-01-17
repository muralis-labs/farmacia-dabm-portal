import axios from "axios";
import { BaseURL } from "../constants/config";
import { useState } from "react";

type stockListProps = {
  list: any[];
};

export const useHandleConvertStockList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Blob | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (data: stockListProps) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BaseURL}/excel`, data, {
        responseType: 'blob', // specify the responseType as 'blob'
      });

      return res.data; // res.data contains the Blob data
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchData };
};