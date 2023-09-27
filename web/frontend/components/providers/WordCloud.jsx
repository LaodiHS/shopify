import React, { useEffect, useRef } from 'react';
import cloud from 'd3-cloud';
import * as d3 from "d3";

export function WordCloud ({ words }) {
  const svgRef = useRef(null);

  useEffect(() => {
    let resizeTimeout;

    const generateWordCloud = () => {
      const layout = cloud()
        .size([800, 600])
        .words(words)
        .padding(5)
        .rotate(0)
        .fontSize(d => d.size)
        .on('end', draw);

      layout.start();

      function draw(words) {
        const svg = d3.select(svgRef.current);

        svg
          .attr('width', layout.size()[0])
          .attr('height', layout.size()[1])
          .append('g')
          .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', d => `${d.size}px`)
          .style('fill', d => d.color || 'black')
          .attr('text-anchor', 'middle')
          .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
          .text(d => d.text);;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          generateWordCloud();
          observer.disconnect(); // Stop observing once it comes into view
        }
      },
      { rootMargin: '0px 0px 200px 0px' } // Adjust the rootMargin as needed
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    return () => {
      observer.disconnect(); // Make sure to clean up the observer
    };
  }, [words]);

  return <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />;
};