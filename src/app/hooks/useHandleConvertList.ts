import axios from "axios";
import { BaseURL, environment } from "../constants/config";
import { useState } from "react";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

type convertListBody = {
  rows: any[];
  headers: {
    title: string;
    field: string;
  }[];
};

export const useHandleConvertList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (data: convertListBody) => {
    setIsLoading(true);
    try {
      const user = localStorage.getItem(`user_${environment}`)
        ? JSON.parse(localStorage.getItem(`user_${environment}`))
        : undefined;

      if (!user) {
        redirect("/");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      };

      const res = await axios.post(`${BaseURL}/convert`, data, { headers });

      toast.success("Lista convertida com sucesso", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: false,
      });
      return res.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        redirect("/");
      }
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, fetchData };
};
