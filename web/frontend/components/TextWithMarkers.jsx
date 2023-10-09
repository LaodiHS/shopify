import debounce from "lodash.debounce";
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonItem,
  IonList,
  IonChip,
} from "@ionic/react";
import { VariableSizeList } from "react-window";
import { Marker, useDataProvidersContext, NoImagePlaceHolder } from "../components";

function SentenceHighlight({ text, color }) {
  return (
    <IonChip
      className="highlight"
      key={"highlight" + text + color}
      style={{
        position: "relative",
        borderRadius: "2px",
        fontFamily: "'Baloo', sans-serif",

        background: `${color}`,
      }}
    >
      {text}
    </IonChip>
  );
}
function wrapSubstringInPTags({
  mappedLegend,
  mainString,
  colorSet,
  size,
  parts,
  sentenceEnd,
}) {
  if (mainString.length) {
    for (const [subString, id] of mappedLegend) {
      if (colorSet[subString + id]) {
        continue;
      }
      const index = mainString.toLowerCase().indexOf(subString.toLowerCase());

      if (index !== -1) {
        const before = mainString.slice(0, index);
        const after = mainString.slice(index + subString.length);
        const wrappedString = (
          <SentenceHighlight
            key={"wordHighlight" + id}
            text={mainString.slice(index, index + subString.length)}
            color={id}
          />
        );
        colorSet[subString + id] = true;
        if (mainString.trim().length) {
          parts.push({
            size: size,
            type: "content-highlight",
            variant: (
              <div>
                {before}
                {wrappedString}
                {after}
                {sentenceEnd}
              </div>
            ),
          });
          return null;
        }
      }
    }
    if (mainString.trim().length) {
      parts.push({
        size: size,
        type: "content",
        variant: mainString+ sentenceEnd,
      });
    }
  }
}

function parseText(
  text,
  mappedLegend,
  variableListItemHeight,
  variableListItemImageHeight,
  selectedImageMap
) {
  const idWithBracketsRegex =
    /\(([^)]+)\s*-\s*#([0-9A-Fa-f]{6})\)|\{([^}]+)\s*-\s*#([0-9A-Fa-f]{6})\}|\[([^\]]+)\s*-\s*#([0-9A-Fa-f]{6})\]|#([0-9A-Fa-f]{6})/g;
  const remove_artifacts = text.replace(/\)\,/g, ")");
  const colorSet = {};

  const sentences = remove_artifacts.split(". ").map((sentence, index) => {
    // Removing trailing punctuation marks to avoid breaking links
    let cleanedSentence = sentence.replace(/[.,!?]$/, "").trim();
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
      // Determine which label and ID to use
      const labelRaw = roundLabel || curlyLabel || squareLabel || "";
      const idValue = roundId || curlyId || squareId || id;
      const label = labelRaw.replace(/#/g, "").trim();

      if (match.index > lastIndex) {
        let mainString = cleanedSentence.slice(lastIndex, match.index);

        mainString = wrapSubstringInPTags({
          mappedLegend,
          mainString,
          colorSet,
          parts,
          size: variableListItemHeight,
          sentenceEnd: "",
        });
      }

      // Add the anchor tag with the matched ID and label
      const markerSize = label.includes("_jpg")
        ? variableListItemImageHeight
        : variableListItemHeight;
      const markerLabel = label.includes("_jpg") ? "img" : "label";

      parts.push({
        variant: (
          <Marker
            selectedImageMap={selectedImageMap}
            size={markerSize}
            requirementText={label}
            color={"#" + idValue}
          />
        ),
        size: markerSize,
        type: markerLabel,
        color: "#" + idValue,
      });

      lastIndex = idWithBracketsRegex.lastIndex;
    }

    if (cleanedSentence.length) {
      if (lastIndex < cleanedSentence.length) {
        const lastSentence = cleanedSentence.slice(lastIndex);
        let mainString = lastSentence;
        wrapSubstringInPTags({
          mappedLegend,
          mainString,
          colorSet,
          parts,
          size: variableListItemHeight,
          sentenceEnd: ".",
        });
      }
    }
    const part = parts.filter((val) => {
      if (!val.variant) {
        return false;
      }
      return true;
    });
    return part;
  });

  return sentences.flat(Infinity);
}
function SentenceRow({ index, style, data, refs, length, elementStyles }) {
  const [sentence, setSentence] = useState(data[index % length]);

  //  style.height =   sentence.size + "px"

  useEffect(() => {
    if (!refs.has(index % length)) {
      refs.set(index % length, React.createRef());
    }
    const colRef = refs.get(index % length);

    return () => {};
  }, [index, length, refs, elementStyles]);

  return (
    <IonItem
      key={"item-key" + (index % length)}
      lines="none"
      ref={refs.get(index % length)}
      className="ion-text-start ion-text-wrap"
      style={{
        ...style,
      }}
    >
      {sentence.variant}
    </IonItem>
  );
}

