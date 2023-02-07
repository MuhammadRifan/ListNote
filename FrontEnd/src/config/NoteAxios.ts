import axios from "axios";

const axiosIns = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 20000,
  timeoutErrorMessage: "Connection timed out",
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAccessToken = (accessToken = "") => {
  let str = undefined;
  if (accessToken.length > 0) str = "Bearer " + accessToken;
  axiosIns.defaults.headers.common.Authorization = str;
};

export default axiosIns;
