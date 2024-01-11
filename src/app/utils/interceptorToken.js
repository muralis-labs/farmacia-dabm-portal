import { redirect } from 'next/navigation';
import { environment } from '../constants/config';

let failedQueue = [];

let isRefreshing = false;

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export default class InterceptorToken {
  static intercept(axios) {
    axios.interceptors.response.use(null, function(error) {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return axios(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }
        originalRequest._retry = true;
        isRefreshing = true;

        const user =
          localStorage.getItem(`user_${environment}`) != null
            ? JSON.parse(localStorage.getItem(`user_${environment}`))
            : null;

        if (!user) {
          localStorage.removeItem(`user_${environment}`);
          redirect('/')
        }
      }

      return Promise.reject(error);
    });
  }
}
