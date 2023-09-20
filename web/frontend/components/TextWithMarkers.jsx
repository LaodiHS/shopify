import React, { useEffect, useState, useRef } from "react";
import { IonGrid, IonRow, IonCol, IonText } from "@ionic/react";
import { L, Marker, useDataProvidersContext } from "../components";

function TextWithMarkers({ markedText }) {
  if (!markedText || typeof markedText !== "string") {
    // Handle the case where markedText is missing or not a string
    return null;
  }

  const {
    checkFeatureAccess,
    markupText,
    serverSentEventLoading,
    setMarkupText,
    eventEmitter,
    DataProviderNavigate,
  } = useDataProvidersContext();

  // console.log('markedText', markedText);
  // Regular expression to match IDs surrounded by brackets
  const text = markedText.replace(/\)\,/g, ")");

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
        const labelRaw = roundLabel || curlyLabel || squareLabel || "";
        const idValue = roundId || curlyId || squareId || id;
        const label = labelRaw.replace(/#/g, "").trim();

        // Add the anchor tag with the matched ID and label

        parts.push(
          <Marker
            key={"#" + idValue}
            requirementText={label}
            color={"#" + idValue}
          />
        );

        lastIndex = idWithBracketsRegex.lastIndex;
      }

      // Add any remaining text after the last match
      if (lastIndex < cleanedSentence.length) {
        parts.push(cleanedSentence.slice(lastIndex));
      }

      return parts;
    });
    useEffect(() => {
      if (!serverSentEventLoading) {
        let highlight = [];
        const colorCodes = sentences
          .flat(Infinity)
          .reduce((acc, value, index) => {
            if (typeof value === "string") {
              highlight.push("color-" + index);
            } else if (typeof value === "object" && value.key) {
              acc[value.key] = highlight.slice();
              highlight = [];
            }
            return acc;
          }, {});

        Object.entries(colorCodes).forEach(([key, elements]) => {
          elements.forEach((elementId) => {
             console.log('llll', document.getElementById(elementId))

            Object.assign(document.getElementById(elementId).parentElement.style, {
              backgroundColor: key,
            });
          });
        });

        console.log("colorCodes", Object.entries(colorCodes) );
      }
    }, [serverSentEventLoading]);

    // assignSetPColor(colorCodes)
    return (
      <IonGrid key="Requirements-text">
        <IonRow className="ion-align-items-center ion-justify-content-start">
          {sentences.flat(Infinity).map((sentence, index) => {
            return (
              <IonCol
                className="on-float-left"
                size="12"
                style={{ height: "55px" }}
                key={"kkk" + index}
              >
                <p
                  id={"color-" + index}
                  key={index + "sss"}
                  className="ion-text-start ion-text-wrap"
                  style={{ overflowWrap: "break-word", textAlign: "justify" }}
                >
                  {sentence}
                </p>{" "}
              </IonCol>
            );
          })}
        </IonRow>
      </IonGrid>
    );
  };

  return parseText(text);
}

const cleanText = (text) => {
  // Regular expression to match IDs surrounded by brackets
  text = text.replace(/\)\,/g, ")");

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
        lastIndex = idWithBracketsRegex.lastIndex;
      }
      if (lastIndex < cleanedSentence.length) {
        parts.push(cleanedSentence.slice(lastIndex));
      }
      return parts;
    });
    return sentences;
  };
  const str_join = parseText(text).flat(Infinity).join(" ");

  return str_join;
};

export { TextWithMarkers, cleanText };

function removeNestedBrackets(text) {
  let result = "";
  let openBracketCount = 0;
  let startIndex = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "(" || text[i] === "{" || text[i] === "[") {
      if (openBracketCount === 0) {
        result += text.slice(startIndex, i);
      }
      openBracketCount++;
    } else if (text[i] === ")" || text[i] === "}" || text[i] === "]") {
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
