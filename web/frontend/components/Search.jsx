import "@ionic/react/css/core.css";
// import "../styles/globals.css";
import { Autocomplete, Icon } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import { useState, useCallback, useMemo } from "react";
import { IonSearchbar, IonSelect, IonSelectOption, IonHeader, IonToolbar, IonTitle, IonList, IonItem  } from "@ionic/react";

import {useDataProvidersContext} from "../components";
const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  // Add more options as needed
];
export  function Search() {
  const {
 fetchDataWithCache
  } = useDataProvidersContext();
  const data = [
    'Amsterdam',
    'Buenos Aires',
    'Cairo',
    'Geneva',
    'Hong Kong',
    'Istanbul',
    'London',
    'Madrid',
    'New York',
    'Panama City',
  ];
  let [results, setResults] = useState([...data]);
  const [selectedOption, setSelectedOption] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleOptionSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };


  const handleInputChange = (event) => {
    let query = '';
    const target = event.target 


// fetchDataWithCache({url, method, body})


    if (target) query = target?.value.toLowerCase();

    console.log('query', query);
    setInputValue(query);
    setResults(data.filter((d) => d.toLowerCase().indexOf(query) > -1));
  };

  return (
    <>
    <IonHeader>
      <IonToolbar>
        <IonTitle>VibeFenWei Product Search</IonTitle>
        </IonToolbar>
        <IonToolbar>
      <IonSearchbar
        value={inputValue}
        onIonInput={handleInputChange} 
        debounce={100}
        placeholder="Search" 
        animated={true} 
      />
    </IonToolbar>
    </IonHeader>
    <IonList>
        {results.map((result, i) => (
          <IonItem key={i}>{result}</IonItem>
        ))}
      </IonList>
    </>
  );
}
