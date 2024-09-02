import axios from "axios";
import { getToken } from "firebase/app-check";
import { appCheck } from "../firebase/firebase";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const appCheckToken = await getToken(appCheck, /* forceRefresh */ false);
      config.headers["X-Firebase-AppCheck"] = appCheckToken.token;
    } catch (error) {
      console.error("Error getting App Check token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
