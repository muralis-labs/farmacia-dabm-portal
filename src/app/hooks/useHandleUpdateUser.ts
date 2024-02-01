"use client";
import { BaseURL, environment } from "../constants/config";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
        toast.success("Usuário atualizado com sucesso!", {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: false,
        });

        return res.data;
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        push("/");
      }
      toast.error(error.response.data[0]);
      setError(error);
    }
    setIsLoading(false);
  };

  return { data, isLoading, error, fetchData };
};
