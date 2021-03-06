document.addEventListener("DOMContentLoaded", () => {
  const data = [
    {
      country: "Mexico",
      value: 2503.4,
    },
    {
      country: "Peru",
      value: 794.1,
    },
    {
      country: "Chile",
      value: 276.7,
    },
    {
      country: "Israel",
      value: 182.1,
    },
    {
      country: "South Africa",
      value: 102.9,
    },
    {
      country: "Kenya",
      value: 92.2,
    },
    {
      country: "Dominican Republic",
      value: 76.2,
    },
  ];

  const svg = d3.select("#exports");
  const margin = 80;
  const width = 1000 - 2 * margin;
  const height = 600 - 2 * margin;

  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  const xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map((s) => s.country))
    .padding(0.4);

  const yScale = d3.scaleLinear().range([height, 0]).domain([0, 2600]);

  const makeYLines = () => d3.axisLeft().scale(yScale);

  chart
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  chart.append("g").call(d3.axisLeft(yScale));

  chart
    .append("g")
    .attr("class", "grid")
    .call(makeYLines().tickSize(-width, 0, 0).tickFormat(""));

  const bar = chart.selectAll().data(data).enter().append("g");

  bar
    .append("rect")
    .attr("class", "bar")
    .attr("x", (g) => xScale(g.country))
    .attr("y", (g) => yScale(g.value))
    .attr("height", (g) => height - yScale(g.value))
    .attr("width", xScale.bandwidth())
    .on("mouseenter", handleMouseEnter)
    .on("mouseleave", handleMouseLeave);

  function handleMouseEnter(actual, i) {
    d3.selectAll(".value").attr("opacity", 0);

    d3.select(this)
      .transition()
      .duration(300)
      .attr("opacity", 0.6)
      .attr("x", (a) => xScale(a.country) - 5)
      .attr("width", xScale.bandwidth() + 10);

    const y = yScale(actual.value);

    line = chart
      .append("line")
      .attr("id", "limit")
      .attr("x1", 0)
      .attr("y1", y)
      .attr("x2", width)
      .attr("y2", y);

    bar
      .append("text")
      .attr("class", "divergence")
      .attr("x", (a) => xScale(a.country) + xScale.bandwidth() / 2)
      .attr("y", (a) => yScale(a.value) - 10)
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .text((a, idx) => {
        const divergence = (a.value - actual.value).toFixed(1);
        let text = "";
        if (divergence > 0) text += "+";
        text += `${divergence}M`;

        return idx !== i ? text : "";
      });
  }

  function handleMouseLeave() {
    d3.selectAll(".value").attr("opacity", 1);

    d3.select(this)
      .transition()
      .duration(500)
      .attr("opacity", 1)
      .attr("x", (a) => xScale(a.country))
      .attr("width", xScale.bandwidth());

    chart.selectAll("#limit").remove();
    chart.selectAll(".divergence").remove();
  }

  bar
    .append("text")
    .attr("class", "value")
    .attr("x", (a) => xScale(a.country) + xScale.bandwidth() / 2)
    .attr("y", (a) => yScale(a.value) - 10)
    .attr("text-anchor", "middle")
    .text((a) => `${a.value}M`);

  svg
    .append("text")
    .attr("class", "label")
    .attr("x", -(height / 2) - margin)
    .attr("y", margin / 3)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Number in millions of pounds (lbs)");

  svg
    .append("text")
    .attr("class", "label")
    .attr("x", width / 2 + margin)
    .attr("y", height + margin * 1.7)
    .attr("text-anchor", "middle")
    .text("countries");

  svg
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2 + margin)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("Top Exporting Countries");

  svg
    .append("text")
    .attr("class", "source")
    .attr("x", width - margin / 2)
    .attr("y", height + margin * 1.7)
    .attr("text-anchor", "start")
    .text("Source: Hass Avocado Board, 2018");
});
