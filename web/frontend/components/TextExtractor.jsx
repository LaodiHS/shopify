import React, { useEffect, useRef, useState } from "react";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonText,
  IonChip,
} from "@ionic/react";
import {
  LineChart,
  BarChart,
  Svg,
  getMultiValue,
  extend,
  normalizePadding,
} from "chartist";

import { WordCloud, InformationIcon, useWinkDataContext } from "../components";
import { extractTextFromHtml } from "./providers/ReactRenderingComponent";

// doc.entities().each((e) => e.markup());

function LinePlugin() {
  /**
   * Chartist.js plugin to display a data label on top of the points in a line chart.
   *
   */
  /* global Chartist */

  function createMasks(data, options) {
    // Select the defs element within the chart or create a new one
    let defs = data.svg.querySelector("defs") || data.svg.elem("defs");
    // Project the threshold value on the chart Y axis
    let projectedThreshold =
      data.chartRect.height() -
      data.axisY.projectValue(options.threshold) +
      data.chartRect.y2;
    let width = data.svg.width();
    let height = data.svg.height();

    // Create mask for upper part above threshold
    defs
      .elem("mask", {
        x: 0,
        y: 0,
        width: width,
        height: height,
        id: options.maskNames.aboveThreshold,
      })
      .elem("rect", {
        x: 0,
        y: 0,
        width: width,
        height: projectedThreshold,
        fill: "white",
      });

    // Create mask for lower part below threshold
    defs
      .elem("mask", {
        x: 0,
        y: 0,
        width: width,
        height: height,
        id: options.maskNames.belowThreshold,
      })
      .elem("rect", {
        x: 0,
        y: projectedThreshold,
        width: width,
        height: height - projectedThreshold,
        fill: "white",
      });

    return defs;
  }

  function Threshold(options, chart) {
    options = extend(
      {},
      {
        threshold: 0,
        classNames: {
          aboveThreshold: "ct-threshold-above",
          belowThreshold: "ct-threshold-below",
        },
        maskNames: {
          aboveThreshold: "ct-threshold-mask-above",
          belowThreshold: "ct-threshold-mask-below",
        },
      },
      options
    );

    if (chart instanceof LineChart || chart instanceof BarChart) {
      chart.on("draw", function (data) {
        if (chart instanceof BarChart) {
          console.log("data-bar", data);
        }
        if (data.type === "point") {
          // For points we can just use the data value and compare against the threshold in order to determine
          // the appropriate class
          data.element.addClass(
            data.value.y >= options.threshold
              ? options.classNames.aboveThreshold
              : options.classNames.belowThreshold
          );
        } else if (
          data.type === "line" ||
          data.type === "bar" ||
          data.type === "area"
        ) {
          // Cloning the original line path, mask it with the upper mask rect above the threshold and add the
          // class for above threshold
          data.element
            .parent()
            .elem(data.element._node.cloneNode(true))
            .attr({
              mask: "url(#" + options.maskNames.aboveThreshold + ")",
            })
            .addClass(options.classNames.aboveThreshold);

          // Use the original line path, mask it with the lower mask rect below the threshold and add the class
          // for blow threshold
          data.element
            .attr({
              mask: "url(#" + options.maskNames.belowThreshold + ")",
            })
            .addClass(options.classNames.belowThreshold);
        }
      });

      // On the created event, create the two mask definitions used to mask the line graphs
      chart.on("created", (data) => {
        createMasks(data, options);
      });
    }
  }
  return { Threshold };
}

