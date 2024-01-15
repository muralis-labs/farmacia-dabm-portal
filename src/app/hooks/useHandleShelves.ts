"use client";
import axios from "axios";
import { environment, BaseURL } from "../constants/config";
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";

export const useHandleShelves = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BaseURL}/shelves`);

      if (res.data) {
        setData(res.data.data)
      }
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [])

  return { data, isLoading, error, fetchData };
};
