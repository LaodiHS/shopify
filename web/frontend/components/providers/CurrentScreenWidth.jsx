import { debounce } from "lodash";
import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useMemo,
  useImperativeHandle,
  useCallback
} from "react";
import { useDataProvidersContext } from ".";

export function useCurrentScreenWidth() {
  const [refArray, setRefArray] = useState({});
  const [globalFontSize, setGlobalFontSize] = useState(null);
  const { eventEmitter } = useDataProvidersContext();

  useEffect(() => {
    const handleResize = (event) =>
    eventEmitter.emit("windowResizeSize", event);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      eventEmitter.removeListener("windowResizeSize", handleResize);
    };
  }, []);
  const debouncedSetRefArray = useCallback(
    debounce((newRefArray) => {
      setRefArray(newRefArray);
    }, 100), // Adjust the debounce delay as needed
    []
  );
  return {
    getCardRef: (ref, index) => {
      debouncedSetRefArray((prev) => ({ ...prev, [index]: ref }));
    },
    GetFontSize: ({ index, Element }) => {
       if (!Element) return null;
      const [localFontSize, setLocalFontSize] = useState(globalFontSize)
      useEffect(() => {
        const ref = refArray[index];

        if (ref) {
          const fontSize = Math.floor((10 / 100) * ref.offsetWidth);

          if (!globalFontSize && fontSize) {
            const font = fontSize + "px";
  
            setGlobalFontSize(font);
            setLocalFontSize(font);
          }
          const handleResize = (windowInnerWidth) => {
            if (ref) {
              const fontSize = Math.floor((10 / 100) * ref.offsetWidth);
        
              if (fontSize && fontSize + "px" !== globalFontSize) {
                const font = fontSize + "px";
                setGlobalFontSize(font);
                setLocalFontSize(font)
              }
            }
          };

          eventEmitter.on("windowResizeSize", handleResize);

          return () => {
            eventEmitter.removeListener("windowResizeSize", handleResize);
          };
        }
      }, [refArray]);
      if (!localFontSize) {
        return null;
      }

      return <DynamicFontElement Element={Element} fontSize={localFontSize} />;
    },
  };
}
function DynamicFontElement({ Element, fontSize }) {
  const memoizedElement = useMemo(() => {


  return React.cloneElement(Element, {
    style: { ...Element.props.style, key: "dynamicFontSize", fontSize },
  });
  }, [Element, fontSize]);

  return memoizedElement;
}

export function screenWidthElements() {
  return {
    useCurrentScreenWidth,
    getCardRef,
    getFontSize,
  };
}
