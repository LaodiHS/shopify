import React from "react";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import { L, Marker } from "../components";

function TextWithMarkers({ markedText }) {
  if (!markedText || typeof markedText !== "string") {
    // Handle the case where markedText is missing or not a string
    return null;
  }
  // console.log('markedText', markedText);
  // Regular expression to match IDs surrounded by brackets
 const text = markedText.replace(/\)\,/g, ")" );
  

  const idWithBracketsRegex =
  /\(([^)]+)\s*-\s*#([0-9A-Fa-f]{6})\)|\{([^}]+)\s*-\s*#([0-9A-Fa-f]{6})\}|\[([^\]]+)\s*-\s*#([0-9A-Fa-f]{6})\]|#([0-9A-Fa-f]{6})/g;

  const parseText = (text) => {
    const sentences = text.split(". ").map((sentence, index) => {
      // Removing trailing punctuation marks to avoid breaking links
      const cleanedSentence = sentence.replace(/[.,!?]$/, "");

      // Replace IDs with anchor tags in the sentence
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = idWithBracketsRegex.exec(cleanedSentence)) !== null) {
        const [
  ,
          roundLabel,
          roundId,
          curlyLabel,
          curlyId,
          squareLabel,
          squareId,
          id,
        ] = match;

        if (match.index > lastIndex) {
          // Add the text between the previous match and the current match
          parts.push(cleanedSentence.slice(lastIndex, match.index));
        }


        // Determine which label and ID to use
        let label = roundLabel || curlyLabel || squareLabel || "";
        const idValue = roundId || curlyId || squareId || id;
        label = label.replace(/#/g, '')
        
        // Add the anchor tag with the matched ID and label
      
        parts.push(<Marker key={idValue} c={"#" + idValue} r={label} />);

        lastIndex = idWithBracketsRegex.lastIndex;
      }

      // Add any remaining text after the last match
      if (lastIndex < cleanedSentence.length) {
        parts.push(cleanedSentence.slice(lastIndex));
      }

      return parts;
    });

    return sentences.map((sentence, index) => (
      <IonCol key={index} size="12">
        {sentence}
      </IonCol>
    ));
  };

  return (
    <IonGrid>
      <IonRow>{parseText(text)}</IonRow>
    </IonGrid>
  );
}

const cleanText = (text) => {

   
  // Regular expression to match IDs surrounded by brackets
   text = text.replace(/\)\,/g, ")");
console.log('text', text);
  const idWithBracketsRegex = /\(([^)]+)\s*-\s*#([0-9A-Fa-f]{6})\)|\{([^}]+)\s*-\s*#([0-9A-Fa-f]{6})\}|\[([^\]]+)\s*-\s*#([0-9A-Fa-f]{6})\]|#([0-9A-Fa-f]{6})/g;
  const parseText = (text) => {
    const sentences = text.split('. ').map((sentence, index) => {
      // Removing trailing punctuation marks to avoid breaking links
      const cleanedSentence = sentence.replace(/[.,!?]$/, '');
      // Replace IDs with anchor tags in the sentence
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = idWithBracketsRegex.exec(cleanedSentence)) !== null) {
        const [, roundLabel, roundId, curlyLabel, curlyId, squareLabel, squareId, id] = match;
        if (match.index > lastIndex) {
          // Add the text between the previous match and the current match
          parts.push(cleanedSentence.slice(lastIndex, match.index));
        }
        lastIndex = idWithBracketsRegex.lastIndex;
      }
      if (lastIndex < cleanedSentence.length) {
        parts.push(cleanedSentence.slice(lastIndex));
      }
      return parts;
    });
    return sentences
  };
  const par = parseText(text).flat(Infinity).join(' ');

  console.log('par---->',par)
   return    par
};

export { TextWithMarkers, cleanText };




function removeNestedBrackets(text) {
  let result = '';
  let openBracketCount = 0;
  let startIndex = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '(' || text[i] === '{' || text[i] === '[') {
      if (openBracketCount === 0) {
        result += text.slice(startIndex, i);
      }
      openBracketCount++;
    } else if (text[i] === ')' || text[i] === '}' || text[i] === ']') {
      openBracketCount--;
      if (openBracketCount === 0) {
        const nestedContent = text.slice(startIndex + 1, i);
        const processedContent = removeNestedBrackets(nestedContent);
        result += processedContent;
      }
    } else if (openBracketCount === 0) {
      result += text[i];
    }
  }

  return result;
}
