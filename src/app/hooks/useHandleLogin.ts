'use client'
import axios from "axios";
import { environment, BaseURL } from "../constants/config";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";

type loginProps = {
  login: string;
  password: string;
};

export const useHandleLogin = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { push } = useRouter();
  const fetchData = async (data: loginProps) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BaseURL}/login`, data);

      if (res.data) {
        localStorage.setItem(`user_${environment}`, JSON.stringify(res.data));
        push('/pages');
      }

    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  };

  return { data, isLoading, error, fetchData };
};
