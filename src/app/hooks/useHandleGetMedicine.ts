"use client";
import axios from "axios";
import { BaseURL, environment } from "../constants/config";
import { useState } from "react";
import { useRouter } from "next/navigation";

type medicineProps = {
  code: string;
};

export const useHandleGetMedicine = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { push } = useRouter();

  const fetchData = async (data: medicineProps) => {
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

      const res = await axios.get(`${BaseURL}/medicine?code=${data.code}`, {
        headers,
      });

      if (res.data) {
        setIsLoading(false);
        return res.data.data;
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        push("/");
      }
      setError(error);
    }
    setIsLoading(false);
  };

  return { isLoading, error, fetchData };
};
