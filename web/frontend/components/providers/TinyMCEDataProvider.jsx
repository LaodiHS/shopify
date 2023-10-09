import tinymce from "tinymce/tinymce";
tinymce._setBaseUrl("/tinymce");
import { Editor } from "@tinymce/tinymce-react";
import React, { createContext, useState, useEffect, useContext } from "react";



const TinyMCEDataContext = createContext(null);
export function useTinyMCEDataContext() {
    return useContext(TinyMCEDataContext );
  }

export function TinyMCEDataProvider({ children }) {

  
    useEffect(() => {
      // metaTagPMatchTextPercentage(
      //   "hello sir, i like shoes and. Thank you for reading.",
      //   ["shoes", "cars", "butts"]
      // );
  
  
  
  
    }, []);
  
    //   function TooWordy(){
  
    //     const data = complexity(extractTextFromHtml(text));
    //     // console.log(data);
    //     return data;
  
    //   }
  
    //  const importance = doc
    //     .out(its.sentenceWiseImportance)
    //     .map((e) => e.importance);
  
    const value = {
     Editor
  
    };
  
    return (
      <TinyMCEDataContext.Provider value={value}>
        {children}
      </TinyMCEDataContext.Provider>
    );
  }
  