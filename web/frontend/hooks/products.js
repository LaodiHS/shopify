import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useMemo } from "react";
import { useQuery } from "react-query";
 
export async function products(setData,first = "", before = "", after = "") {
 const fetch = useAuthenticatedFetch();

  const options = useMemo(
    () => ({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first,
        before,
        after,
      }),
    }),
    [first, before, after]
  );

  try {
    const response = await fetch("/api/products/paging", options);
    const data = await response.json();

    if (response.ok) {
      setData(data.data)
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.log("Error-->", error);
    // throw error;
  }
}

