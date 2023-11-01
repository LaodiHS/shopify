import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonList,
  IonChip,
} from "@ionic/react";
import { VariableSizeList } from "react-window";
// import InfiniteLoader from "react-window-infinite-loader";
import {
  Marker,
  // useDataProvidersContext,
  // NoImagePlaceHolder,
} from "../components";

import { throttle } from "lodash";
// import { Image } from "@react-pdf/renderer";
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

      let keyTerm = ` ${subString.toLowerCase()} `;

      const index = mainString.toLowerCase().indexOf(keyTerm);

      if (index !== -1) {
        const before = mainString.slice(0, index);
        const after = mainString.slice(index + subString.length + 1);
        const wrappedString = (
          <SentenceHighlight
            key={"wordHighlight" + id}
            text={mainString.slice(index, index + subString.length + 1)}
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
        variant: mainString + sentenceEnd,
      });
    }
  }
}

function parseText({
  text,
  mappedLegend,
  variableListItemHeight,
  variableListItemImageHeight,
imagePlaceHolder,
  selectedImageMapPureKeys,

  processedSentences,
  processedImages,
  loadingStream,
}) {
  // console.log('text: ',text)
  const idWithBracketsRegex =
    /\(([^)]+)\s*-\s*#([0-9A-Fa-f]{6})\)|\{([^}]+)\s*-\s*#([0-9A-Fa-f]{6})\}|\[([^\]]+)\s*-\s*#([0-9A-Fa-f]{6})\]|#([0-9A-Fa-f]{6})/g;
  const remove_artifacts = text.replace(/\)\,/g, ")");
  const colorSet = {};

  const sentences = remove_artifacts.split(". ").map((sentence, index) => {
    if (processedSentences[sentence]) {
      return processedSentences[sentence]; // Return the processed result if sentence has been processed before
    }

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
      const markerSize = label.includes("_.jpg")
        ? variableListItemImageHeight
        : variableListItemHeight;
      const markerType = label.includes("_.jpg") ? "img" : "label";

      const imageLabel =
        markerType === "img"
          ? label
              .split(" ")
              .filter((image) => image.includes("_.jpg"))
              .pop()
          : null;

      let ImageSrc = imagePlaceHolder;

      const result = mappedLegend.slice().find(([key, id]) => {
        if (id && id.includes(`#${idValue}`)) {
          if (key.includes("_.jpg")) {
            const imageKey = key.split(" ")[1];
            ImageSrc =
              selectedImageMapPureKeys[imageKey]?.url || imagePlaceHolder;
          } else {
            ImageSrc = key;
          }
          return true;
        }
        return false;
      });

      const color = (result && result[1]) || "none";
      const key = (result && result[0]) || "KeyError";

      const element = {
        variant: (
          <Marker
            loadingStream={loadingStream}
            imageSrc={ImageSrc}
            size={markerSize}
            label={key}
            color={color || "#" + idValue}
            markerType={markerType}
          />
        ),
        size: markerSize,
        type: markerType,
        color: color || "#" + idValue,
      };
      const hashImageElement = label + markerSize + idValue;
      if (processedImages[hashImageElement]) {
        parts.push(processedImages[hashImageElement]);
      } else {
        processedImages[hashImageElement] = element;
        parts.push(element);
      }

      lastIndex = idWithBracketsRegex.lastIndex;
    }

    if (cleanedSentence.length && lastIndex < cleanedSentence.length) {
      const lastSentence = cleanedSentence.slice(lastIndex);
      wrapSubstringInPTags({
        mappedLegend,
        mainString: lastSentence,
        colorSet,
        parts,
        size: variableListItemHeight,
        sentenceEnd: ".",
      });
    }
    const part = parts.filter((val) => {
      if (!val.variant) {
        return false;
      }
      return true;
    });
    if (sentence.includes(".")) {
      processedSentences[sentence] = part;
      // console.log('sentences', processedSentences);
    }
    return part;
  });

  return sentences.flat(Infinity);
}
const SentenceRow = React.memo(
  ({ index, style, variant, refs }) => {
    // console.log('index:',index)

    useEffect(() => {
      if (!refs.has(index)) {
        refs.set(index, React.createRef());
      }

      return () => {};
    }, [index, variant, refs]);

    return (
      <IonItem
        key={"item-key" + index}
        lines="none"
        ref={refs.get(index)}
        className="ion-text-start ion-text-wrap"
        style={{
          ...style,
        }}
      >
        {variant}
      </IonItem>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.variant !== nextProps.variant;
  }
);

const VirtualList = React.memo(
  ({
    variableListItemHeight,
    variableListItemImageHeight,
    sentences: streamData,
    variableSizeListRef,
    colRefs,
  }) => {
    const [userScrollDetected, setUserScrollDetected] = useState(false);

    const getSize = (sentence) => {
      if (typeof sentence === "string") {
        const length = sentence.length;

        if (sentence.includes("_.jpg")) {
          return 45;
        } else {
          return variableListItemHeight + 20;
        }
      }
      if (sentence && sentence.type && sentence.type === "img") {
        return variableListItemImageHeight;
      } else {
        return variableListItemHeight + 20;
      }
    };

    // useEffect(() => {
    //   let isUserScrolling = false;

    //   const handleScroll = () => {
    //     console.log("wheeling");
    //     if (isUserScrolling) {
    //       setUserScrollDetected(true);
    //     }
    //   };
    //   const handleMouseMove = () => {
    //     console.log("mousemove");
    //     isUserScrolling = true;
    //   };
    //   if (listRef.current) {
    // listRef is not a dom element but a VariableList object
    //     console.log('DomElement',listRef.current)
    //     listRef.current.addEventListener("wheel", handleScroll);
    //     listRef.current.addEventListener("mousemove", handleMouseMove);
    //   }
    //   return () => {

    //     listRef.current.removeEventListener("wheel", handleScroll);
    //     listRef.current.removeEventListener("mousemove", handleMouseMove);
    //   };
    // }, [listRef]);

    useEffect(() => {
      console.log("component refreshed");
      if (variableSizeListRef.current && !userScrollDetected) {
        variableSizeListRef.current.scrollToItem(
          streamData.length - 3,
          "start"
        );

        // 'start' is the alignment option
      }
    }, [streamData]);

    const RowRenderer = ({ index, style, data }) => {
      return (
        <SentenceRow
          key={index % data.sentences.length}
          index={index % data.sentences.length}
          style={style}
          variant={data.sentences[index % data.sentences.length]?.variant}
          refs={data.refs}
          // elementStyles={elementStyles}
        />
      );
    };

    return (
      // <InfiniteLoader
      //   isItemLoaded={(index) => index < streamData.length}
      //   itemCount={streamData.length}
      // >
      //   {({ onItemsRendered, ref }) => (
      <VariableSizeList
        key="FixedSizeList-Requirements-text"
        height={600} // Set an appropriate height
        width={"100%"}
        ref={variableSizeListRef}
        overscanCount={20}
        //  onItemsRendered={handleItemsRendered}

        itemSize={(index) => getSize(streamData[index % streamData.length])}
        itemCount={streamData.length}
        // rowHeight={(index) =>  Math.random() * (100 - 75) + 44
        // } // Set an appropriate item size
        // onItemsRendered={onItemsRendered}
        itemData={{
          sentences: streamData,
          refs: colRefs.current,
          // length: sentences.length,
          // elementStyles,
        }}
        initialScrollOffset={streamData.length * 27}
      >
        {RowRenderer}
      </VariableSizeList>
      //   )}
      // </InfiniteLoader>
    );
  },
  (prevProps, nextProps) => {
    // console.log('rendering', nextProps.sentences[nextProps.sentences.length -1])
    // return   Boolean(nextProps.sentences[nextProps.sentences.length -1]?.variant.includes("_.jpg") )
  }
);

let dataStreamArray = [];
let processedSentences = {};
let processedImages = {};
function TextWithMarkers({
  imagePlaceHolder,
  eventEmitter,
  assignClearAssistMethod,
  mappedLegend,
  selectedImageMap,
}) {
  const [streamData, setStreamData] = useState([]);
  const variableSizeListRef = useRef(null);
  const [clearVirtualList, setClearVirtualList] = useState(false);
  const [imageKeys, setImageKeys] = useState(Object.keys(selectedImageMap));
  const [selectedImageMapPureKeys, setSelectedImageMapPureKeys] = useState(
    Object.entries(selectedImageMap).reduce((acc, [key, value]) => {
      acc[key.split(" ")[1]] = value;
      return acc;
    }, {})
  );

  const [labelArray, setLabelArray] = useState(
    mappedLegend.map((label) => label[0]) || []
  );

  const [variableListItemHeight, setVariableListItemHeight] = useState(45);
  const variableListItemImageHeight = 160;

  const [elementStyles, setElementStyles] = useState({});

  const colRefs = useRef(new Map());
  const listRef = useRef({});
  const [loadingStream, setLoadingStream] = useState(false);
  const sentences = useMemo(
    () =>
      parseText({
        text: streamData.join(""),
        imagePlaceHolder,
        mappedLegend,
        labelArray,
        variableListItemHeight,
        variableListItemImageHeight,
        selectedImageMap,
        selectedImageMapPureKeys,
        imageKeys,
        processedSentences,
        processedImages,
        loadingStream,
      }) || [][streamData]
  );

  function clearSentences() {
    setStreamData([]);
    dataStreamArray.length = 0;
    processedSentences = {};
    processedImages = {};
    dataStreamArray = [];
    setClearVirtualList((prev) => !prev);
    variableSizeListRef.current.resetAfterIndex(0);
  }
  const throttleSetRefArray = useCallback(
    throttle(
      (newRefArray, processIncompleteDataWithBrackets) => {
        const result = processIncompleteDataWithBrackets(newRefArray);

        if (result.length) {
          setStreamData([...result]);
        }
      },
      60,
      {
        leading: true,
        trailing: true,
      }
    ), // Adjust the debounce delay as needed
    []
  );
  useEffect(() => {
    console.log("sentences", sentences);
    // listRef.current.scrollToItem(sentences.length - 1, "smooth");
  }, [sentences]);

  useEffect(() => {
    assignClearAssistMethod("clearSentences", clearSentences);
  }, []);

  useEffect(() => {
    const breakpoints = [
      { width: 200, height: 110 },
      { width: 1200, height: 44 },
    ].reverse();

    const handleResize = () => {
      const width = window.innerWidth;
      const matchedBreakpoint = breakpoints.find(
        (breakpoint) => width > breakpoint.width
      );

      if (matchedBreakpoint) {
        setVariableListItemHeight(matchedBreakpoint.height);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      processedSentences = {};
      processedImages = {};
      dataStreamArray = [];
    };
  }, []);

  useEffect(() => {
    let currentElement = "";
    let openBrackets = 0;
    let i = 0;
    let result = [];
    function processIncompleteDataWithBrackets(incomingData) {
      const fragments = processIncompleteSections(incomingData);

      for (; i < fragments.length; i++) {
        const fragment = fragments[i];

        for (const letter of fragment) {
          if (letter === "(") {
            openBrackets++;
            if (openBrackets === 1) {
              currentElement += letter;
            }
          } else if (letter === ")") {
            openBrackets--;
            if (openBrackets === 0) {
              currentElement += letter;
            }
          } else {
            currentElement += letter;
          }
        }

        if (openBrackets === 0) {
          result.push(currentElement);
          currentElement = "";
        }
      }

      return result;
    }

    let completeSections = [];
    let k = 0;
    function processIncompleteSections(incomingData) {
      incomingData.length - 1;

      completeSections.push(
        incomingData.slice(k, incomingData.length - 1).join("")
      );
      k = incomingData.length - 1;

      return completeSections;
    }

    let loadingStr = false;
    const streamDataHandler = (eventData) => {
      if (!loadingStr) {
        loadingStr = true;
        setLoadingStream(true);
      }
      const delta = eventData.delta;
      dataStreamArray[dataStreamArray.length] = eventData.delta.content;

      throttleSetRefArray(
        dataStreamArray,
        // processIncomingData,
        processIncompleteDataWithBrackets
      );

      const finish_reason = delta.finish_reason;
      if (finish_reason) {
        console.log("finish_reason", finish_reason);
        processedSentences = {};
        processedImages = {};
        completeSections = [];
        k = 0;
        currentElement = "";
        openBrackets = 0;
        i = 0;
        result = [];
        if (loadingStr) {
          loadingStr = false;
          setLoadingStream(false);
          console.log("loadingStream", loadingStream);
          console.log("loadingStr", loadingStr);
        }
      }
    };

    eventEmitter.on("streamData", streamDataHandler);

    return () => {
      setStreamData([]);
      dataStreamArray.length = 0;
      eventEmitter.removeListener("streamData", streamDataHandler);
      // eventEmitter.off("streamData", streamDataHandler);
      // Clearing streamData when component is unmounted
    };
  }, []);

  return (
    <IonGrid key="Requirements-text">
      <IonRow key="Requirements-text-row">
        <IonCol key={"requirements-col"} size="12">
          <IonList key="ionListVariableSizeList">
            <VirtualList
              // key={clearVirtualList ? "rerender" : "no-rerender"}
              variableListItemHeight={variableListItemHeight}
              colRefs={colRefs}
              variableSizeListRef={variableSizeListRef}
              variableListItemImageHeight={variableListItemImageHeight}
              sentences={sentences}
              listRef={listRef}
            />
          </IonList>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

const cleanText = ({ str, selectedImageMap, mappedLegend }) => {
  const selectedImageMapPureKeys = Object.entries(selectedImageMap).reduce(
    (acc, [key, value]) => {
      acc[key.split(" ")[1]] = value;
      return acc;
    },
    {}
  );
  // Regular expression to match IDs surrounded by brackets
  str = str.replace(/\)\,/g, ")");

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

        if (label.includes("_.jpg")) {
          let ImageSrc;
          mappedLegend.slice().find(([key, id]) => {
            console.log("key: ", key);
            console.log("id: ", id);
            if (id && id.includes("#" + idValue)) {
              if (key.includes("_.jpg")) {
                let imageKey = key.split(" ")[1];
                ImageSrc = selectedImageMapPureKeys[imageKey]?.url;
                return true;
              } else {
                ImageSrc = "";
                return false;
              }
            }
            return false;
          });
          console.log("imageSrc: ", ImageSrc);
          parts.push(`<img src=${ImageSrc || "https://placehold.co/600x400?text=No+Image+Available"}  />`);
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
  const str_join = parseText(str).flat(Infinity).join(" ");

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
