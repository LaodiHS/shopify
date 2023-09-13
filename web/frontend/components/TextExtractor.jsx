import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonSkeletonText,
  IonRow,
  IonCol,
  IonLabel,
  IonList,
  IonItem,
  IonText,
} from "@ionic/react";

import "chartist/dist/index.css";
import { LineChart, BarChart, Svg, getMultiValue } from "chartist";
import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model";
import { extractTextFromHtml } from "./providers/ReactRenderingComponent";
const nlp = winkNLP(model);
// Obtain "its" helper to extract item properties.
const its = nlp.its;
// Obtain "as" reducer helper to reduce a collection.
const as = nlp.as;

// doc.entities().each((e) => e.markup());

export function BarChartComponent({ text }) {
  const chartRef = useRef(null);
  const legendRef = useRef(null);

  useEffect(() => {
    if (text) {

      function createBarChart(){
      let doc = nlp.readDoc(extractTextFromHtml(text));

      const sentenceSentiment = doc.sentences().out(its.sentiment);

      const chart = new BarChart(
        chartRef.current,
        {
      
          series: [sentenceSentiment],
        },
        {
          hight: 1,
          low: -1,
          axisX: {
            labelInterpolationFnc: (value, index) => {
          
          return index;
              // return index % 2 === 0 ? value : null;
              // Return the label you want for the x-axis
              // console.log("value", value);
          
            },
          },
          // stackBars: true,
          axisY: {
            labelInterpolationFnc: (value) => {
              // Return the label you want for the y-axis
              return +value;
            },
          },
        }
      );

      let seq = 0;
      const delays = 80;
      const durations = 500;

      chart.on("draw", (data) => {
        seq++;

        if (data.type === "label" && data.axis.counterUnits.pos === "x") {
          data.element.animate({
            y: {
              begin: seq * delays,
              dur: durations,
              from: data.y + 100,
              to: data.y,
              easing: "easeOutQuart",
            },
          });
        } else if (
          data.type === "label" &&
          data.axis.counterUnits.pos === "y"
        ) {
          data.element.animate({
            x: {
              begin: seq * delays,
              dur: durations,
              from: data.x - 100,
              to: data.x,
              easing: "easeOutQuart",
            },
          });
        } else if (data.type === "point") {
          data.element.animate({
            x1: {
              begin: seq * delays,
              dur: durations,
              from: data.x - 10,
              to: data.x,
              easing: "easeOutQuart",
            },
            x2: {
              begin: seq * delays,
              dur: durations,
              from: data.x - 10,
              to: data.x,
              easing: "easeOutQuart",
            },
            opacity: {
              begin: seq * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: "easeOutQuart",
            },
          });

        
        }

        // If this draw event is of type bar we can use the data to create additional content
        if (data.type === "bar") {
          data.element.attr({
            // style: 'stroke-width: 30px'
          });

          // We use the group element of the current series to append a simple circle with the bar peek coordinates and a circle radius that is depending on the value
          data.group.append(
            new Svg(
              "circle",
              {
                cx: data.x2,
                cy: data.y2,
                r: Math.abs(Number(getMultiValue(data.value))) * 9 + 5,
              },
              "ct-slice-pie"
            )
          );
        }
      });
      return chart;
    }
      let chart;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Component is in view, render the chart
            chart = createBarChart(text);
          } else {
            // Component is not in view, detach the chart
            if (chart) {
              chart.detach();
            }
          }
        });
      });

      observer.observe(chartRef.current);
      return () => {
        // Clean up chart on component unmount
        if (chart) {
          chart.detach();
        }

        observer.disconnect();
      };
    }
  }, [text]);

  useEffect(() => {
    // Define legend data
    const legendData = [
      {
        name: "How the sentiment appears as you read the document.",
        className: "ct-series-a",
      },
      {
        name: "X axis: readability score from 0 to 1",
        className: "ct-series-a",
      },

      { name: "Y axis: Sentence", className: "ct-series-d" },
    ];

    // Create legend element
    const legend = document.createElement("ul");
    Object.assign(legend.style,{listStyleType:'none'} )
    legend.classList.add("ct-legend");

    // Populate legend items
    legendData.forEach((data) => {
      const legendItem = document.createElement("li");
      legendItem.classList.add("ct-series", data.className);

      const legendLabel = document.createElement("span");
      legendLabel.innerText = data.name;

      legendItem.appendChild(legendLabel);
      legend.appendChild(legendItem);
    });

    // Append legend to the ref element
    legendRef.current.appendChild(legend);
  }, []);

  return (
    <IonGrid key="BarChartGrid">
      {/* <IonHeader >
        <IonToolbar>
          <IonTitle>Sentiment Flow</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <div>
        <div key="barChartLegend" ref={legendRef}></div>{" "}
        <div key="barChart" ref={chartRef} />
      </div>
    </IonGrid>
  );
}

export function ChartComponent({ text }) {
  const chartRef = useRef(null);
  const legendRef = useRef(null);

  useEffect(() => {
    if (text) {
      function createLineChart(text) {
        let doc = nlp.readDoc(extractTextFromHtml(text));
        const readability = doc.out(its.readabilityStats);

        // console.log("readability stats", readability);

        const importance = doc

          .out(its.sentenceWiseImportance)
          .map((e) => e.importance);
        console.log("importance: ", importance);
        //  console.log('markup: ', doc.out(its.markedUpText));
        doc.entities().each((e) => {
          if (e.out(its.type) === "DATE") console.log(e.out());
        });

        const chart = new LineChart(
          chartRef.current,
          {
            // labels: ["0", "0.1", "0.3", "0.4", "0.5", "0.9", "0.7", "0.8", "0.9", "1"],
            series: [importance],
          },
          {
            low: 0,
            hight: 1,
            axisX: {
              labelInterpolationFnc: (value, index) => {
                // Return the label you want for the x-axis

                return index;
              },
            },
            axisY: {
              labelInterpolationFnc: (value) => {
                // Return the label you want for the y-axis
                return +value;
              },
            },
          }
        );

        let seq = 0;
        const delays = 80;
        const durations = 500;

        chart.on("created", () => {
          seq = 0;
        });

        chart.on("draw", (data) => {
          seq++;

          if (data.type === "line") {
            data.element.animate({
              opacity: {
                begin: seq * delays + 1000,
                dur: durations,
                from: 0,
                to: 1,
              },
            });
          } else if (
            data.type === "label" &&
            data.axis.counterUnits.pos === "x"
          ) {
            // data.element.animate({
            //   y: {
            //     begin: seq * delays,
            //     dur: durations,
            //     from: data.y + 100,
            //     to: data.y,
            //     easing: "easeOutQuart",
            //   },
            // });
          } else if (
            data.type === "label" &&
            data.axis.counterUnits.pos === "y"
          ) {
            // data.element.animate({
            //   x: {
            //     begin: seq * delays,
            //     dur: durations,
            //     from: data.x - 100,
            //     to: data.x,
            //     easing: "easeOutQuart",
            //   },
            // });
          } else if (data.type === "point") {
            data.element.animate({
              x1: {
                begin: seq * delays,
                dur: durations,
                from: data.x - 10,
                to: data.x,
                easing: "easeOutQuart",
              },
              x2: {
                begin: seq * delays,
                dur: durations,
                from: data.x - 10,
                to: data.x,
                easing: "easeOutQuart",
              },
              opacity: {
                begin: seq * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: "easeOutQuart",
              },
            });
          } else if (data.type === "grid") {
            // const pos1Key = data.axis.units.pos + "1";
            // const pos1Value = data[pos1Key];
            // const pos1Animation = {
            //   begin: seq * delays,
            //   dur: durations,
            //   from: pos1Value - 30,
            //   to: pos1Value,
            //   easing: "easeOutQuart",
            // };
            // const pos2Key = data.axis.units.pos + "2";
            // const pos2Value = data[pos2Key];
            // const pos2Animation = {
            //   begin: seq * delays,
            //   dur: durations,
            //   from: pos2Value - 100,
            //   to: pos2Value,
            //   easing: "easeOutQuart",
            // };
            // const animations = {
            //   [data.axis.units.pos + "1"]: pos1Animation,
            //   [data.axis.units.pos + "2"]: pos2Animation,
            //   opacity: {
            //     begin: seq * delays,
            //     dur: durations,
            //     from: 0,
            //     to: 1,
            //     easing: "easeOutQuart",
            //   },
            // };
            // data.element.animate(animations);
          }
        });
        return chart;
      }
      let chart;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Component is in view, render the chart
            chart = createLineChart(text);
          } else {
            // Component is not in view, detach the chart
            if (chart) {
              chart.detach();
            }
          }
        });
      });

      observer.observe(chartRef.current);
      return () => {
        // Clean up chart on component unmount
        if (chart) {
          chart.detach();
        }

        observer.disconnect();
      };
    }
  }, [text]);

  useEffect(() => {
    // Define legend data
    const legendData = [
      {
        name: "Measures the amount of information in the document.",
        className: "ct-series-a",
      },
      {
        name: "X: Sentences",
        className: "ct-series-a",
      },

      { name: "Y: Information Density Score", className: "ct-series-d" },
    ];

    // Create legend element
    const legend = document.createElement("ul");
    Object.assign(legend.style,{listStyleType:'none'} )
    legend.classList.add("ct-legend");

    // Populate legend items
    legendData.forEach((data) => {
      const legendItem = document.createElement("li");
      legendItem.classList.add("ct-series", data.className);

      const legendLabel = document.createElement("span");
      legendLabel.innerText = data.name;

      legendItem.appendChild(legendLabel);
      legend.appendChild(legendItem);
    });

    // Append legend to the ref element
    legendRef.current.appendChild(legend);
  }, []);

  return (
    <IonGrid>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Information Density</IonTitle>
        </IonToolbar>
      </IonHeader> */}

      <div key="legendRefLineChart" ref={legendRef}></div>
      <div key="lineChartRef" ref={chartRef} />
    </IonGrid>
  );
}

