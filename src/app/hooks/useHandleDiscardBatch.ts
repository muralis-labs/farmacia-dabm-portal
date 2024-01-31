import axios from "axios";
import { BaseURL, environment } from "../constants/config";
import { useState } from "react";
import { redirect } from "next/navigation";

interface Stock {
  code: string;
  commercialName: string;
  genericName: string;
  expiration: Date;
  unitOfMeasurement: string;
  shelf: string;
  medicineId: string | null;
  batchId?: string | null;
  batch_id?: string | null;
  shelfId: string | null;
  dosage: number | undefined;
  pharmaceutical: string;
  batch: string;
  quantity: number | undefined;
  entry: Date;
}

export const useHandleDiscardBatch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (data: Stock[]) => {
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

      const patchRequests = data.map((batch) =>
      axios.delete(`${BaseURL}/batch`, {
        headers: headers,
        data: {
          id: batch.batch_id ?? batch.batchId,
        },
      })
      );

      await Promise.all(patchRequests);

      setIsLoading(false);
    } catch (error: any) {
      setError(error);
      setIsLoading(false);
    }
  };

  return { isLoading, error, fetchData };
};
