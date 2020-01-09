document.addEventListener("DOMContentLoaded", () => {
    // set the dimensions and margins of the graph
    var margin = { top: 60, right: 60, bottom: 140, left: 120 },
        width = 1400 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;




    // append the svg object to the body of the page
    var svg = d3.select("#volume")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Initialize the X axis
    var x = d3.scaleBand()
        .range([0, width])
        .padding(1);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")

    // Initialize the Y axis
    var y = d3.scaleLinear()
        .range([height, 0])
    // .padding(1);
    var yAxis = svg.append("g")


    // A function that create / update the plot for a given variable:
    function update(selectedVar) {

        // Parse the Data
        d3.csv("data/volume-data.csv", function (data) {
            // debugger
            // console.log(data)
            // parse date
            var parseDate = d3.timeParse("%b %d, %Y");
            const formaDate = d3.timeFormat('%b-%d')

            data.forEach(function (d) {
                d.Week = formaDate(parseDate(d.Week));

                // d[selectedVar] = d[selectedVar];
                // debugger

                // console.log(d[selectedVar])
                // console.log(d.Week)
            });
            // X axis
            x.domain(data.map(function (d) { return d.Week; }))
            xAxis.transition()
                .duration(1000)
                .call(d3.axisBottom(x))
                .attr("transform", "translate(0," + height + ")")

                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end")
                .attr('x', -8)
            // .attr("transform", "rotate(-65)")


            // Add Y axis
            const maxY = d3.max(data, function (d) {
                return +d[selectedVar].split(',').join('')
            })


            y.domain([0, maxY]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y));



            // variable u: map data to existing circle
            var j = svg.selectAll(".myLine")
                .data(data)
            // update lines
            j
                .enter()
                .append("line")
                .attr("class", "myLine")
                .merge(j)
                .transition()
                .duration(1000)
                .attr("x1", function (d) { console.log(x(d.Week)); return x(d.Week); })

                .attr("x2", function (d) { return x(d.Week); })
                .attr("y1", y(0))
                .attr("y2", function (d) { return y(d[selectedVar].split(',').join('')); })

            // .attr("fill", "red")



            // variable u: map data to existing circle
            var u = svg.selectAll("circle")
                .data(data)
            // update bars
            u
                .enter()
                .append("circle")
                .merge(u)
                .transition()
                .duration(1000)
                .attr("cx", function (d) { return x(d.Week) })
                .attr("cy", function (d) { return y(d[selectedVar].split(',').join('')) })
                .attr("r", 5)
                .attr("fill", "dark")


            svg.selectAll("circle")
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);

            function handleMouseOver(d, i) {
                debugger
                svg.append('text').attr({
                    id: "t" + d.Week + "-" + d[selectedVar].split(',').join('') + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
                    x: function () { return x(d.Week) - 30; },
                    y: function () { return y(d[selectedVar].split(',').join('')) - 15; }
                })
                    .tip(function () {
                        return 3
                        // return [d.Week, d[selectedVar].split(',').join('')];  // Value of the text
                    });
            }

            function handleMouseOut(d, i) {
                // Use D3 to select element, change color back to normal
                // d3.select(this).attr({
                //     fill: "black",
                //     r: radius
                // });

                // Select text by id and then remove
                d3.select("#t" + d.Week + "-" + d[selectedVar].split(',').join('') + "-" + i).remove();  // Remove text location
            }


            // .on('mouseenter', function (actual, i) {
            //     d3.selectAll('d[selectedVar]')
            //         .attr('opacity', 0)

            //     d3.select(this)
            //         .transition()
            //         .duration(300)
            //         .attr('opacity', 0.6)
            //         .attr('x', (a) => xScale(a.country) - 5)
            //         .attr('width', xScale.bandwidth() + 10)

            //     const y = yScale(actual.value)

            //     line = chart.append('line')
            //         .attr('id', 'limit')
            //         .attr('x1', 0)
            //         .attr('y1', y)
            //         .attr('x2', width)
            //         .attr('y2', y)

            // barGroup.append('text')
            //     .attr('class', 'divergence')
            //     .attr('x', (a) => xScale(a.country) + xScale.bandwidth() / 2)
            //     .attr('y', (a) => yScale(a.value) - 10)
            //     .attr('fill', 'white')
            //     .attr('text-anchor', 'middle')
            //     .text((a, idx) => {
            //         const divergence = (a.value - actual.value).toFixed(1)

            //         let text = ''
            //         if (divergence > 0) text += '+'
            //         text += `${divergence}M`

            //         return idx !== i ? text : '';
            //     })

            // })



            // svg.append("g")
            //         .attr("transform", "translate(0," + height + ")")
            //         .call(d3.axisBottom(x))
            //         .selectAll("text")
            //         .attr("transform", "translate(-10,0)rotate(-45)")
            //         .style("text-anchor", "end");

            // svg.append('text')
            //         .attr('class', 'source')
            //         .attr('x', width - margin / 2)
            //         .attr('y', height + margin * 1.7)
            //         .attr('text-anchor', 'start')
            //         .text('Source: Hass Avocado Board, 2019')


        })

    }

    // Initialize plot
    update('California')

})