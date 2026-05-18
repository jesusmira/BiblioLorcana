import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado");
      }
      if (status === 403) {
        throw new Error("Acceso prohibido");
      }
      if (status === 404) {
        throw new Error("Recurso no encontrado");
      }
      if (status >= 500) {
        throw new Error("Error del servidor");
      }
      const data = error.response.data as { message?: string };
      throw new Error(data?.message || `Error ${status}`);
    }
    if (error.code === "ECONNABORTED") {
      throw new Error("Tiempo de espera agotado");
    }
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      throw new Error("No se pudo conectar al servidor");
    }
    throw new Error(error.message || "Error de conexión");
  },
);

interface FetchJsonOptions {
  config?: AxiosRequestConfig;
  errorMessage?: string;
}

export async function fetchJson<T>(
  url: string,
  { config, errorMessage }: FetchJsonOptions = {},
): Promise<T> {
  try {
    const response = await api.get<T>(url, config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(errorMessage || error.message);
    }
    throw new Error(errorMessage || "No se pudo completar la solicitud");
  }
}

export async function postJson<T, D>(
  url: string,
  data: D,
  { config, errorMessage }: FetchJsonOptions = {},
): Promise<T> {
  try {
    const response = await api.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(errorMessage || error.message);
    }
    throw new Error(errorMessage || "No se pudo completar la solicitud");
  }
}

export { api };
