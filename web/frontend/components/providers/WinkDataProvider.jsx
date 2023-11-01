
import winkNLP from "wink-nlp";
// import ner from "wink-ner";
import model from "wink-eng-lite-web-model";

import React, { createContext, useState, useEffect, useContext } from "react";
// import cloud from "d3-cloud";
// import * as d3 from "d3";

// import { winkTokenixer } from "wink-tokenizer";


import { extractTextFromHtml } from "./";


// import * as distanceJaro from "jaro-winkler";

import tinycolor from "tinycolor2";

// import { navigate } from "ionicons/icons";
// import { darkenHexColor } from "../../utilities/darkenHexColor";
const nlp = winkNLP(model);
// Obtain "its" helper to extract item properties.
const its = nlp.its;
// Obtain "as" reducer helper to reduce a collection.
const as = nlp.as;
// var myNER = ner();

function generateComplementaryColor(baseColor) {
  const base = tinycolor(baseColor);
  base
    .spin(30) // Adjust hue
    .lighten(10) // Adjust lightness
    .saturate(30) // Adjust saturation
    .toString();
  const complementary = base.toHexString();
  return complementary;
}
const patternDictionary = {
  meta_tag_patterns:  [
    {
      name: "productType",
      patterns: ["[NOUN]"],
    },
    {
      name: "material",
      patterns: ["[NOUN]"],
    },
    {
      name: "color",
      patterns: ["[ADJ]"],
    },
    {
      name: "size",
      patterns: ["[ADJ]"],
    },
    {
      name: "style",
      patterns: ["[ADJ]"],
    },
    {
      name: "season",
      patterns: ["[NOUN]"],
    },
    {
      name: "occasion",
      patterns: ["[ADJ] [NOUN]"],
    },
    {
      name: "trend",
      patterns: ["[ADJ]"],
    },
    {
      name: "collection",
      patterns: ["[PROPN]"],
    },
    {
      name: "brand",
      patterns: ["[PROPN]"],
    },
    {
      name: "newArrivals",
      patterns: ["[ADJ] [NOUN]"],
    },
    {
      name: "bestSellers",
      patterns: ["[ADJ] [NOUN]"],
    },
    {
      name: "discounted",
      patterns: ["[ADJ]"],
    },
    {
      name: "limitedEdition",
      patterns: ["[ADJ] [NOUN]"],
    },
    {
      name: "featured",
      patterns: ["[ADJ]"],
    },
    {
      name: "genderAgeGroup",
      patterns: ["[NOUN]"],
    },
    {
      name: "usage",
      patterns: ["[ADJ] [NOUN]"],
    },
    {
      name: "compatibility",
      patterns: ["[NOUN]"],
    },
    {
      name: "region",
      patterns: ["[PROPN]"],
    },
    {
      name: "giftIdeas",
      patterns: ["[NOUN] [NOUN]"],
    },
  ]
};

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