function LabelPlugin() {
  let axisDefaults = {
    axisTitle: "",
    axisClass: "ct-axis-title",
    offset: {
      x: 0,
      y: 0,
    },
    textAnchor: "middle",
    flipTitle: false,
  };

  let defaultOptions = {
    axisX: axisDefaults,
    axisY: axisDefaults,
  };

  let getTitle = function (title) {
    if (title instanceof Function) {
      return title();
    }
    return title;
  };

  let getClasses = function (classes) {
    if (classes instanceof Function) {
      return classes();
    }
    return classes;
  };

  function ctAxisTitle(options, chart) {
    options = extend({}, defaultOptions, options);

    chart.on("created", function (data) {
      if (!options.axisX.axisTitle && !options.axisY.axisTitle) {
        throw new Error(
          "ctAxisTitle plugin - You must provide at least one axis title"
        );
      } else if (!data.axisX && !data.axisY) {
        throw new Error(
          "ctAxisTitle plugin can only be used on charts that have at least one axis"
        );
      }

      let xPos,
        yPos,
        title,
        chartPadding = normalizePadding(data.options.chartPadding); // normalize the padding in case the full padding object was not passed into the options

      //position axis X title
      if (options.axisX.axisTitle && data.axisX) {
        xPos =
          data.axisX.axisLength / 2 +
          data.options.axisY.offset +
          chartPadding.left;

        yPos = chartPadding.top;

        if (data.options.axisY.position === "end") {
          xPos -= data.options.axisY.offset;
        }

        if (data.options.axisX.position === "end") {
          yPos += data.axisY.axisLength;
        }

        title = new Svg("text");
        data.svg.append(title, true);
        title.addClass(getClasses(options.axisX.axisClass));
        title.text(getTitle(options.axisX.axisTitle));
        title.attr({
          x: xPos + options.axisX.offset.x,
          y: yPos + options.axisX.offset.y,
          "text-anchor": options.axisX.textAnchor,
        });
      }

      //position axis Y title
      if (options.axisY.axisTitle && data.axisY) {
        xPos = 0;

        yPos = data.axisY.axisLength / 2 + chartPadding.top;

        if (data.options.axisX.position === "start") {
          yPos += data.options.axisX.offset;
        }

        if (data.options.axisY.position === "end") {
          xPos = data.axisX.axisLength;
        }

        var transform =
          "rotate(" +
          (options.axisY.flipTitle ? -90 : 90) +
          ", " +
          xPos +
          ", " +
          yPos +
          ")";

        title = new Svg("text");
        title.addClass(getClasses(options.axisY.axisClass));
        title.text(getTitle(options.axisY.axisTitle));
        title.attr({
          x: xPos + options.axisY.offset.x,
          y: yPos + options.axisY.offset.y,
          transform: transform,
          "text-anchor": options.axisY.textAnchor,
        });
        data.svg.append(title, true);
      }
    });
  }

  return { ctAxisTitle };
}

