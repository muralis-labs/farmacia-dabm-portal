"use client";
import { BaseURL, environment } from "../constants/config";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useHandleUploadMedicines = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { push } = useRouter();

  const fetchData = async (data: any) => {
    setIsLoading(true);
    try {
      const user = localStorage.getItem(`user_${environment}`)
        ? JSON.parse(localStorage.getItem(`user_${environment}`) as string)
        : undefined;

      if (!user) {
        push("/");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      };

      const updateList = [];
      const uploadList: any[] = [];
      data.map((item: any) => item.batchId ? updateList.push(item) : uploadList.push(item));

      const patchRequests = data.map((batch: any) =>
        axios.patch(
          `${BaseURL}/batch`,
          {
            id: batch.batchId,
            quantity: batch.quantity,
          },
          { headers }
        )
      );

      await Promise.all(patchRequests);
      const res = await axios.post(`${BaseURL}/stock`, uploadList, { headers });

      if (res.data) {
        setIsLoading(false);
        return res.data;
      }
      setIsLoading(false);
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  };

  return { isLoading, error, fetchData };
};