function getGradeAndSummary(score) {
  const ranges = [
    {
      min: 90,
      max: 100,
      grade: "5th grade",
      summary: "Very easy to read",
      ageRange: "Ages 10 and above",
      tip: "Ideal for reaching a broad audience, including young readers and those with lower reading levels. Use this content to introduce your product or service to a wide range of potential customers.",
    },
    {
      min: 80,
      max: 89,
      grade: "6th grade",
      summary: "Easy to read",
      ageRange: "Ages 11 and above",
      tip: "Well-suited for general audiences. Consider using this content for blog posts, informative articles, and introductory marketing materials to effectively promote your product, goods, or services.",
    },
    {
      min: 70,
      max: 79,
      grade: "7th grade",
      summary: "Fairly easy to read",
      ageRange: "Ages 12 and above",
      tip: "Great for reaching a slightly older audience. This level of content is suitable for blog posts, informative articles, and marketing materials targeting teenagers and young adults, helping you connect with your target market.",
    },
    {
      min: 60,
      max: 69,
      grade: "8th & 9th grade",
      summary: "Plain English",
      ageRange: "Ages 13 and above",
      tip: "Provides clear and straightforward communication. Use this content for in-depth articles, reports, and materials targeting a more mature audience, enabling you to convey the value of your product, goods, or services effectively.",
    },
    {
      min: 50,
      max: 59,
      grade: "10th to 12th grade",
      summary: "Fairly difficult to read",
      ageRange: "Ages 15 and above",
      tip: "Best suited for content aimed at high school students and above. Consider using this level for technical articles, advanced educational materials, and specialized marketing campaigns to showcase the unique features and benefits of your offering.",
    },
    {
      min: 30,
      max: 49,
      grade: "College",
      summary: "Difficult to read",
      ageRange: "Ages 18 and above",
      tip: "Targeting a college-educated audience is recommended for this level. Use this content for whitepapers, research reports, and specialized marketing materials to highlight the expertise and quality of your product, goods, or services.",
    },
    {
      min: 10,
      max: 29,
      grade: "College graduate",
      summary: "Very difficult to read",
      ageRange: "Ages 22 and above",
      tip: "Content at this level is best suited for professionals and academics. Utilize this for highly technical reports, industry-specific materials, and expert-level content to establish your product, goods, or services as a trusted authority in the field.",
    },
    {
      min: 0,
      max: 9,
      grade: "Professional",
      summary: "Extremely difficult to read",
      ageRange: "Ages 25 and above",
      tip: "Reserved for expert-level content and specialized industries. Ensure your audience has a high level of expertise in the subject matter before using this level of content for marketing purposes. This content can serve to reinforce your product, goods, or services' position as a top-tier solution in your industry.",
    },
  ];
}

function getSentimentSummary(score) {
  if (score >= 0.8) {
    return {
      val: "Inspiring - Consider the Impact.",
      color: tinycolor("MediumTurquoise").toHexString(),
      status: "inspiring",
      score: score,
    };
  } else if (score >= 0.6) {
    return {
      val: "Positive - Embrace the Potential.",
      color: tinycolor("MediumSeaGreen").toHexString(),
      status: "positive",
      score: score,
    };
  } else if (score >= 0.4) {
    return {
      val: "Hopeful Sentiment - Seek Growth.",
      color: tinycolor("Tomato").toHexString(),
      status:"hopeful",
      score: score,
    };
  } else if (score >= 0.2) {
    return {
      val: "Lacks Focus - Reflect On Choices.",
      color: tinycolor("DarkSlateGray").toHexString(),
      status: "lacks focus",
      score: score,
    };
  } else if (score > 0) {
    return {
      val: "Cautious Sentiment - Be Mindful Of Your Audience.",
      
      color: tinycolor("DarkOrange").toHexString(),
      status:"faulty",
      score: score,
    };
  } else if (score > -0.2) {
    return {
      val: "Concerning Issues In This Document - Reevaluate.",
      color: tinycolor("FireBrick").toHexString(),
      status:"concerning",
      score: score,
    };
  } else if (score > -0.4) {
    return {
      val: "Serious Issues In This Document - Address Issues.",
      color: tinycolor("IndianRed").toHexString(),
      status:"contains serious issues",
      score: score,
    };
  } else if (score > -0.6) {
    return {
      val: "Urgent Issues In This Document - Take Precautions.",
      color: tinycolor("LightCoral").toHexString(),
      status:"Urgent Issues",
      score: score,
    };
  } else if (score > -0.8) {
    return {
      val: "Overhaul This Document - Assess the Situation.",
      color: tinycolor("Red").toHexString(),
      status:"Overhaul",
      score: score,
    };
  } else {
    return {
      val: "Destructive - Reconsider Choices.",
      color: tinycolor("DarkRed").toHexString(),
      status:"Destructive",
      score: score,
    };
  }
}

const WinkDataContext = createContext(null);

export function useWinkDataContext() {
  return useContext(WinkDataContext);
}

