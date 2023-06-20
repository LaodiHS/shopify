import React, { useState } from "react";
import { IonItem, IonList, IonSearchbar } from "@ionic/react";

export function DataBaseSearchComponent({ apiUrl }) {
  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setData(response.data);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleInput = (Event) => {
    let query = "";
    const target = Event.target;
    if (target && target.value) query = target.value.toLowerCase();

    setResults(data.filter((item) => item.toLowerCase().indexOf(query) !== -1));
  };

    
    
    
  return (
    <>
      <IonSearchbar debounce={300} onIonInput={handleInput}></IonSearchbar>
      <IonList>
        {results.map((result, index) => (
            <IonItem key={index}>{result} onClick={() => handelItemClick(result)}</IonItem>
        ))}
      </IonList>
    </>
  );
}





//<DataBaseSearchComponent apiUrl="endpoint"/>