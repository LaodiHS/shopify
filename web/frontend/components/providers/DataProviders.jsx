import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  productViewCache,
  pageIngCache,
  History,
  formatProducts,
} from "../../utilities/store";
import { useIonToast } from "@ionic/react";
import { useAuthenticatedFetch } from "../../hooks";
import { navigate } from "ionicons/icons";

const DataProvidersContext = createContext(null);

export function useDataProvidersContext() {
  return useContext(DataProvidersContext);
}

export function DataProvidersProvider({ children }) {
    const fetch = useAuthenticatedFetch();
    const [presentToast] = useIonToast();


    
    const fetchData = useMemo(() => async({url, method, body}) => {
      
   

  
        return async () => {
        let retryCount = 3; // Maximum number of retries
        let success = false;
        let fetchedData = null;
  
        const options = {
          method,
          headers: {
            "Content-Type": "application/json",
          },
        };
  
        if (body) {
          try {
            options.body = JSON.stringify(body);
          } catch (error) {
            console.log("json stringify error", error);
          }
        }
        while (!success && retryCount > 0) {
          try {
            const response = await fetch(url, options);
  
            if (response.ok) {
              const data = await response.json();
              success = true;
  
              if (response.status === 404) {
                return []; // Return null for 404 responses
              }
  
              return data.data; // Return the fetched data
            } else {
              retryCount--;
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          } catch (error) {
            retryCount--;
  
            if (retryCount === 0) {
              presentToast({
                message: "There was a network error! Please try again later.",
                duration: 5000,
                position: "middle", // top, bottom, middle
                onDidDismiss: (e) => {
                  setDisableButtons(false);
                },
              });
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            // Rethrow the error to be caught in the component
          }
        }
      };
      
    }, []);






  const value = {
fetchData,

  };

  return (
    <DataProvidersContext.Provider value={value}>
      {children}
    </DataProvidersContext.Provider>
  );
}
