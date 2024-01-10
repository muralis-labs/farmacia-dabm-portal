import axios from "axios";
import { AxiosRequestConfig } from "axios";
import { useState, useEffect } from "react";

type loginProps = {
  login: string;
  password: string;
};

export const useHandleLogin = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (data: loginProps) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/login", data);
      console.log(response);
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  };


  return { data, isLoading, error, fetchData };
};
