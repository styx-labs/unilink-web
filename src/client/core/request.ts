import { OpenAPI } from "./OpenAPI";
import { CancelablePromise } from "./CancelablePromise";

export const request = <T>(
  openApi: typeof OpenAPI,
  config: any
): CancelablePromise<T> => {
  return new CancelablePromise<T>((resolve, reject, onCancel) => {
    const { method, url, path, body, mediaType, errors } = config;

    const fullUrl = `${openApi.BASE}${url}`;

    const headers = {
      "Content-Type": mediaType || "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const fetchPromise = fetch(fullUrl, options);

    onCancel(() => {
      // You can add cancellation logic here if needed
    });

    fetchPromise
      .then(async (response) => {
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          const error = new Error(`HTTP error! status: ${response.status}`);
          Object.assign(error, { status: response.status, body: errorBody });
          reject(error);
        } else {
          resolve(response.json());
        }
      })
      .catch(reject);
  });
};
