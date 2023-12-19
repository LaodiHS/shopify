import {expose, wrap} from "comlink";
const  processedSentences ={};
const processedImages = {};
function parseText({
  text,
  mappedLegend,
  variableListItemHeight,
  variableListItemImageHeight,
  imagePlaceHolder,
  selectedImageMapPureKeys,
  // processedSentences,
  // processedImages,
  // loadingStream,
}) {
  // console.log('text: ',text)

  const idWithBracketsRegex =
    /\(([^)]+)\s*-\s*#([0-9A-Fa-f]{6})\)|\{([^}]+)\s*-\s*#([0-9A-Fa-f]{6})\}|\[([^\]]+)\s*-\s*#([0-9A-Fa-f]{6})\]|#([0-9A-Fa-f]{6})/g;
  //.text.replace(/\))/g, ")");
  const colorSet = {};
console.log('text: ',text);
  const sentences = text.split(". ").map((sentence, index) => {
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

        parts.push({
          function: "wrapSubstringInPTags",
          mappedLegend,
          mainString,
          //   parts,
          size: variableListItemHeight,
          sentenceEnd: "",
        });

        //   mainString = wrapSubstringInPTags({
        //     mappedLegend,
        //     mainString,
        //     colorSet,
        //     parts,
        //     size: variableListItemHeight,
        //     sentenceEnd: "",
        //   });
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
        function: "variant",
        tag: "Marker",
        imageSrc: ImageSrc,
        label: key,
        color: color || `#${idValue}`,
        markerType,
        size: markerSize,
        type: markerType,
        color: color || `#${idValue}`,
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
      parts.push({
        function: "wrapSubstringInPTags",
        mappedLegend,
        mainString: lastSentence,
        colorSet,
        // parts,
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

const processSections = ({ sections, parts, loadingStream }) => {

  for (const section of sections) {
    switch (section.function) {
      case "wrapSubstringInPTags":
        const { mappedLegend, mainString, colorSet, size, sentenceEnd } =
          sections;

        wrapSubstringInPTags({
          mappedLegend,
          mainString,
          colorSet,
          parts,
          size,
          sentenceEnd,
        });

        break;

      case "variants":
        const { tag, imageSrc, label, ImageSrc, markerType, type, color } =
          sections;

        const element = {
          function: "variant",
          variant: (
            <Marker
              loadingStream={loadingStream}
              imageSrc={ImageSrc}
              size={markerSize}
              label={key}
              color={color}
              markerType={markerType}
            />
          ),
          tag,
          imageSrc,
          label,
          markerType,
          size,
          type,
          color,
        };
        parts.push(element)

        break;
    }
  }
};




expose({parseText})