function TextWithMarkers({
  eventEmitter,
  assignClearAssistMethod,
  mappedLegend,
  selectedImageMap,
}) {
  const [variableListItemHeight, setVariableListItemHeight] = useState(45);

  const [variableListItemImageHeight, setVariableListItemImageHeight] =
    useState(160);
  const colRefs = useRef(new Map());
  const listRef = useRef({});
  const [elementStyles, setElementStyles] = useState({});

  const [streamData, setStreamData] = useState([]);

  // const {
  //   eventEmitter,
  //   assignClearAssistMethod,

  //   mappedLegend,
  // } = useDataProvidersContext();

  useEffect(() => {
    const breakpoints = [
      { width: 200, height: 110 },
      { width: 1200, height: 44 },
    ].reverse();

    const handleResize = () => {
      console.log("currentColWidth: ", window.innerWidth);
      const width = window.innerWidth;
      const matchedBreakpoint = breakpoints.find(
        (breakpoint) => width > breakpoint.width
      );

      if (matchedBreakpoint) {
        console.log("matcheBreakpoint.height", matchedBreakpoint.height);
        setVariableListItemHeight(matchedBreakpoint.height);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let incompleteBuffer = "";

    function processIncomingData(incomingData) {
      const words = incomingData.split(" ");

      const completeWords = [];

      if (incompleteBuffer) {
        const firstWord = words.shift();
        const completeWord = incompleteBuffer + firstWord;
        completeWords.push(completeWord);
        incompleteBuffer = "";
      }

      for (let i = 0; i < words.length - 1; i++) {
        completeWords.push(words[i]);
      }

      const lastWord = words[words.length - 1];

      if (lastWord) {
        if (lastWord.endsWith(" ")) {
          completeWords.push(lastWord.trim());
        } else {
          incompleteBuffer = lastWord;
        }
      }

      return completeWords;
    }

    const streamDataHandler = (eventData) => {
      const delta = eventData.delta;
      const result = processIncomingData(delta.content);
      if (result.length) {
        setStreamData((prev) => [...prev, result.join(" ")]);
      }
      const finish_reason = delta.finish_reason;
      if (finish_reason) {
      }
    };

    eventEmitter.on("streamData", streamDataHandler);

    return () => {
      setStreamData([]);
      eventEmitter.removeListener("someEvent", streamDataHandler);
      // eventEmitter.off("streamData", streamDataHandler);
      // Clearing streamData when component is unmounted
    };
  }, []);

  const sentences = useMemo(
    () =>
      parseText(
        streamData.join(""),
        mappedLegend,
        variableListItemHeight,
        variableListItemImageHeight,
        selectedImageMap
      ) || [],
    [streamData.join("")]
  );

  function clearSentences() {
    setStreamData([]);
  }
  useEffect(() => {
    assignClearAssistMethod("clearSentences", clearSentences);
  }, []);

  useEffect(() => {
    listRef.current.scrollToItem(sentences.length - 1, "smooth");
  }, [sentences]);

  const getSize = (index, length) => {
    const sentence = sentences[index % length];
    if (!sentence) {
      return 0;
    }

    const sentenceObject = sentence.variant;
    if (typeof sentenceObject === "string") {
      const length = sentenceObject.length;

      if (sentenceObject.includes("jpg")) {
        return variableListItemImageHeight ;
      } else {
        return variableListItemHeight + 20;
      }
    }
    if (sentenceObject.type === "img") {
      return variableListItemImageHeight;
    } else {
      return variableListItemHeight + 20;
    }
  };

  return (
    <IonGrid key="Requirements-text">
      <IonRow
        key="Requirements-text-row"
        className="
        // ion-align-items-center ion-justify-content-start
        "
      >
        <IonCol key={"requirements-col"} size="12">
          <IonList>
            <VariableSizeList
              key="FixedSizeList-Requirements-text"
              height={500} // Set an appropriate height
              width={"100%"}
              ref={listRef}
              overscanCount={20}
              onItemsRendered={(index) => {
                // console.log('index', index)
              }}
              itemSize={(index) => getSize(index, sentences.length)}
              itemCount={sentences.length}
              // rowHeight={(index) =>  Math.random() * (100 - 75) + 44
              // } // Set an appropriate item size

              itemData={{
                sentences,
                refs: colRefs.current,
                length: sentences.length,
                elementStyles,
              }}
              initialScrollOffset={sentences.length * 27}
            >
              {({ index, style }) => (
                <SentenceRow
                  key={index}
                  index={index}
                  style={style}
                  data={sentences}
                  refs={colRefs.current}
                  length={sentences.length}
                  elementStyles={elementStyles}
                />
              )}
            </VariableSizeList>
          </IonList>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

const cleanText = (text, selectedImageMap) => {
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

        const labelRaw = roundLabel || curlyLabel || squareLabel || "";
        const idValue = roundId || curlyId || squareId || id;
        const label = labelRaw.replace(/#/g, "").trim();

        if (label.includes("_jpg")) {
          parts.push(
            selectedImageMap[label]?.url ? <img src={
              selectedImageMap[label]?.url} />  
               : <NoImagePlaceHolder />
          );
        }

        lastIndex = idWithBracketsRegex.lastIndex;
      }

      if (lastIndex < cleanedSentence.length) {
        parts.push(cleanedSentence.slice(lastIndex) + ". ");
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
