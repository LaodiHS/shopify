import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  productViewCache,
  pageIngCache,
  History,
  formatProducts,
} from "../../utilities/store";
import { useAuthenticatedFetch } from "../../hooks";
import { navigate } from "ionicons/icons";

const NavigationDataContext = createContext(null);

export function useNavigationDataContext() {
  return useContext(NavigationDataContext);
}

export function NavigationDataProvider({ children }) {
  const [aiWorkStation, setAiWorkStation] = useState(null);

  function aiWorkStationSetter(category) {
    setAiWorkStation(category);
  }

  const value = {
    aiWorkStation,
    aiWorkStationSetter,
  };

  return (
    <NavigationDataContext.Provider value={value}>
      {children}
    </NavigationDataContext.Provider>
  );
}
