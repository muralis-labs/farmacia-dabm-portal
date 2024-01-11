import axios from "axios";

import { environment } from "../constants/config";
import InterceptorToken from "../utils/interceptorToken";

InterceptorToken.intercept(axios);
class api {
  static post = async (url, payload, headers) => {
    const defaultHeader = {};
    const user =
      localStorage.getItem(`user_${environment}`) != null
        ? JSON.parse(localStorage.getItem(`user_${environment}`))
        : null;

    if (user) {
      defaultHeader.Authorization = `Bearer ${user.token}`;
    }

    return axios.post(url, payload, {
      headers: { ...defaultHeader, ...headers },
    });
  };

  static get = async (url, headers) => {
    const defaultHeader = {};
    const user =
      localStorage.getItem(`user_${environment}`) != null
        ? JSON.parse(localStorage.getItem(`user_${environment}`))
        : null;

    if (user) {
      defaultHeader.Authorization = `Bearer ${user.token}`;
    }

    return axios.get(url, { headers: { ...defaultHeader, ...headers } });
  };
  static put = async (url, payload, headers) => {
    const defaultHeader = {};
    const user =
      localStorage.getItem(`user_${environment}`) != null
        ? JSON.parse(localStorage.getItem(`user_${environment}`))
        : null;

    if (user) {
      defaultHeader.Authorization = `Bearer ${user.token}`;
    }

    return axios.put(url, payload, {
      headers: { ...defaultHeader, ...headers },
    });
  };
  static patch = async (url, payload, headers) => {
    const defaultHeader = {};
    const user =
      localStorage.getItem(`user_${environment}`) != null
        ? JSON.parse(localStorage.getItem(`user_${environment}`))
        : null;

    if (user) {
      defaultHeader.Authorization = `Bearer ${user.token}`;
    }

    return axios.patch(url, payload, {
      headers: { ...defaultHeader, ...headers },
    });
  };
  static delete = async (url, headers) => {
    const defaultHeader = {};
    const user =
      localStorage.getItem(`user_${environment}`) != null
        ? JSON.parse(localStorage.getItem(`user_${environment}`))
        : null;

    if (user) {
      defaultHeader.Authorization = `Bearer ${user.token}`;
    }

    return axios.delete(url, { headers: { ...defaultHeader, ...headers } });
  };
}

export default api;