export function ReadabilityStats({ text }) {
  const [readabilityStats, setReadabilityStats] = useState(null);
  const [readabilityScore, setReadabilityScore] = useState(null);

  // Example usage:


  // console.log(`Score: ${score}`);
  // console.log(`Grade: ${grade}`);
  // console.log(`Summary: ${summary}`);
  // console.log("text--->", text);
  useEffect(() => {
    // console.log("text", text);
    const doc = nlp.readDoc(extractTextFromHtml(text));

    const readabilityStats = doc.out(its.readabilityStats);

    setReadabilityScore(getGradeAndSummary(readabilityStats.fres));
    setReadabilityStats(readabilityStats);

    // console.log(readabilityStats.complexWords);
  }, [text]);

  if (!text || !readabilityStats) {
    return <IonRow className="ion-text-center">no data</IonRow> 
    //<IonSkeletonText animated={true} style={{ height: "300px" }} />;
  }

  return (
    <IonGrid>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>SEO Stats</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonRow>
        <IonCol>
          <IonLabel>SEO Readability Score</IonLabel>
        </IonCol>
        <IonCol className="ion-text-capitalize">
          {readabilityScore.summary}
          {/* <IonList><IonItem>Score:{readabilityStats.fres}</IonItem><IonItem>Reading Level: {readabilityScore.grade}  </IonItem><IonItem>Summary  {readabilityScore.summary} </IonItem></IonList> */}
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonLabel>Sentiment</IonLabel>
        </IonCol>
        <IonCol>{getSentimentSummary(readabilityStats.sentiment)}</IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonLabel>Reading Time</IonLabel>
        </IonCol>
        <IonCol>
          {readabilityStats.readingTimeMins} minutes{" "}
          {readabilityStats.readingTimeSecs} seconds
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol>
          <IonLabel>Number of Complex Words</IonLabel>
        </IonCol>
        <IonCol>{readabilityStats.numOfComplexWords}</IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonLabel>Complex Words</IonLabel>
        </IonCol>
        <IonCol>
          <IonList>
            {Object.keys(readabilityStats.complexWords).map((word, index) => (
              <IonItem key={index}>
                {word}: {readabilityStats.complexWords[word]}
              </IonItem>
            ))}
          </IonList>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonLabel>Number of Sentences</IonLabel>
        </IonCol>
        <IonCol>{readabilityStats.numOfSentences}</IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonLabel>Number of Tokens</IonLabel>
        </IonCol>
        <IonCol>{readabilityStats.numOfTokens}</IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonLabel>Number of Words</IonLabel>
        </IonCol>
        <IonCol>{readabilityStats.numOfWords}</IonCol>
      </IonRow>
    </IonGrid>
  );
}

