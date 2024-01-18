"use client";
import axios from "axios";
import { BaseURL } from "../constants/config";
import { useState } from "react";

type shelfProps = {
  name: string;
};

export const useHandleCreateShelf = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (data: shelfProps) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BaseURL}/shelf`, data);

      setIsLoading(false);
      return(res.data.data);
      
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  };

  return { isLoading, error, fetchData };
};
