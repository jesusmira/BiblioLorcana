interface FetchJsonOptions {
  init?: RequestInit;
  errorMessage?: string;
}

export async function fetchJson<T>(
  url: string,
  { init, errorMessage }: FetchJsonOptions = {}
): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(errorMessage || "No se pudo completar la solicitud");
  }
  return response.json() as Promise<T>;
}
