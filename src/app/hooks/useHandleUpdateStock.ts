import axios from "axios";
import { BaseURL } from "../constants/config";
import { useState } from "react";

interface Stock {
  code: string;
  commercialName: string;
  genericName: string;
  expiration: Date;
  unitOfMeasurement: string;
  shelf: string;
  medicineId: string | null;
  batchId: string | null;
  shelfId: string | null;
  dosage: number | undefined;
  pharmaceutical: string;
  batch: string;
  quantity: number | undefined;
  entry: Date;
};


export const useHandleUpdateStock = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (data: Stock[]) => {
    setIsLoading(true);

    try {
      const patchRequests = data.map((batch) =>
        axios.patch(`${BaseURL}/batch`, {
          id: batch.batchId,
          quantity: batch.quantity,
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
