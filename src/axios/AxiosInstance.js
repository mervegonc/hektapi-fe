  import axios from "axios";

  const AxiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
  });

  // ✅ Request interceptor ekleyerek sadece signin ve signup harici isteklerde Authorization header ekleyelim
  AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    // Mutlak URL mi kontrol edelim
    const isAbsoluteURL = /^https?:\/\//.test(config.url);
    const endpoint = isAbsoluteURL ? new URL(config.url).pathname : config.url;

    // Eğer istek signin veya signup değilse, Authorization header ekleyelim
    if (token && !endpoint.includes("/auth/signin") && !endpoint.includes("/auth/signup") &&  !endpoint.includes("/email/send") ) {
      config.headers.Authorization = `Bearer ${token}`;
    }else {
      delete config.headers.Authorization;
    }

    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  export default AxiosInstance;