function modifyState(setter, updateOptions) {
  return setter((prevState) => {
    if (typeof updateOptions === "function") {
      return updateOptions(prevState);
    } else {
      return updateOptions;
    }
  });
}
// function fuzzyMatcher() {
//   var distance = distanceJaro;

//   distance("MARTHA", "MARHTA");
//   // 0.961

//   distance("DWAYNE", "DUANE");
//   // 0.84

//   distance("DIXON", "DICKSONX");
//   // 0.814

//   // Case Insensitive

//   distance("MARTHA", "MARTHA");
//   // 1

//   distance("mArThA", "MaRtHa", { caseSensitive: false });
//   // 1
// }




function matcherWords(words) {
  // Create a matcher with a list of values
  var m = new Matcher("init install update upgrade");
  // typeo safty
  // Get the closest match
  m.get("udpate"); // 'update'

  // Set the threshold (the maximum Levenshtein distance)
  m.setThreshold(3);

  // List all matches
  m.list("udpate"); // [ { value: 'update', distance: 2 }, { value: 'upgrade', distance: 3 } ]

  // Set ignore case
  m.ignoreCase();

  // Set match case
  m.matchCase();

  // Add more values
  m.add("merge", "checkout", "commit");
}



    const patternCount = nlp.learnCustomEntities(
      patternDictionary.meta_tag_patterns,
      {
        matchValue: false,
        useEntity: true,
        usePOS: true,
      }
    );



function cardDataStats(text) {

  const doc = nlp.readDoc(extractTextFromHtml(text));

return {  readabilityStats,metaTagPMatchTextPercent};
  
  function readabilityStats() {
    const readability = doc.out(its.readabilityStats);
    // console.log("readability stats", readability);

    return {
      sentiment: getSentimentSummary(readability.sentiment),
      complexity: readability.numOfComplexWords,
      getGradeAndSummary: getGradeAndSummary(readability.fres),
    };
  }

  function metaTagPMatchTextPercent(metaTags) {
    if (!text || !metaTags.length) return 0;



    if(patternCount === 0) return 0;

    const potentialEntities = doc.customEntities().out().map(met=> met.toLowerCase());

    if(potentialEntities.length === 0) return 0;
  
    const meta = [...new Set(metaTags)].map(met=> met.toLowerCase()); 
    
    // console.log("potenal:  ", potentialEntities);
    // console.log("meta: ", meta);
    
    const len = meta.length;

    const result = meta.filter((x) =>
      potentialEntities.find((y) => y.includes(x))
    );

    const percentage = (result.length / meta.length) ;

    return Number.parseFloat(percentage).toFixed(2) * 100;
  }
}



function getColor(value) {
  //value from 0 to 1



  var hue = ((1 - (1 - value) ) * 120).toString(10);
  const color = ["hsl(", hue, ",100%,50%)"].join("");
  const darken =   tinycolor(color).darken(10);
 //return darken.toHexString()
  return darken;
//  const hex =  tinycolor(color).toHexString()
//  console.log('hex: ', hex)
//  const dark = darkenHexColor(hex, 3)
//  console.log('dark: ', dark)
//  return dark;
}
export function WinkDataProvider({ children }) {
  function aiWorkStationSetter(category) {
    modifyState(setAiWorkStation, category);
  }

  useEffect(() => {
    // metaTagPMatchTextPercentage(
    //   "hello sir, i like shoes and. Thank you for reading.",
    //   ["shoes", "cars", "butts"]
    // );




  }, []);

  //   function TooWordy(){

  //     const data = complexity(extractTextFromHtml(text));
  //     // console.log(data);
  //     return data;

  //   }

  //  const importance = doc
  //     .out(its.sentenceWiseImportance)
  //     .map((e) => e.importance);

  const value = {
    cardDataStats,
    getColor,
    generateComplementaryColor,
    nlp,
    its,
    as

  };

  return (
    <WinkDataContext.Provider value={value}>
      {children}
    </WinkDataContext.Provider>
  );
}
