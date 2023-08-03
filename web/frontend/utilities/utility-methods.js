// import React, { useState, useMemo, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function replaceSpacesWithUnderscore(str) {
  return str.replace(/ /g, "_");
}

export function updateObject(obj_) {
  return { ...obj_ };
}
export const shortenText = (text) =>
  text && text.length > 20 ? text.substring(0, 30) + "..." : text;




  
  
// const UniqueKeysContext = React.createContext();

// const MAX_KEYS = 1000; // Maximum number of unique keys to generate
// const KEY_POOL_SIZE = 100; // Size of the key pool

// function useUniqueKeys() {
//   const context = useContext(UniqueKeysContext);

//   if (!context) {
//     throw new Error('useUniqueKeys must be used within a UniqueKeysProvider.');
//   }

//   const { keyPool, setKeyPool, usedKeys, setUsedKeys } = context;

//   const generateKey = useMemo(() => {
//     const generateUniqueKey = () => {
//       if (keyPool.length > 0) {
//         const key = keyPool.pop();
//         setUsedKeys((prevKeys) => new Set(prevKeys).add(key));
//         return key;
//       }

//       if (usedKeys.size < MAX_KEYS) {
//         let key = uuidv4();
//         while (usedKeys.has(key)) {
//           key = uuidv4();
//         }
//         setUsedKeys((prevKeys) => new Set(prevKeys).add(key));
//         return key;
//       }

//       // Handle maximum key limit reached
//       console.warn('Maximum key limit reached.');
//       return null;
//     };

//     return generateUniqueKey;
//   }, [keyPool, usedKeys, setUsedKeys]);

//   // Recycle keys back to the pool when components unmount
//   React.useEffect(() => {
//     return () => {
//       if (keyPool.length < KEY_POOL_SIZE) {
//         setKeyPool((prevPool) => [...prevPool, ...usedKeys]);
//       }
//     };
//   }, [usedKeys, keyPool, setKeyPool]);

//   return generateKey;
// }

// function UniqueKeysProvider({ children }) {
//   const [keyPool, setKeyPool] = useState([]);
//   const [usedKeys, setUsedKeys] = useState(new Set());

//   const value = {
//     keyPool,
//     setKeyPool,
//     usedKeys,
//     setUsedKeys,
//   };

//   return (
//     <UniqueKeysContext.Provider value={value}>
//       {children}
//     </UniqueKeysContext.Provider>
//   );
// }

// export { useUniqueKeys, UniqueKeysProvider };



