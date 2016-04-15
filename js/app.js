$(window).load(function() {
    loadInfographic();
});

$(window).resize(function() {
    loadInfographic();
});

function loadInfographic() {
    // Determines size of svg on page
    var w = window.innerWidth * .88,
        h = 600,
        x = d3.scale.linear().range([0, w]),
        y = d3.scale.linear().range([0, h]);
        console.log(w);

    // Inserts into the page
    $("#content").empty();
    var vis = d3.select("#content").append("div")
        .attr("class", "chart")
        .style("width", w + "px")
        .style("height", h + "px")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    var partition = d3.layout.partition()
        .value(function(d) { return d.size; });

    // Loads json file and creates an svg full of rectangles and text boxes
    d3.json("resolutions.json", function(root) {
      var g = vis.selectAll("g")
          .data(partition.nodes(root))
          .enter().append("svg:g")
          .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; })
          .attr("class", function(d) {
              var c = "";
              c +=  "text-level-" + d.level + " "  + "true-level-" + d.level;
              return c;
          })
          .on("click", click);

    var level0FontSize = $(".text-level-0").css("font-size");
    var level1FontSize = $(".text-level-1").css("font-size");
    var level2FontSize = $(".text-level-2").css("font-size");
    var level3FontSize = $(".text-level-3").css("font-size");

    var kx = w / root.dx,
        ky = h / 1;

        // Append all the rectangles corresponding to the datapoints
        g.append("svg:rect")
            .attr("width", root.dy * kx)
            .attr("height", function(d) { return d.dx * ky; })
            .attr("class", function(d) {
                return "level-" + d.level;
            });

        g.append("svg:text")
            .attr("transform", transform)
            .attr("dy", ".35em")
            .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
            .text(function(d) { return d.name; })

        d3.select(window)
            .on("click", function() { click(root); })

        function click(d) {
            if (!d.children) return;
            var seconds = 700;
            switch (d.level) {
                case 0:
                    $(".true-level-1").animate({"font-size":level1FontSize}, seconds);
                    $(".true-level-2").animate({"font-size":level2FontSize}, seconds);
                    $(".true-level-3").animate({"font-size":level3FontSize}, seconds);
                break;
                case 1:
                    $(".true-level-1").animate({"font-size":level0FontSize}, seconds);
                    $(".true-level-2").animate({"font-size":level1FontSize}, seconds);
                    $(".true-level-3").animate({"font-size":level2FontSize}, seconds);
                    break;
                case 2:
                    $(".true-level-1").animate({"font-size":level0FontSize}, seconds);
                    $(".true-level-2").animate({"font-size":level0FontSize}, seconds);
                    $(".true-level-3").animate({"font-size":level1FontSize}, seconds);
                    break;
                case 3:
                    $(".true-level-1").animate({"font-size":level0FontSize}, seconds);
                    $(".true-level-2").animate({"font-size":level1FontSize}, seconds);
                    $(".true-level-3").animate({"font-size":level2FontSize}, seconds);
                    break;
            }

            kx = (d.y ? w - 40 : w) / (1 - d.y);
            ky = h / d.dx;
            x.domain([d.y, 1]).range([d.y ? 40 : 0, w]);
            y.domain([d.x, d.x + d.dx]);

            var t = g.transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; });

            t.select("rect")
                .attr("width", d.dy * kx)
                .attr("height", function(d) { return d.dx * ky; })

            t.select("text")
                .attr("transform", transform)
                .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });

            d3.event.stopPropagation();
        }

        function transform(d) {
            return "translate(8," + d.dx * ky / 2 + ")";
        }
    });
}
