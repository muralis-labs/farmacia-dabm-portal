"use client";
import axios from "axios";
import { BaseURL, environment } from "../constants/config";
import { useState } from "react";
import { useRouter } from "next/navigation";

type shelfProps = {
  name: string;
};

export const useHandleCreateShelf = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { push } = useRouter();

  const fetchData = async (data: shelfProps) => {
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

      const res = await axios.post(`${BaseURL}/shelf`, data, { headers });

      setIsLoading(false);
      return res.data.data;
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
