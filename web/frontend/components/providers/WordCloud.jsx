import React, { useEffect, useRef, useState } from "react";
import cloud from "d3-cloud";
import * as d3 from "d3";
import debounce from "lodash.debounce";
import { IonRow, IonCol, IonButton, IonText } from "@ionic/react";
import { beehive, honeyPot } from "../../assets";

import tinycolor from "tinycolor2";
import { useDataProvidersContext, InformationIcon,DocumentImagery } from "../";

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
function RandomColor(baseColor) {
  const base = tinycolor(baseColor);

  // Generate random adjustments
  const randomHueAdjustment = Math.floor(Math.random() * 360); // Random hue adjustment between 0 and 360
  const randomLightnessAdjustment = Math.floor(Math.random() * 2) - 10; // Random lightness adjustment between -10 and 10
  const randomSaturationAdjustment = Math.floor(Math.random() * 2) - 10; // Random saturation adjustment between -10 and 10

  // Adjust hue, saturation, and lightness to create a honey-themed color
  const honeyColor = base
    .spin(randomHueAdjustment) // Adjust hue with random value
    .lighten(randomLightnessAdjustment) // Adjust lightness with random value
    .saturate(randomSaturationAdjustment) // Adjust saturation with random value
    .toString();

  return honeyColor;
}
function createScalerForWords(words) {
  return d3
    .scaleSqrt()
    .domain([
      1,
      d3.max(
        words.map((d) => {
          return d.value;
        })
      ),
    ])
    .range([6, 82]);
}
const colorMap = {};
colorMap.NOUN = "#67001f";
colorMap.PROPN = "#67001f";
colorMap.ADJ = "#878787";
colorMap.VERB = "#996600";
colorMap.ADV = "#d6604d";
function wordsFromTextNLP(doc, its) {
  const tokensFTByPoS = {};
  tokensFTByPoS.NOUN = {};
  tokensFTByPoS.ADJ = {};
  tokensFTByPoS.VERB = {};
  tokensFTByPoS.ADV = {};
  tokensFTByPoS.PROPN = {};

  doc.tokens().each((t) => {
    const pos = t.out(its.pos);
    const token = t.out(its.lemma);
    if (!tokensFTByPoS[pos]) return;

    tokensFTByPoS[pos] = tokensFTByPoS[pos] || {};
    tokensFTByPoS[pos][token] = tokensFTByPoS[pos][token] || {};
    tokensFTByPoS[pos][token].value =
      1 + (tokensFTByPoS[pos][token].value || 0);
    tokensFTByPoS[pos][token].sentences =
      tokensFTByPoS[pos][token].sentences || new Set();
    tokensFTByPoS[pos][token].sentences.add(t.parentSentence().index());
  });

  let freqTable = new Array();
  for (const pos in tokensFTByPoS) {
    freqTable = Object.keys(tokensFTByPoS[pos])
      .map((key) => ({
        text: key,
        value: tokensFTByPoS[pos][key].value,
        pos: pos,
        sentences: Array.from(tokensFTByPoS[pos][key].sentences),
      }))
      .filter((e) => e.value > 1 && e.text.length > 2)
      .concat(freqTable);
  } // for ( const pos in tokensFTByPoS )

  return freqTable.sort((a, b) => b.value - a.value);
}
function generateWordCloud(layout, svgRef, svgContainer, words) {
  const ScaleFontValueToRange = createScalerForWords(words);
  const width = svgContainer.current.offsetWidth;

const computedHeight = words.length * 4.75
const height = computedHeight < 200 ? 200 : computedHeight;
  layout
    .size([width, height])
    .words(words)
    .padding(7)
    .rotate(0)
    .fontSize((d) => ScaleFontValueToRange(d.value))
    .on("end", draw);

  layout.start();

  function draw(words) {
    const svg = d3.select(svgRef.current);
  
    svg
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
      .append("g")
      .attr(
        "transform",
        `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
      )
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")

      .style("font", (d) => d.font)
      .style("font-size", (d) => `${ScaleFontValueToRange(d.value)}px`)
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .style(
        "fill",
        (d) =>
          generateComplementaryColor(RandomColor(colorMap[d.pos])) || "black"
      )
      // .attr("key",(d) => d.text  )
      .attr("text-anchor", "middle")
      .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text((d) => d.text);
  }
}

function updateWordCloud(layout, svgRef, words) {
  console.log("updateWordCloud");

  // Use the new data to generate the new word cloud layout
  const ScaleFontValueToRange = createScalerForWords(words);
  layout.words(words);
  layout.start();

  // Select all text elements inside the SVG
  const textElements = d3
    .select(svgRef.current)
    .selectAll("text")

    .data(layout.words(), (d) => d.text)
    .exit()
    .remove()
    .on("end", function () {});

  d3.select(svgRef.current)
    .selectAll("text")
    .attr("opacity", 0)
    .attr(
      "transform",
      (d) =>
        "translate(" +
        [d.x * ~~(Math.random() * 2) * 90, d.y * ~~(Math.random() * 2) * 90] +
        ")rotate(" +
        d.rotate +
        ")"

    )
    .text((d) => d.text)
    .transition()
    .attr("opacity", 1)
    .attr(
      "transform",
      (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"
    )
    .duration(1500);
}

export function WordCloud({ text, doc, its, checkFeatureAccess }) {
  const { DataProviderNavigate } = useDataProvidersContext();

  const [layout, setLayout] = useState(cloud());
  const [initialGraph, setInitialGraph] = useState(false);
  const [importantIdeas, setImportantIdeas] = useState([])
  const svgRef = useRef(null);
  const svgContainer = useRef(null);
 

  if (!checkFeatureAccess(["acacia"])?.hasAccess) {
    return (
      <IonRow className="">
        <IonCol size="12" className="ion-text-center">
          <IonText color="neural" className="ion-text-capitalize">
            <IonButton
              fill="clear"
              color="shoe"
              onClick={(e) => DataProviderNavigate("/subscriptions")}
            >
             Quickly Visualize The Most Important Ideas In Your Document
            </IonButton>

          </IonText>
        </IonCol>
        <IonCol
          onClick={(e) => DataProviderNavigate("/subscriptions")}
          style={{
            backgroundImage: `url(${beehive})`,
            height: "100px",
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
          className="ion-align-items-center ion-text-center ion-text-capitalize"
          size="12"
        ></IonCol>
        <IonCol className="ion-text-center ion-text-capitalize">
          <IonButton
            fill="clear"
            color="shoe"
            onClick={(e) => DataProviderNavigate("/subscriptions")}
          >
            Available with acacia honey membership
          </IonButton>
        </IonCol>
      </IonRow>
    );
  }

  useEffect(() => {
    const words = wordsFromTextNLP(doc, its);
    setImportantIdeas(words)
    // console.log('words',words)
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("g").remove();
        generateWordCloud(layout, svgRef, svgContainer, words);
      }, 200); // Delay to ensure resizing is complete
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!initialGraph) {
            generateWordCloud(layout, svgRef, svgContainer, words);
            window.addEventListener("resize", handleResize);
            observer.disconnect(); // Stop observing once it comes into view
            setInitialGraph(true);
          } else {
       
       //     updateWordCloud(layout, svgRef, words);
            // updateWordCloud(layout, svgRef, words)
            const deb = debounce(
              (e) => updateWordCloud(layout, svgRef, words),
              1000
            );
            deb();
          }
        }
      },
      { rootMargin: "0px 0px 200px 0px" } // Adjust the rootMargin as needed
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    return () => {
      observer.disconnect(); // Make sure to clean up the observer
      // window.removeEventListener("resize", handleResize);
      if (svgRef.current) {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
      }
    };
  }, [text]);



  return (
    <>
      <InformationIcon label="Key Concepts in Your Document" id="word-cloud-seo-tools" content="These words not only capture the most frequently used terms in your document, but they also provide a visual representation of the key concepts that strongly resonate with your reader. They encapsulate the core essence of the document in vivid mental imagery" />
       <IonCol size="12" className="ion-text-center ion-text-capitalize">
       {/* <DocumentImagery text={text} />      */}
      </IonCol>
      <IonCol
        className={
          `ion-text-center ion-text-capitalize ${importantIdeas.length
            ? " ion-hide"
            : ""}`
        }
        size="12"
      >
        <IonText className="ion-text-center" color="warning">There is currently not enough data in your document.</IonText>
      </IonCol>
      <IonCol
        key="svgContainer"
        ref={svgContainer}
        className="ion-align-items-center"
        size="12"
      >
        <svg key="svg" ref={svgRef} style={{ width: "100%", height: "100%", minHeight:"283.3px" }} />
      </IonCol>
    </>
  );
}
