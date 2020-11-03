document.addEventListener("DOMContentLoaded", () => {
  const button0 = document.getElementById("clickme-0");
  button0.onclick = () => {
    update(button0.dataset.total);
  };

  const button1 = document.getElementById("clickme-1");
  button1.onclick = () => {
    update(button1.dataset.california);
  };

  const button2 = document.getElementById("clickme-2");
  button2.onclick = () => {
    update(button2.dataset.chile);
  };

  const button3 = document.getElementById("clickme-3");
  button3.onclick = () => {
    update(button3.dataset.mexico);
  };

  const button4 = document.getElementById("clickme-4");
  button4.onclick = () => {
    update(button4.dataset.peru);
  };

  const margin = { top: 60, right: 60, bottom: 140, left: 120 },
    width = 1400 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  const svg = d3
    .select("#volume")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3.scaleBand().range([0, width]).padding(1);

  const xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")");

  const y = d3.scaleLinear().range([height, 0]);

  const yAxis = svg.append("g");

  function update(selectedVar) {
    d3.csv(
      "https://jeanyang0519.github.io/Hello-Avocado/data/volume.csv",
      function (data) {
        const parseDate = d3.timeParse("%b %d, %Y");
        const formatDate = d3.timeFormat("%b-%d");

        data.forEach(function (d) {
          d.Week = formatDate(parseDate(d.Week));
        });

        x.domain(
          data.map(function (d) {
            return d.Week;
          })
        );
        xAxis
          .transition()
          .duration(1000)
          .call(d3.axisBottom(x))
          .attr("transform", "translate(-0.2," + height + ")")
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end")
          .attr("x", -8);

        const maxY = d3.max(data, function (d) {
          return +d[selectedVar].split(",").join("");
        });

        y.domain([0, maxY]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        const line = svg.selectAll(".Line").data(data);

        line
          .enter()
          .append("line")
          .attr("class", "Line")
          .merge(line)
          .transition()
          .duration(1000)
          .attr("x1", function (d) {
            return x(d.Week);
          })
          .attr("x2", function (d) {
            return x(d.Week);
          })
          .attr("y1", y(0))
          .attr("y2", function (d) {
            return y(d[selectedVar].split(",").join(""));
          })
          .attr("opacity", 0.5)
          .attr("color", "red");

        const circle = svg.selectAll("circle").data(data);

        circle
          .enter()
          .append("circle")
          .merge(circle)
          .transition()
          .duration(1000)
          .attr("cx", function (d) {
            return x(d.Week);
          })
          .attr("cy", function (d) {
            return y(d[selectedVar].split(",").join(""));
          })
          .attr("r", 6)
          .attr("fill", "darksalmon");

        svg
          .selectAll("circle")
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);

        function handleMouseOver(d, i) {
          svg
            .append("text")
            .attr("class", "hoverVaule")
            .attr("x", x(d.Week) - 20)
            .attr("y", y(d[selectedVar].split(",").join("")) - 18)
            .text(d[selectedVar])
            .attr("font-size", 200);

          d3.select(this).attr("fill", "darkcyan").attr("r", 10);
        }

        function handleMouseOut(d, i) {
          d3.select(".hoverVaule").remove();
          d3.select(this).attr("fill", "darksalmon").attr("r", 6);
        }

        svg
          .append("text")
          .attr("class", "source")
          .attr("x", width - 150)
          .attr("y", height + 100)
          .attr("text-anchor", "start")
          .text("Source: Hass Avocado Board, 2019");
      }
    );
  }

  update("Total");
});
