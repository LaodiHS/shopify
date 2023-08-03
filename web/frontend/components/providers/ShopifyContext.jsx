// ShopifyContext.js
import React, { createContext, useContext } from "react";

const ShopifyContext = createContext(null);

export function useShopifyContext() {
  return useContext(ShopifyContext);
}

export function ShopifyProvider({ children, session }) {
  return (
    <ShopifyContext.Provider value={session}>
      {children}
    </ShopifyContext.Provider>
  );
}