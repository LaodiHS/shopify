export function replaceSpacesWithUnderscore(str) {
  return str.replace(/ /g, "_");
}

export function updateObject(obj_) {
  return { ...obj_ };
}
export const shortenText = (text) =>
  text && text.length > 20 ? text.substring(0, 30) + "..." : text;