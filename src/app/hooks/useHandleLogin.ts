"use client";
import axios from "axios";
import { environment, BaseURL } from "../constants/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type loginProps = {
  login: string;
  password: string;
};

export const useHandleLogin = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { push } = useRouter();
  const fetchData = async (data: loginProps) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BaseURL}/login`, data);

      if (res.data) {
        toast.success("Login realizado com sucesso", {
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: false,
        });
        localStorage.setItem(`user_${environment}`, JSON.stringify(res.data));
        push("/pages/dashboard");
      }
    } catch (error: any) {
       if (error?.response?.status === 401 || error?.code === "ERR_NETWORK") {
        localStorage.removeItem(`user_${environment}`);
        push("/");
      }

      toast.error(error.response.data[0]);
      setIsLoading(false);
      setError(error);
    }
    setIsLoading(false);
  };

  return { isLoading, error, fetchData };
};
