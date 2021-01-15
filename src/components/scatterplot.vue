<template>
  <div>
      <div  id="scatter">
      <div class='tooltip'></div>
      </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as d3 from "d3";
import $ from "jquery";
import '@/assets/style.css'
export default {
  name: "scatter",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
    };
  },
  computed: {
    ...mapGetters(["mail"]),
  },
  methods: {
    most_type(data, type) {
      var typecontainer = {};
      data.forEach((item) => {
        typecontainer[item[type]] = typecontainer[item[type]] || 0;
        typecontainer[item[type]] += 1;
      });
      var res = Object.keys(typecontainer).sort(function (a, b) {
        return typecontainer[b] - typecontainer[a];
      });
      res = res.slice(0, 9);
      var idx = res.indexOf("others");
      if (idx == -1) {
        res.push("others");
      } else {
        var tmp = res[idx];
        for (; idx < res.length - 1; idx++) {
          tmp = res[idx];
          res[idx] = res[idx + 1];
          res[idx + 1] = tmp;
        }
      }
      return res;
    },
    drawScatterplot(data) {
      let div = d3.select("#scatter");
      let svgWidth = 600;
      let svgHeight = 500;
      let category = 'Country'
      // alert(category)
      var typeidx = this.most_type(data, category);
      let padding = {
        left: 0.1 * svgWidth,
        right: 0.1 * svgWidth,
        top: 0.05 * svgHeight,
        bottom: 0.05 * svgHeight,
      };
      let svg = div
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr("preserveAspectRatio", "none")
        // .attr("viewBox", [0, 0, svgWidth, svgHeight]);
      // .classed("svg-content-responsive", true)

      let x_attr = "Total Cores";
      let y_attr = "Rmax [TFlop/s]";

      let x = d3
        .scaleLog()
        // .exponent(0.25)
        .domain(this.get_min_max(data, x_attr))
        .range([padding.left, svgWidth - padding.right]);
      x.nice();
      let axis_x = d3
        .axisBottom()
        .scale(x)
        .ticks(4)
        .tickFormat((d) => "1e+" + Math.log10(d));

      let y = d3
        .scalePow()
        .exponent(0.01)
        .domain(this.get_min_max(data, y_attr))
        .range([svgHeight - padding.bottom, padding.top]);
      let axis_y = d3
        .axisLeft()
        .scale(y)
        .ticks(10)
        .tickFormat((d) => d);

      svg
        .append("g")
        .attr("transform", `translate(${0}, ${svgHeight - padding.bottom})`)
        .call(axis_x)
        .attr("font-size", "0.5rem");

      svg
        .append("g")
        .attr(
          "transform",
          `translate(${
            padding.left + (svgWidth - padding.left - padding.right) / 2
          }, ${svgHeight - padding.bottom})`
        )
        .append("text")
        .attr("class", "axis_label")
        .attr("dx", "-0.4rem")
        .attr("dy", 0.08 * svgHeight)
        .text(x_attr);

      svg
        .append("g")
        .attr("transform", `translate(${padding.left}, ${0})`)
        .call(axis_y)
        .attr("font-size", "0.5rem");
      svg
        .append("g")
        .attr(
          "transform",
          `
            translate(${padding.left}, ${svgHeight / 2})
            rotate(-90)    
        `
        )
        .append("text")
        .attr("class", "axis_label")
        .attr("dy", -svgHeight * 0.07)
        .text(y_attr);

      svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function (d) {
          return d["Rank"] + " " + d["Name"];
        })
        .attr("fill", (d) => {
          return typeidx.indexOf(d[category]) == -1
            ? this.getColor(typeidx.indexOf("others"))
            : this.getColor(typeidx.indexOf(d[category]));
        })
        .attr("cx", (d, i) => {
          return x(parseFloat(d[x_attr]));
        })
        .attr("cy", (d, i) => {
          return y(parseFloat(d[y_attr]));
        })
        .attr("r", 3.8)
        .attr("stroke", "none")
        .attr("stroke-width", 1.5)
        .attr("opacity", 1)
        .on("mouseover", function (e, d) {
          d3.select(this).attr("stroke", "#ff6a33");
          // console.log(d)
          let rank = d["Rank"];
          let name = d["Name"];
          let cty = d["Country"];
          let rmax = d[y_attr];
          let manu = d["Manufacturer"];
          let seg = d["Segment"];
          let power = d["Power (k W)"] || "N/A";
          let cores = d[x_attr];
          let computer = d["Computer"];

          let content =
            "<table><tr><td><b>rank</b></td><td><b>" +
            rank +
            "</b></td></tr><tr><td>name" +
            "</td><td>" +
            name +
            "</td></tr><tr><td>country" +
            "</td><td>" +
            cty +
            "</td></tr><tr><td><u>Rmax(y)</u>" +
            "</td><td>" +
            rmax +
            " TFlop/s</td></tr><tr><td><u>cores(x)</u>" +
            "</td><td>" +
            cores +
            "</td></tr><tr><td>power" +
            "</td><td>" +
            power +
            "(k W)</td></tr><tr><td>manufacturer" +
            "</td><td>" +
            manu +
            "</td></tr><tr><td>segment" +
            "</td><td>" +
            seg +
            "</td></tr><tr><td>computer" +
            "</td><td>" +
            computer +
            "</td></tr></table>";

          let tooltip = div.select(".tooltip");
          tooltip
            .html(content)
            .style("left", e.layerX + 450 + "px")
            .style("top", e.layerY + 0+  "px")
            .style("visibility", "visible");
        // console.log(e)

          // linkingHover('.rect', ['.' + d['district'], d['popularity']]);
        })
        .on("mouseout", function (d) {
          d3.select(this).attr("stroke", "none");
          let tooltip = div.select(".tooltip");
          tooltip.style("visibility", "hidden");
        //   Renew();
        });
    },

    get_min_max(data, attr) {
      let min = 1e9;
      let max = 0;
      data.forEach((d) => {
        let v = parseFloat(d[attr]);
        if (v > max) max = v;
        if (v < min) min = v;
      });
      return [min, max];
    },
    getColor(idx) {
    var palette = [
            '#d67c7f', '#fcba80', '#59b1ee', '#c5b0e7', '#2ec6cc',
            '#956f6d', '#9db057', '#e5d307', '#8c99aa', '#dc69aa',
            '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
            '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
        ]
        // var palette = [
        //     '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
        //     '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
        //     '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
        //     '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
        // ]
    return palette[idx % palette.length];
    },


    change_color_scatterchart(data) {
      let div = d3.select("#scatter");
      let svg = div.select("svg");
      let category = $("#select_category").val();
      var typeindex = this.most_type(data, category);

      svg.selectAll("circle").attr("fill", (d) => {
        return typeindex.indexOf(d[category]) == -1
          ? this.getColor(typeindex.indexOf("others"))
          : this.getColor(typeindex.indexOf(d[category]));
      });
    },
  },
  created() {
    
    d3.csv("@/../static/final.csv", (d) => {
      return d;
    }).then((data) => {
      this.drawScatterplot(data);
    });
  },
};
</script>


<style scoped>
#scatter {
    height: 600px;
}
.tooltip {
    position: absolute;
}
div {
    position: relative;
}
</style>
