import { useState, useEffect, useMemo, } from "react";
import { useAuthenticatedFetch, useAppBridge } from "@shopify/app-bridge-react";
import { useIonToast } from "@ionic/react";
import { useDataProvidersContext } from "../../components";


export async function fetchData ({ url, method = "GET", headers, body }, fetch) {
  if (!fetch) {
    throw new Error("authenticated fetch required");
  }
  const response = { data: null, error: null };
  try {
    const options = {
      method,
      headers: headers || {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    response.error = data?.error;
    response.data = data?.data;
    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {

    console.log("error", error);
    response.error = error || null;
  }
  return { data, error };
};

export function DataFetchingComponent({ url, method = "GET", body }, fetch) {
  // const fetch = useAuthenticatedFetch()
const {fetchData}= useDataProvidersContext();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        const fetchedData = await fetchData({url, method, body},fetch); // Call the memoized fetch function
        setData(fetchedData); // Set the fetched data
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchDataAndSetState();
  }, [fetchData, url, body]);
  return { data, loading, error };
}


const stableFetchComponent = {
  get: ({ url, headers, body }) =>
    DataFetchingComponent({ url, method: "GET", headers, body }),
  get_async: ({ url, body }, fetch) =>
    fetchData({ url, method: "GET", headers, body }, fetch),
  post: ({ url, headers, body }) =>
    DataFetchingComponent({ url, method: "POST", headers, body }),
  post_async: ({ url, body }, fetch) =>
    fetchData({ url, method: "POST", body }, fetch),
  put: ({ url, headers, body }) =>
    DataFetchingComponent({ url, method: "PUT", headers, body }),
  put_async: ({ url, body }, fetch) =>
    fetchData({ url, method: "PUT", body }, fetch),
  delete: ({ url, headers, body }) =>
    DataFetchingComponent({ url, method: "DELETE", headers, body }),
  delete_async: ({ url, headers, body }, fetch) =>
    fetchData({ url, method: "DELETE", headers, body }, fetch),
};
export { stableFetchComponent };
