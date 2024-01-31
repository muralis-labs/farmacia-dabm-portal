"use client";
import { BaseURL, environment } from "../constants/config";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type fetchDataProps = {
  id: string | null;
  name: string;
  login: string;
  password?: string | null | undefined;
};

export const useHandleUpdateUser = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { push } = useRouter();

  const fetchData = async (data: fetchDataProps) => {
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

      const res = await axios.patch(`${BaseURL}/user`, data, { headers });

      if (res.data) {
        return res.data;
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        push("/");
      }
      setError(error);
    }
    setIsLoading(false);
  };

  return { data, isLoading, error, fetchData };
};
