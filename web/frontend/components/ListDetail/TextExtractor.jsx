// import React, { useState } from "react";
// import natural from "natural";
import he from "he"
// export function extractKeywords (text) {
//     const tokenizer = new natural.WordTokenizer();
//     const tokenizedText = tokenizer.tokenize(text);

//     const stopWords = new Set(natural.stopwords);

//     const filteredTokens = tokenizedText.filter(
//       (word) => !stopWords.has(word.toLowerCase())
//     );

//     const fdist = new natural.FreqDist(filteredTokens);

//     const stemmer = natural.PorterStemmer;

//     const tfidfScores = {};
//     filteredTokens.forEach((word) => {
//       const stemmedWord = stemmer.stem(word);
//       tfidfScores[word] = (fdist.get(word) / filteredTokens.length) * (filteredTokens.length / fdist.N(stemmedWord));
//     });

//     const sortedKeywords = Object.keys(tfidfScores).sort(
//       (a, b) => tfidfScores[b] - tfidfScores[a]
//     );

//   return sortedKeywords;
// };

// export function KeyWordExtractorDisplay(textInput){
//  const sortedKeywords =  extractKeywords(textInput)

//   const [text, setText] = useState("");
//   const [keywords, setKeywords] = useState([]);
//   const topKeywords = sortedKeywords.slice(0, 5);

//     setKeywords(topKeywords);

//   return (
//     <div>
//       <textarea
//         rows={6}
//         cols={50}
//         placeholder="Enter your text here..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />
//       <button onClick={extractKeywords}>Extract Keywords</button>
//       <div>
//         <h3>Keywords:</h3>
//         <ul>
//           {keywords.map((keyword, index) => (
//             <li key={index}>{keyword}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

export function extractTextFromHtml(renderedHtml) {
  const decodedHtml = he.decode(renderedHtml);
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(decodedHtml, "text/html");

  const text = doc.body.textContent;

  return text.trim();
}

// export function IdentifySubheadings(text) {
//   extractedKeywords =KeywordExtractor(text)
//     const sentences = text.split('.'); // Sentence segmentation (simplified)

//     const sentenceScores = sentences.map((sentence) => {
//       const words = sentence.split(' '); // Word tokenization (simplified)
//       const score = words.filter((word) => extractedKeywords.includes(word)).length;
//       return { sentence, score };
//     });

//     const promisingSentences = sentenceScores.filter((s) => s.score > 0);

//     const subheadingGroups = [];
//     let currentGroup = [];

//     for (const sentence of promisingSentences) {
//       if (currentGroup.length === 0) {
//         currentGroup.push(sentence);
//       } else if (sentence.score > 0) {
//         currentGroup.push(sentence);
//       } else if (currentGroup.length > 0) {
//         subheadingGroups.push([...currentGroup]);
//         currentGroup = [];
//       }
//     }

//     const subheadings = subheadingGroups.map((group) => {
//       // Choose the most representative sentence in the group
//       const bestSentence = group.reduce((a, b) => (a.score > b.score ? a : b));
//       return bestSentence.sentence;
//     });

//     return subheadings;
//   }

//   const inputText = "Your input text here...";
//   const extractedKeywords = ["keyword1", "keyword2", "keyword3"];

//   const subheadings = identifySubheadings(inputText, extractedKeywords);
//   console.log(subheadings);

//   function breakDownSections(text, extractedKeywords) {
//     const subheadings = identifySubheadings(text, extractedKeywords);

//     const contentBreakdown = {};

//     for (let i = 0; i < subheadings.length; i++) {
//       const subheading = subheadings[i];
//       const subheadingContent = subheading.split(':')[1]; // Extract content after colon (simplified)
//       const sentences = subheadingContent.split('.'); // Sentence segmentation (simplified)

//       const subheadingBreakdown = [];

//       for (const sentence of sentences) {
//         const words = sentence.split(' '); // Word tokenization (simplified)
//         const score = words.filter((word) => extractedKeywords.includes(word)).length;

//         if (score > 0) {
//           subheadingBreakdown.push(`• ${sentence}`); // Use bullet points
//         }
//       }

//       contentBreakdown[subheading] = subheadingBreakdown;
//     }

//     return contentBreakdown;
//   }

//   const inputText = "Your input text here...";
//   const extractedKeywords = ["keyword1", "keyword2", "keyword3"];

//   const sectionsBreakdown = breakDownSections(inputText, extractedKeywords);
//   console.log(sectionsBreakdown);
