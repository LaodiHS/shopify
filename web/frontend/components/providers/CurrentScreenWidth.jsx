import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import { useDataProvidersContext } from ".";



export function useCurrentScreenWidth() {
  const [refArray, setRefArray] = useState({});
  const { eventEmitter } = useDataProvidersContext();

  useEffect(() => {
    const handleResize = (event) => eventEmitter.emit("windowResizeSize", event);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      eventEmitter.removeListener("windowResizeSize", handleResize);
    };
  }, [eventEmitter]);

  return {
    getCardRef: (ref, index) => {
      setRefArray((prev) => ({ ...prev, [index]: ref }));
    },
    GetFontSize: ({ index, Element }) => {
      if (!Element) return null;

      const [fontSize, setFontSize] = useState(null);

      useEffect(() => {
        const ref = refArray[index];

        if (ref) {
          setFontSize(Math.floor((10 / 100) * ref.offsetWidth));

          const handleResize = (windowInnerWidth) => {
            if (ref) {
              const font = Math.floor((10 / 100) * ref.offsetWidth) + "px";
              setFontSize(font);
            }
          };

          eventEmitter.on("windowResizeSize", handleResize);

          return () => {
            eventEmitter.removeListener("windowResizeSize", handleResize);
          };
        }
      }, [index, refArray, eventEmitter]);

      return (
        <>
          {React.cloneElement(Element, { style: { ...Element.props.style, fontSize } })}
        </>
      );
    },
  };
}


export function screenWidthElements() {
  return {
    useCurrentScreenWidth,
    getCardRef,
    getFontSize,
  };
}
