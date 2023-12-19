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
  useProductDataContext,
} from "../components";
import parseTextWorker from "../utilities/ParseTextWorker?worker";
import { throttle } from "lodash";
// import { wrap } from "comlink";
// import { Image } from "@react-pdf/renderer";
// const workerParseText = wrap(new parseTextWorker());

function SentenceHighlight({ text, color }) {
  return (
    <IonChip
      className="highlight"
      key={`highlight${text}${color}`}
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
  // colorSet,
  size,
  // parts,
  sentenceEnd,
  // elementsLen,
}) {
  for (const [subString, id] of mappedLegend) {
    // if (colorSet[subString + id]) {
    //   continue;
    // }

    const keyTerm = ` ${subString.toLowerCase()} `;

    const index = mainString.toLowerCase().indexOf(keyTerm);

    if (index !== -1) {
      const before = mainString.slice(0, index);
      const after = mainString.slice(index + subString.length + 1);
      const wrappedString = (
        <SentenceHighlight
          key={`wordHighlight${id}`}
          text={mainString.slice(index, index + subString.length + 1)}
          color={id}
        />
      );
      // colorSet[subString + id] = true;

      return {
        size,
        strSize: mainString.length,
        type: "content-highlight",
        variant: (
          <div key={id}>
            {before}
            {wrappedString}
            {after}
            {sentenceEnd}
          </div>
        ),
      };
    }
  }

  return {
    size,
    type: "content",
    strSize: mainString.length,
    variant: (
      <p>
        {mainString}
        {sentenceEnd}
      </p>
    ),
  };
}

function getWindowSizeFactor() {
  const windowWidth = window.innerWidth;

  switch (true) {
    case windowWidth > 600:
      return 3;
    case windowWidth > 450:
      return 2;
    default:
      return 1;
  }
}

// Example usage

const processSections = ({ sentenceElements }) => {
  if (sentenceElements.length) {
    const imgBuffer = [];
    const labelBuffer = [];
    const sentences = [];
    sentenceElements.forEach((section, index) => {
      let { size } = section;

      let element;
      switch (section.function) {
        case "wrapSubstringInPTags":
          const { mappedLegend, mainString, sentenceEnd } = section;

       

          element = wrapSubstringInPTags({
            mappedLegend,
            mainString: mainString.replace("\u0003", ""),
            size,
            sentenceEnd,
          });

          sentences[sentences.length] = element;

          if (
            mainString.includes(".") ||
            mainString.includes("?") ||
            mainString.includes("!") ||
            mainString.includes("\u0003")
          ) {
            const sizeFactor = getWindowSizeFactor();
            for (let i = 0; i < imgBuffer.length; i += sizeFactor) {
              sentences[sentences.length] = [
                ...imgBuffer.slice(i, i + sizeFactor)
              ];
            }

            for (let i = 0; i < labelBuffer.length; i += sizeFactor) {
              sentences[sentences.length] = [
                ...labelBuffer.slice(i, i + sizeFactor)
              ];
            }
            imgBuffer.length = 0;
            labelBuffer.length = 0;
            
          }

          break;

        case "variant":
          // console.log('loadingStream', loadingStream)
          const { tag, imageSrc, label, ImageSrc, markerType, type, color } =
            section;

          // if (markerCache[color]) {
          //   return markerCache[label];
          // }

          element = {
            function: "variant",
            variant: (
              <Marker
                key={color}
                imageSrc={ImageSrc}
                size={size}
                label={label}
                color={color}
                markerType={markerType}
              />
            ),
            tag,
            ImageSrc,
            label,
            markerType,
            size,
            type,
            color,
          };
          console.log('type:::', type)
          if (type === "img") {
            imgBuffer[imgBuffer.length] = element;
          }
          if (type === "label") {
            labelBuffer[labelBuffer.length] = element;
          }
          break;
        default:
          break;
      }
      if (element) {
        return element;
      }
      return "error, at index: ", index;
    });
    return sentences;
  }
};

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
        key={`item-key${index}`}
        index={index}
        lines="none"
        ref={refs.get(index)}
        className="ion-text-start ion-text-wrap"
        style={{
          ...style,
        }}
      >
        {Array.isArray(variant)
          ? variant.map((v) => v.variant)
          : variant.variant}
      </IonItem>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.variant !== nextProps.variant;
  }
);

