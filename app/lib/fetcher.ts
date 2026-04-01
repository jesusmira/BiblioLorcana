import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface FetchJsonOptions {
  config?: AxiosRequestConfig;
  errorMessage?: string;
}

export async function fetchJson<T>(
  url: string,
  { config, errorMessage }: FetchJsonOptions = {}
): Promise<T> {
  try {
    const response = await axios.get<T>(url, config);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(errorMessage || error.message);
    }
    throw new Error(errorMessage || "No se pudo completar la solicitud");
  }
}

export async function postJson<T, D>(
  url: string,
  data: D,
  { config, errorMessage }: FetchJsonOptions = {}
): Promise<T> {
  try {
    const response = await axios.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(errorMessage || error.message);
    }
    throw new Error(errorMessage || "No se pudo completar la solicitud");
  }
}
