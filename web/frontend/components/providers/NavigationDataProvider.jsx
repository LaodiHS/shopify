import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react_router_dom";
import {
  productViewCache,
  pageIngCache,
  History,
  formatProducts,
} from "../../utilities/store";

import { navigate } from "ionicons/icons";

const NavigationDataContext = createContext(null);

export function useNavigationDataContext() {
  return useContext(NavigationDataContext);
}

function modifyState(setter, updateOptions) {
  return setter((prevState) => {
    if (typeof updateOptions === "function") {
      return updateOptions(prevState);
    } else {
      return updateOptions;
    }
  });
}
export function NavigationDataProvider({ children }) {
  const [aiWorkStation, setAiWorkStation] = useState(null);

  function aiWorkStationSetter(category) {
    modifyState(setAiWorkStation,category);
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