// console.log('text: ' , doc.out());

function getGradeAndSummary(score) {
  const ranges = [
    { min: 90, max: 100, grade: "5th grade", summary: "Very easy to read" },
    { min: 80, max: 89, grade: "6th grade", summary: "Easy to read" },
    { min: 70, max: 79, grade: "7th grade", summary: "Fairly easy to read" },
    { min: 60, max: 69, grade: "8th & 9th grade", summary: "Plain English" },
    {
      min: 50,
      max: 59,
      grade: "10th to 12th grade",
      summary: "Fairly difficult to read",
    },
    { min: 30, max: 49, grade: "College", summary: "Difficult to read" },
    {
      min: 10,
      max: 29,
      grade: "College graduate",
      summary: "Very difficult to read",
    },
    {
      min: 0,
      max: 9,
      grade: "Professional",
      summary: "Extremely difficult to read",
    },
  ];

  for (const range of ranges) {
    if (score >= range.min && score <= range.max) {
      return { grade: range.grade, summary: range.summary };
    }
  }

  return {
    grade: "Invalid Score",
    summary: "Please provide a score between 0 and 100",
  };
}
function getSentimentSummary(score) {
  if (score >= 0.8) {
    return "Very positive sentiment";
  } else if (score >= 0.6) {
    return "Positive sentiment";
  } else if (score >= 0.4) {
    return "Neutral sentiment";
  } else if (score >= 0.2) {
    return "Negative sentiment";
  } else {
    return "Very negative sentiment";
  }
}
