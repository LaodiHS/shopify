import { useState, useEffect, useRef } from "react";

export function GetElementWidth() {
  const [cardWidth, setCardWidth] = useState(null);
  const cardWidthRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (cardWidthRef.current) {
        setCardWidth(cardWidthRef.current.offsetWidth);
        console.log("cardWidth: " + cardWidthRef.current.offsetWidth);
      }
    };

    if (!DEPLOYMENT_ENV) {
      // If you want to add window resize listener, uncomment the lines below:
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    } else {
      const timeout = setTimeout(() => {
        handleResize();
      }, 300);

      return () => clearTimeout(timeout); // Cleanup timeout on component unmount
    }
  }, []);

  return cardWidthRef;
}
