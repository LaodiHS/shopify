import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  createRef,
} from "react";

function createRefs() {
  const newRefDictionary = {};
  [
    "/",
    "/product-details",
    "/description",
    "/article",
    "/subscriptions",
    "/welcome",
    "/search",
  ].forEach((key) => {
    newRefDictionary[key] = createRef(null);
  });
  return newRefDictionary;
}

const NavigationRefs = createRefs();

export {NavigationRefs };