const VirtualList = React.memo(
  ({ sentences: streamData, variableSizeListRef, colRefs }) => {
    const [userScrollDetected, setUserScrollDetected] = useState(false);

    const getSize = (sentence) => {
      console.log("sentence: ", sentence);

      if (Array.isArray(sentence) && sentence.length > 0) {
        return sentence[0].size;
        
        return 160;
        // (1 + Math.floor( sentence.length / 5 )) ;
      }

      if (sentence && sentence.size) {
        return 65;
        //* ( 1 + Math.floor(sentence.strSize / 55 ));
      }

      return 0;
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

    const throttledScroll = useCallback(
      throttle(
        (variableSizeListRef, streamData) => {
          // Expensive operation (e.g., API call)

          if (variableSizeListRef.current && !userScrollDetected) {
            const scrollContainer = variableSizeListRef.current;
            scrollContainer.scrollToItem(streamData.length - 1, "start");
          }
        },
        400,
        { leading: true, trailing: true }
      ),
      []
    );
    useEffect(() => {
      // scrollContainer.scrollTop = scrollContainer.scrollHeight;
      throttledScroll(variableSizeListRef, streamData);

      // 'start' is the alignment option
    }, [streamData]);

    const RowRenderer = ({ index, style, data }) => {
      return (
        <SentenceRow
          key={index % data.sentences.length}
          index={index % data.sentences.length}
          style={style}
          variant={data.sentences[index % data.sentences.length]}
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
  }
  // ,
  // (prevProps, nextProps) => {
  //   // console.log('rendering', nextProps.sentences[nextProps.sentences.length -1])
  //   // return   Boolean(nextProps.sentences[nextProps.sentences.length -1]?.variant.includes("_.jpg") )
  // }
);

// let processedSentences = {};
// let processedImages = {};
function TextWithMarkers({
  imagePlaceHolder,
  eventEmitter,
  sSEWorker,
  assignClearAssistMethod,
  mappedLegend,
  selectedImageMap,
}) {
  const [streamData, setStreamData] = useState([]);
  const variableSizeListRef = useRef(null);

  const loading = useRef(false);
  const [clearVirtualList, setClearVirtualList] = useState(false);

  const [variableListItemHeight, setVariableListItemHeight] = useState(45);
  const variableListItemImageHeight = 160;

  const [sentences, setSentences] = useState([]);
  const colRefs = useRef(new Map());
  const listRef = useRef({});

  const { setLoadingStream, loadingStream } = useProductDataContext();
  // const sentences = useMemo(
  //   () =>
  //     parseText({
  //       text: streamData.join(""),
  //       imagePlaceHolder,
  //       mappedLegend,
  //       labelArray,
  //       variableListItemHeight,
  //       variableListItemImageHeight,
  //       selectedImageMap,
  //       selectedImageMapPureKeys,
  //       imageKeys,
  //       processedSentences,
  //       processedImages,
  //       loadingStream,
  //     }) || [][streamData]
  // );

  // const sentencesM = useMemo(() => {
  //   return sentences;
  // }, [sentences]);

  function clearSentences() {
    setStreamData([]);
    setSentences([]);

    setClearVirtualList((prev) => !prev);
    variableSizeListRef.current.resetAfterIndex(0);
  }

  useEffect(() => {
    // console.log("loadingStream", loadingStream);
    // console.log("sentences", sentences);
    // listRef.current.scrollToItem(sentences.length - 1, "smooth");
    // console.log('loadingStream', loadingStream);
  }, []);

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
    };
  }, []);

  useEffect(() => {
    const elements = [];

    function setLoading(loading) {
      console.log("setLoading", loading);

      // Assuming setLoadingStream is a state-setting function
      setLoadingStream(loading);
    }

    const streamDataHandler = (eventData) => {
      const sentenceElements = eventData.sentenceElements;

      const result = processSections({
        sentenceElements,
        elements,
      });

      result && setSentences([...result]);
    };
    sSEWorker.current.addEventListener("message", (event) => {
      switch (event.data.type) {
        case "open":
          if (event.data.setLoading === true) {
            setLoading(true);
            console.log("set loading to true");
          }

          console.log("setting loading to true");
          break;

        case "stream":
          streamDataHandler(event.data.eventData);
          break;

        case "close":
          if (event.data.setLoading === false) {
            setLoading(event.data.setLoading);
          }
          console.log("event close");
          break;
      }
    });

    return () => {
      // Assuming setStreamData is a state-setting function
      setStreamData([]);
    };
  }, []);
  useEffect(() => {
    console.log("loading:::", loadingStream, "colRefs:  ", colRefs);

    const scrollContainer = variableSizeListRef.current;

    if (scrollContainer) {
      // varRef.recomputeRowHeights();
      scrollContainer.resetAfterIndex(0);
      console.log(
        "scrollContainer:----",
        scrollContainer,
        "---",
        sentences.length,
        "--",
        sentences
      );
      scrollContainer.scrollToItem(sentences.length - 1, "end");
    }
  }, [loadingStream]);
  return (
    <IonGrid key="Requirements-text">
      <IonRow key="Requirements-text-row">
        <IonCol key={"requirements-col"} size="12">
          <IonList key="ionListVariableSizeList">
            <VirtualList
              key={
                //loadingStream ?
                "rerender"
                //: "no-rerender"
              }
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

const cleanText = ({
  completeText,
  selectedImageMap,
  mappedObject,
  mappedLegend,
}) => {
  // Regular expression to match IDs surrounded by brackets
  // str = str.replace(/\)\,/g, ")")
  const idWithBracketsRegex =
    /\(([^)]+)\s*-\s*#([0-9A-Fa-f]{6})\)|\{([^}]+)\s*-\s*#([0-9A-Fa-f]{6})\}|\[([^\]]+)\s*-\s*#([0-9A-Fa-f]{6})\]|#([0-9A-Fa-f]{6})/g;
  const parseText = (text) => {
    text = text.replace(/\(+/g, "(");
    text = text.replace(/\)+/g, ")");
    text = text.replace("\u0003", "");
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
          parts.push(
            cleanedSentence
              .slice(lastIndex, match.index)  .replace(/\(+/g, "(")
              .replace(/\)+/g, ")")
              .replace(/\([^)]*\)/g, "")
            
          );
        }

        const labelRaw = roundLabel || curlyLabel || squareLabel || "";
        const idValue = roundId || curlyId || squareId || id;
        const label = labelRaw.replace(/#/g, "").trim();

        if (mappedObject[`#${idValue}`] && label.includes(".jpg")) {
          console.log("label: ", label, +"#" + idValue);
          const ImageSrc = mappedObject[`#${idValue}`]?.url || "";

          // console.log("imageSrc: ", ImageSrc);
          parts.push(
            `<img src=${
              ImageSrc || "https://placehold.co/600x400?text=No+Image+Available"
            }  />`
          );
        }

        lastIndex = idWithBracketsRegex.lastIndex;
      }

      if (lastIndex < cleanedSentence.length) {
        parts.push(
          `${cleanedSentence.slice(lastIndex)}. `.replace(/\(+/g, "(")
            .replace(/\)+/g, ")")
            .replace(/\([^)]*\)/g, "")
          
        );
      }
      return parts;
    });
    return sentences;
  };

  return parseText(completeText);
};

export { TextWithMarkers, cleanText };
