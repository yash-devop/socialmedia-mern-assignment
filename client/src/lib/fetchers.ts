type FetchMethods = "get" | "post" | "put" | "patch" | "delete";

interface IFetcher<T> {
  url: string;
  method: Uppercase<FetchMethods>;
  body?: T;
  headers?: Record<string, any>;
  credentials?: RequestCredentials 
}
export async function fetcher<T extends BodyInit | string>({
  url,
  method,
  body,
  headers,
  credentials
}: IFetcher<T>) {
  const response = await fetch(url, {
    method,
    body,
    headers,
    credentials
  });

  if (!response.ok) {
    const message = (await response.json())?.error?.message || "An error occured while fetching data.";
    throw new Error(message);
  }

  return response.json();
}
