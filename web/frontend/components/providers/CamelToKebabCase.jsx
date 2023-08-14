export function CamelToKebabCase({ text }) {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}
