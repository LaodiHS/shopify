export function darkenHexColor(hex, factor) {
    // Remove the '#' if it exists
    hex = hex.replace(/^#/, "");
  
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // Apply the factor to darken the color
    const darkenedR = Math.floor(r * factor);
    const darkenedG = Math.floor(g * factor);
    const darkenedB = Math.floor(b * factor);
  
    // Convert back to hex
    const darkenedHex = `#${darkenedR.toString(16).padStart(2, "0")}${darkenedG
      .toString(16)
      .padStart(2, "0")}${darkenedB.toString(16).padStart(2, "0")}`;
  
    return darkenedHex;
  }