"use client";
import axios from "axios";
import { environment, BaseURL } from "../constants/config";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useHandleShelves = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { push } = useRouter();

  const fetchData = async () => {
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

      const res = await axios.get(`${BaseURL}/shelves`, { headers });

      if (res.data) {
        setData(res.data);
      }
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.code === "ERR_NETWORK") {
        push("/");
      }
      setError(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, fetchData };
};
