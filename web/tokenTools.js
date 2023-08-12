import natural from "natural";

export function countTokens(text) {
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text);
    return tokens.length;
  }
  