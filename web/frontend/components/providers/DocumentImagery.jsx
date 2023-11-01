import model from "wink-eng-lite-web-model";
import winkNLP from "wink-nlp";
// import cloud from "d3-cloud";
// import * as d3 from "d3";

// import ner from 'wink-ner';
import React, { useEffect, useRef, useState } from "react";

// import {winkTokenixer} from "wink-tokenizer";
import {
  // IonRow,
  IonCol,

  // IonButton, IonText
} from "@ionic/react";

// import debounce from "lodash.debounce";

// import { useDataProvidersContext, InformationIcon } from "..";
// var tokenize = winkTokenizer().tokenize;

const nlp = winkNLP(model);
// Obtain "its" helper to extract item properties.
const its = nlp.its;
// Obtain "as" reducer helper to reduce a collection.
const as = nlp.as;
// var myNER = ner();
const patterns = [
  {
    name: "nounPhrase",
    patterns: ["[PROPN] [|PROPN] [|PROPN] [|PROPN]"],
  },
  {
    name: "nounPhrase",
    patterns: ["[PROPN] [ADJ|PROPN] [|PROPN] [|PROPN]"],
  },
  {
    name: "nounPhrase",
    patterns: ["[PROPN|ADJ] [PROPN]"],
  },
  {
    name: "nounPhrase",
    patterns: ["[PROPN] [CARDINAL]"],
  },
  {
    name: "simpleADJ",
    patterns: ["[ADJ]"],
  },
  {
    name: "creativeNounPhrase",
    patterns: ["[ADJ] [NOUN]"],
  },
  {
    name: "verbPhrase",
    patterns: ["[VERB] [NOUN]"],
  },
  {
    name: "colorfulDescription",
    patterns: ["[ADJ] and [ADJ] [NOUN]"],
  },

  {
    name: "uniqueIdentifier",
    patterns: ["[NOUN] [CARDINAL]"],
  },
  {
    name: "emotionalPhrase",
    patterns: ["[ADJ] and [ADJ] [NOUN] that brings [EMOTION] to [NOUN]"],
  },
  {
    name: "brandModel",
    patterns: ["[PROPN] [PROPN|NUM]?"],
  },
  {
    name: "keyFeature",
    patterns: ["[ADJ] [NOUN]"],
  },
  {
    name: "material",
    patterns: ["[NOUN] with [NOUN] [|NOUN] [NOUN] [|NOUN]"],
  },
  {
    name: "featureDescription",
    patterns: ["[ADJ] [NOUN] with [NOUN] [|NOUN]"],
  },
  {
    name: "productName",
    patterns: ["[NOUN] [PROPN]"],
  },

  {
    name: "productName",
    patterns: ["[PROPN]"],
  },
];

const patternCount = nlp.learnCustomEntities(patterns, {
  matchValue: false,
  useEntity: true,
  usePOS: true,
});

function rankResults(results, term) {
  // Define a scoring function based on different factors
  const scoreResults = (result) => {
    let score = 0;

    // Example: Give higher score if term is in the title
    if (result.title.toLowerCase().includes(term.toLowerCase())) {
      score += 10;
    }

    // Example: Give higher score if term is in the snippet
    if (result.snippet.toLowerCase().includes(term.toLowerCase())) {
      score += 5;
    }

    // Add more factors and adjust scoring as needed

    return score;
  };

  // Apply scoring function to each result
  const rankedResults = results.map((result) => ({
    ...result,
    score: scoreResults(result),
  }));

  // Sort the results based on the scores in descending order
  rankedResults.sort((a, b) => b.score - a.score);

  return rankedResults;
}

function findBestMatch(ri, e, text) {
  let index = null;
  if (ri.query.searchinfo.totalhits === 0) return index;
  if (e.out(its.type) === "simpleADJ" && !e.out(its.value).match(/^[A-Z]/))
    return index;

  const term = e.out(its.normal);
  const termRegex = new RegExp(term, "i");

  // Extract a snippet of text around the matched term for contextual analysis
  const termIndex = text.toLowerCase().indexOf(term.toLowerCase());
  const snippetStart = Math.max(termIndex - 50, 0); // Start 50 characters before the term
  const snippetEnd = Math.min(termIndex + term.length + 50, text.length); // End 50 characters after the term
  const snippet = text.substring(snippetStart, snippetEnd);

  // Analyze the snippet for additional context
  if (snippet.match(termRegex)) {
    for (let k = 0; k < ri.query.search.length; k += 1) {
      const riqsk = ri.query.search[k];
      if (riqsk.title.match(termRegex) || riqsk.snippet.match(termRegex))
        return { pageid: riqsk.pageid, title: riqsk.title };
    }
  }

  return null;

  const rgx = RegExp(e.out(its.normal).split(/\s+/).join("|"), "i");
  for (let k = 0; k < ri.query.search.length; k += 1) {
    const riqsk = ri.query.search[k];
    if (riqsk.title.match(rgx) || riqsk.snippet.match(rgx))
      return { pageid: riqsk.pageid, title: riqsk.title };
  }
  return null;
}

async function getImage(term) {
  const url = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=pageimages&pithumbsize=200&titles=${term}`;
  const response = await fetch(url); // d3.json
  if (!response.ok) {
    throw response.statusText;
  }

  return response.json();
}

async function searchAllTerms(terms) {
  const allResults = [];
  for (var i = 0; i < terms.length; i += 1) {
    //   Promises.delay(30); // Be nice to Wikipedia
    const r = await search(terms[i]);
    allResults.push(r);
  }
  return allResults;
}

async function search(term) {
  console.log("term: ", term);
  const url = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&list=search&srsearch=${term}`;
  const response = await fetch(url); // d3.json
  if (!response.ok) {
    throw response.statusText;
  }

  return response.json();
}

async function imageCloud(text) {
  const doc = nlp.readDoc(text);

  const potentialEntities = doc.customEntities().out();

  const results = await searchAllTerms(potentialEntities); // return results;
  let images = [];

  for (let i = 0; i < potentialEntities.length; i += 1) {
    const e = doc.customEntities().itemAt(i);
    const match = findBestMatch(results[i], e, text);
    if (match !== null) {
      e.markup(
        `<a href="https://en.wikipedia.org/wiki?title=${match.title}" title="${match.title}" className="demo"><b>, </b></a>`
      );
      const image = (await getImage(match.title)).query.pages[match.pageid]
        .thumbnail;

      image
        ? images.push(
            <figure key={i + image.source}>
              <img key={image.source} src={image.source} title={match.title} />
              <figcaption key={i + "figure caption"}>{match.title}</figcaption>
            </figure>
          )
        : "";
    }
  }

  return images;
  return (
    <>
      <div className="container">{doc.out(its.markedUpText)}</div>
      {images}
    </>
  );
}

export function DocumentImagery({ text }) {
  const [minWidth, setMinWidth] = useState("300px");
  const [images, setImages] = useState([]);

  useEffect(async () => {
    const displayImages = await imageCloud(text);
    console.log("displayImages", displayImages);

    setImages(displayImages);
  }, [text]);

  const maxWidth = "100px";
  const minHeight = "300px";

  return (
    <IonCol
      style={{
        display: "grid",
        gridGap: "5px",
        gridTemplateColumns: `repeat( auto-fill, minmax${minWidth}, ${maxWidth})`,
        gridTemplateRows: `minmax(${minHeight}, auto)`,
        gridAutoFlow: "column",
        margin: `0 auto`,
      }}
    >
      {images}
    </IonCol>
  );
}