export function BarChartComponent({ text }) {
  const chartRef = useRef(null);
  const legendRef = useRef(null);
  const { nlp, its, as } = useWinkDataContext();
  useEffect(() => {
    if (text) {
      function createBarChart() {
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
        const linePlugin = LinePlugin();
        const labelPlugin = LabelPlugin();

        labelPlugin.ctAxisTitle(
          {
            axisX: {
              axisTitle: "Sentence",
              axisClass: "ct-axis-title",
              offset: {
                x: 0,
                y: 35,
              },
              textAnchor: "middle",
              flipTitle: false,
            },
            axisY: {
              axisTitle: "Sentiment",
              axisClass: "ct-axis-title",
              offset: {
                x: 0,
                y: -8,
              },
              textAnchor: "middle",
              flipTitle: false,
            },
          },
          chart
        );

        //  linePlugin.Threshold({ threshold: 0 }, chart);
        let seq = 0;
        const delays = 80;
        const durations = 500;

        chart.on("draw", (data) => {
          seq++;

          if (data.type === "label" && data.axis.counterUnits.pos === "x") {
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
            // data.element.animate({
            //   x1: {
            //     begin: seq * delays,
            //     dur: durations,
            //     from: data.x - 10,
            //     to: data.x,
            //     easing: "easeOutQuart",
            //   },
            //   x2: {
            //     begin: seq * delays,
            //     dur: durations,
            //     from: data.x - 10,
            //     to: data.x,
            //     easing: "easeOutQuart",
            //   },
            //   opacity: {
            //     begin: seq * delays,
            //     dur: durations,
            //     from: 0,
            //     to: 1,
            //     easing: "easeOutQuart",
            //   },
            // });
          }
          // If this draw event is of type bar we can use the data to create additional content
          if (data.type === "bar") {
            data.element.removeClass("ct-bar");

            // We use the group element of the current series to append a simple circle with the bar peek coordinates and a circle radius that is depending on the value
            const winWidth = window.innerWidth;

            let val = Number(getMultiValue(data.value));

            let className = "ct-slice-pie-above";

            if (val < 0) {
              data.element.addClass("ct-bar-below");
              className = "ct-slice-pie-below";
            } else {
              data.element.addClass("ct-bar-above");
            }

            data.group.append(
              new Svg(
                "circle",
                {
                  cx: data.x2,
                  cy: data.y2,
                  r:
                    Math.abs(Number(getMultiValue(data.value))) * winWidth > 600
                      ? 9
                      : 0.5 + 5,
                },
                className
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
    // Create legend element
  }, []);

  return (
    <IonGrid key="BarChartGrid">
      {/* <IonHeader >
        <IonToolbar>
          <IonTitle>Sentiment Flow</IonTitle>
        </IonToolbar>
      </IonHeader> */}

      <IonCol className="ion-padding-start" size="12">
        <InformationIcon
          label={"Overall Sentiment Analysis"}
          id="information-sentiment-across-document"
          content={
            "Examining the sentiment conveyed in each sentence of your document."
          }
        />
      </IonCol>

      <IonCol size="12">
        <IonRow
          style={{ alignItems: "center", display: "flex", padding: "10px" }}
          size="6"
        >
          <IonCol className="legend-item">
            <div className="color-box color-1"></div>
            <IonText className="legend-text">High</IonText>
          </IonCol>
          <IonCol className="legend-item" size="6">
            <div className="color-box color-2"></div>
            <IonText className="legend-text">Low</IonText>
          </IonCol>
        </IonRow>
      </IonCol>
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
  const { nlp, its, as } = useWinkDataContext();
  useEffect(() => {
    if (text) {
      function createLineChart(text) {
        let doc = nlp.readDoc(extractTextFromHtml(text));
        const readability = doc.out(its.readabilityStats);
        // console.log("readability stats", readability);
        const importance = doc
          .out(its.sentenceWiseImportance)
          .map((e) => e.importance);

        //  console.log('markup: ', doc.out(its.markedUpText));
        doc.entities().each((e) => {
          // if (e.out(its.type) === "DATE") console.log(e.out());
        });

        const chart = new LineChart(
          chartRef.current,
          {
            series: [importance],
          },
          {
            hight: 1,
            low: 0,

            axisX: {
              showLabel: true,
              labelInterpolationFnc: (value, index) => {
                // Return the label you want for the x-axis

                return index;
              },
            },
            showArea: true,
            axisY: {
              labelInterpolationFnc: (value) => {
                // Return the label you want for the y-axis
                return +value;
              },
              plugins: [],
            },
          }
        );
        const linePlugin = LinePlugin();
        const labelPlugin = LabelPlugin();

        labelPlugin.ctAxisTitle(
          {
            axisX: {
              axisTitle: "Sentence",
              axisClass: "ct-axis-title",
              offset: {
                x: 0,
                y: 35,
              },
              textAnchor: "middle",
              flipTitle: false,
            },
            axisY: {
              axisTitle: "Density",
              axisClass: "ct-axis-title",
              offset: {
                x: 0,
                y: -5,
              },
              textAnchor: "middle",
              flipTitle: false,
            },
          },
          chart
        );

        linePlugin.Threshold({ threshold: 0.35 }, chart);

        let seq = 0;
        const delays = 80;
        const durations = 500;

        chart.on("created", () => {
          seq = 0;
        });

        chart.on("draw", (data) => {
          seq++;

          if (data.type === "line") {
            // data.element.animate({
            //   opacity: {
            //     begin: seq * delays + 1000,
            //     dur: durations,
            //     from: 0,
            //     to: 1,
            //   },
            // });
          } else if (
            data.type === "label" &&
            data.axis.counterUnits.pos === "x"
          ) {
            // console.log("data", data);
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
            // data.element.animate({
            //   x1: {
            //     begin: seq * delays,
            //     dur: durations,
            //     from: data.x - 10,
            //     to: data.x,
            //     easing: "easeOutQuart",
            //   },
            //   x2: {
            //     begin: seq * delays,
            //     dur: durations,
            //     from: data.x - 10,
            //     to: data.x,
            //     easing: "easeOutQuart",
            //   },
            //   opacity: {
            //     begin: seq * delays,
            //     dur: durations,
            //     from: 0,
            //     to: 1,
            //     easing: "easeOutQuart",
            //   },
            // });
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
  }, []);

  return (
    <IonGrid key="legend-line-chart">
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Information Density</IonTitle>
        </IonToolbar>
      </IonHeader> */}

      <IonCol className="ion-padding-start" size="12">
        <InformationIcon
          label={"Sentence-Level Information Density"}
          id="information-density"
          content={
            "The amount of information packed into each of your sentences."
          }
        />
      </IonCol>

      <IonCol size="12">
        <IonRow
          style={{ alignItems: "center", display: "flex", padding: "10px" }}
          size="6"
        >
          <IonCol className="legend-item">
            <div className="color-box color-1"></div>
            <IonText className="legend-text">High</IonText>
          </IonCol>
          <IonCol className="legend-item" size="6">
            <div className="color-box color-2"></div>
            <IonText className="legend-text">Low</IonText>
          </IonCol>
        </IonRow>
      </IonCol>

      <div key="legendRefLineChart"></div>
      <div key="lineChartRef" ref={chartRef} />
    </IonGrid>
  );
}

export function ReadabilityStats({ checkFeatureAccess, text }) {
  const [readabilityStats, setReadabilityStats] = useState(null);
  const [readabilityScore, setReadabilityScore] = useState(null);
  const [cleanText, setCleanText] = useState("");
  const [doc, setDoc] = useState(null);

  const { nlp, its, as } = useWinkDataContext();
  // console.log(`Score: ${score}`);
  // console.log(`Grade: ${grade}`);
  // console.log(`Summary: ${summary}`);
  // console.log("text--->", text);
  useEffect(() => {
    // console.log("text", text);

    const pristineText = extractTextFromHtml(text);
    // console.log("raw text  ", pristineText);
    setCleanText(pristineText);
    const doc = nlp.readDoc(pristineText);
    setDoc(doc);

    const readabilityStats = doc.out(its.readabilityStats);
    console.log("readability stats", readabilityStats);
    setReadabilityScore(getGradeAndSummary(readabilityStats.fres));
    setReadabilityStats(readabilityStats);
  }, [text]);

  if (!text || !readabilityStats) {
    return <IonCol className="ion-text-center">no data</IonCol>;
    //<IonSkeletonText animated={true} style={{ height: "300px" }} />;
  }

  return (
    <IonGrid>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>SEO Stats</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonRow className="ion-justify-content-start">
        <IonCol className="ion-float-left" size="12">
          <WordCloud
            text={cleanText}
            checkFeatureAccess={checkFeatureAccess}
            its={its}
            doc={doc}
          />
        </IonCol>
      </IonRow>

      <InformationIcon
        label="SEO Reachability Score"
        id="seo-score-tools"
        content="A SEO And Readability BreakDown Of Your Document."
      />

      <IonRow className="ion-padding-start">
        <IonCol size="6"> Readability: </IonCol>
        <IonCol size="6" className="ion-text-capitalize">
          {readabilityScore.summary}
          {/* <IonList><IonItem>Score:{readabilityStats.fres}</IonItem><IonItem>Reading Level: {readabilityScore.grade}  </IonItem><IonItem>Summary  {readabilityScore.summary} </IonItem></IonList> */}
        </IonCol>
      </IonRow>

      <IonRow className="ion-padding-start">
        <IonCol>
          <IonLabel>Sentiment</IonLabel>
        </IonCol>
        <IonCol>{getSentimentSummary(readabilityStats.sentiment)}</IonCol>
      </IonRow>

      <IonRow className="ion-padding-start">
        <IonCol>
          <IonLabel>Reading Time</IonLabel>
        </IonCol>
        <IonCol>
          {readabilityStats.readingTimeMins} minutes{" "}
          {readabilityStats.readingTimeSecs} seconds
        </IonCol>
      </IonRow>

      <IonRow className="ion-padding-start">
        <IonCol>
          <IonLabel>Number of Sentences</IonLabel>
        </IonCol>
        <IonCol>{readabilityStats.numOfSentences}</IonCol>
      </IonRow>
      <IonRow className="ion-padding-start">
        <IonCol>
          <IonLabel>Number of Words</IonLabel>
        </IonCol>
        <IonCol>{readabilityStats.numOfWords}</IonCol>
      </IonRow>
      <IonRow className="ion-padding-start">
        <IonCol>
          <IonLabel>Number of Tokens</IonLabel>
        </IonCol>
        <IonCol>{readabilityStats.numOfTokens}</IonCol>
      </IonRow>

      <IonRow className="ion-padding-start">
        <IonCol>
          <IonLabel>Number of Complex Words</IonLabel>
        </IonCol>
        <IonCol>{readabilityStats.numOfComplexWords}</IonCol>
      </IonRow>
      <IonRow className="ion-padding-start">
        <IonCol>
          <IonLabel>Complex Words:</IonLabel>
        </IonCol>
        <IonCol size="12">
          {Object.keys(readabilityStats.complexWords).map((word, index) => (
            <IonChip key={index}>
              {word}: {readabilityStats.complexWords[word]}
            </IonChip>
          ))}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

// console.log('text: ' , doc.out());

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
    return "Inspiring - Consider the Impact";
  } else if (score >= 0.6) {
    return "Positive - Embrace the Potential";
  } else if (score >= 0.4) {
    return "Hopeful Sentiment - Seek Growth";
  } else if (score >= 0.2) {
    return "Lacks Focus - Reflect on Choices";
  } else if (score > 0) {
    return "Cautious Sentiment - Be Mindful Of Your Audience";
  } else if (score > -0.2) {
    return "Concerning Issues In This Document - Evaluate Negatives";
  } else if (score > -0.4) {
    return "Serious Issues In This Document - Address Issues";
  } else if (score > -0.6) {
    return "Urgent Issues In This Document - Take Precautions";
  } else if (score > -0.8) {
    return "Overhaul This Document - Assess the Situation";
  } else {
    return "Destructive - Reconsider Choices!";
  }
}
