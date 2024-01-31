"use client";
import { BaseURL, environment } from "../constants/config";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useHandleUploadMedicines = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { push } = useRouter();

  const fetchData = async (data: any[]) => {
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
      const res = await axios.post(`${BaseURL}/stock`, data, {headers});

      if (res.data) {
        setData(res.data.data);
      }
    } catch (error: any) {
      console.log(error);
      setError(error);
    }
    setIsLoading(false);
  };

  return { data, isLoading, error, fetchData };
};
