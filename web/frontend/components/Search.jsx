import "@ionic/react/css/core.css";
// import "../styles/globals.css";
import { Autocomplete, Icon } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import { useState, useCallback, useMemo } from "react";
import { IonSearchbar, IonSelect, IonSelectOption } from "@ionic/react";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  // Add more options as needed
];
export  function Search() {
  const [selectedOption, setSelectedOption] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleOptionSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
  };

  return (
    <>
      <IonSearchbar
        value={inputValue}
        onIonChange={handleInputChange}
        placeholder="Search"
      />

      <IonSelect value={selectedOption} onIonChange={handleOptionSelect}>
        {options.map((option) => (
          <IonSelectOption key={option.value} value={option.value}>
            {option.label}
          </IonSelectOption>
        ))}
      </IonSelect>
    </>
  );
}
