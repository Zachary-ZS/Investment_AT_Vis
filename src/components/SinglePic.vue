<template>
  <div id="singlemm">
    <div :id="`left_panel_${ind}`" class="left_panel">
      <div class="tooltip"></div>
    </div>
    <div :id="`right_panel_${ind}`" class="right_panel">
      <div class="tooltip"></div>
    </div>
  <!-- <svg-icon :name="`ind_${ind}`" width="40"> </svg-icon> -->
  <img :src="`../static/icon/svg/ind_${ind}.svg`" style="width: 40px;height:40px"/>
  {{industries[ind-1]}}行业投资情况
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as d3 from "d3";
import $ from "jquery";
import "@/assets/style.css";
export default {
  name: "SinglePic",
  props: {
    ind: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      svg: [null, null],
      svgWidth: 400,
      svgHeight: 400,
      padding_left: 40,
      padding_top: 50,
      years: [
        "before 2008",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
      ],
      industries: [
        "文娱传媒",
        "游戏",
        "企业服务",
        "金融/支付",
        "社交社区",
        "电子商务",
        "医疗健康/生物医药",
        "教育培训",
        "直播/视频",
        "汽车交通",
        "生活服务",
        "工具软件",
        "人工智能",
        "电信/通信",
        "旅游/OTA",
        "科创/技术研发",
        "食品/商贸零售",
        "硬件/生产制造",
        "物流运输",
        "房产家居",
        "AR/VR",
        "其他",
      ],
      round_idx: {
        "Angel/Seed": 0,
        "A": 1,
        "B": 2,
        "C": 3,
        "D": 4,
        "E": 5,
        "Pre-IPO": 6,
        "Merger": 7
      },
      colors: [
        ["#eaeaff", "#d0d0ff", "#a8a8ff", "#8c8cff", "#6868ff", "#4848ff", "#3030ff", "#dbe713"],
        ["#ffe6df", "#ffbaa7", "#ff9172", "#ff6e46", "#ff5020", "#ff3c06", "#ff2800", "#dbe713"]
      ]
      ,
      data: [[], []],
    };
  },
  computed: {
    ...mapGetters(["mail"]),
  },
  methods: {
    drawScatterplot(idx) {
      let svgid = (idx==0)?`#left_panel_${this.ind}`:`#right_panel_${this.ind}`
      let div = d3.select(svgid)
      let svgWidth = this.svgWidth
      let svgHeight = this.svgHeight
      let pleft = this.padding_left
      let ptop = this.padding_top
      let pright = 20
      let pbottom = this.padding_top
      
      let data = this.data[idx]

      this.svg[idx] = div
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("preserveAspectRatio", "none")
      let svg = this.svg[idx]

      let x_attr = "year";
      let y_attr = "money";

      // console.log(this.data1)
      let x = d3
        .scalePoint()
        .domain(this.years)
        .range([pleft, svgWidth-pleft-pright]);
      let axis_x = d3
        .axisBottom()
        .scale(x)
        .tickFormat(d=>{
          if (d=="before 2008")
            return "之前"
          return d
        })

      let range_y = this.get_min_max(data, y_attr)
      // console.log(range_y)
      let y = d3
        .scaleLog()
        .domain(range_y)
        .range([svgHeight-pbottom-ptop, ptop]);
      let tmp = range_y[0] * 10
      let axis_y = d3
        .axisLeft()
        .scale(y)
        .tickFormat(d=>d)
        .tickFormat(d=>{
          if (d == range_y[0] || d== range_y[1])
            return `${d}亿`
          if (d == tmp) {
            tmp *= 10
            return `${d}亿`
          }
          return null
        })
      
      // axises
      svg
        .append("g")
        .attr("transform", `translate(${pleft}, ${svgHeight - pbottom})`)
        .call(axis_x)
        .attr("font-size", "0.5rem");

      let compp = (idx==0)?"腾讯":"阿里巴巴"
      svg
        .append("g")
        .attr(
          "transform",
          `translate(${
            (svgWidth) / 2
          }, ${svgHeight-pbottom})`
        )
        .append("text")
        .attr("class", "axis_label")
        .attr("dx", "-1rem")
        .attr("dy", 0.12 * svgHeight)
        .text(`${compp}`);

      svg
        .append("g")
        .attr("transform", `translate(${pleft*2}, ${ptop})`)
        .call(axis_y)
        .attr("font-size", "0.5rem")
        .selectAll("line")
        .remove()
      svg
        .append("g")
        .attr(
          "transform",
          `translate(${pleft*2}, ${svgHeight / 2 + ptop})
            rotate(-90)`
        )
        .append("text")
        .attr("class", "axis_label")
        .attr("dy", -svgWidth * 0.08)
        .text("投资金额 (亿元)");

      let _this = this;
      svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("fill", (d, i) => {
          return this.colors[idx][this.round_idx[d["round"]]]
        })
        .attr("cx", (d, i) => {
          return x(d[x_attr])+pleft;
        })
        .attr("cy", (d, i) => {
          return y(d[y_attr])+ptop;
        })
        .attr("r", 5)
        .attr("stroke", "none")
        .attr("stroke-width", 1.5)
        .attr("opacity", 1)
        .on("mouseover", function (e, d) {
          d3.select(this).attr("stroke", "#02C660");
          let tooltip = div.select(".tooltip")
          tooltip.style("visibility", "visible");
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .style("top", e.layerY + 10 + "px")
            .style("left", e.layerX -(1-idx)*400 + 60 + "px");
          tooltip.html(_this.get_info(d));
        })
        .on("mouseout", function (d) {
          let tooltip = div.select(".tooltip")
          tooltip.style("visibility", "hidden");
          // if (d3.select(this).attr("stroke") == "#FC0930") {
          //   return;
          // }
          d3.select(this).attr("stroke", "none");
        })
        

      var legend_data2 = []
      for (var k in this.round_idx) {
        legend_data2.push({"name": k, "color": this.colors[idx][this.round_idx[k]]})
      }

      //绘制图例区域
      var legendArea2 = svg.append("g").attr("transform", "translate(40,50)");
      let offset_legend = [20, 90, 120,150,180,210,240,290]

      //绑定数据，设置每个图例的位置
      var legend2 = legendArea2
        .selectAll("g")
        .data(legend_data2)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          return "translate(" + offset_legend[i] + ",10)";
        });
      //添加图例的矩形色块
      legend2
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
          return d["color"];
        });

      //添加图例文字
      legend2
        .append("text")
        .attr("x", 12)
        .attr("y", 6)
        .style("fill", function (d, i) {
          return "#000";
        })
        .attr("dy", ".35em")
        .attr("font-size", "9px")
        .text(function (d, i) {
          return d["name"];
        });
    },
    get_min_max(data, attr) {
      let min = 1e9;
      let max = 0;
      data.forEach((d) => {
        let v = d[attr];
        if (v > max) max = v;
        if (v < min) {
          min = v;
          // console.log(d["序号"]);
        }
      });
      // console.log(min, max);
      return [min, max];
    },
    get_info(d) {
      let s1 = "<tr><td style='width:56px'><b>"
      let s2 = "</b></td><td>"
      let s3 = "</td></tr>"
      var res = "<table>"
      res += s1+"产品名称"+s2 + d["name"] + s3;
      res += s1 +"所属公司"+s2 + d["vendor"] + s3;
      res += s1+"详细轮次"+s2 + d["round"] + s3;
      res += s1+"投资金额" +s2+ d["money"] +"亿元" + s3;
      res += s1+"投资年份" +s2+ d["year"] + s3;
      res += s1+"产品介绍"+s2 + d["产品介绍"]+s3+"</table>";
      return res;
    },
    data_process(data, idx) {
      let datalist = this.data[idx]
      data.forEach(d=>{
        if (d["行业"] == this.ind) {
          datalist.push({
            "name": d["产品名称"],
            "vendor": d["所属公司"],
            "round": d["轮次"],
            "year": parseInt(d["投资年份"])<2008?"before 2008":d["投资年份"],
            "money": parseFloat(d["money"]),
            "产品介绍": d["产品介绍"]
          })
        }
      })
    }
  },
  created() {
    d3.csv("../static/data_merge_tencent.csv", d=>{
      return d
    }).then(data => {
      this.data_process(data, 0)
      d3.csv("../static/data_merge_alibaba.csv", d=>{
        return d
      }).then(data => {
        this.data_process(data, 1)
        this.drawScatterplot(0)
        this.drawScatterplot(1)
      })
    })
  },
};
</script>

<style scoped>
#singlemm {
  height: 600px;
  width: 100%;
  text-align: center;
  /* display: inline-grid; */
  /* grid-template-rows: 800px;
  grid-template-columns: 400px 400px; */
}
.left_panel {
  width: 49%;
  height: 50%;
  display: inline-block;
  /* float:left; */
  background: white;
  grid-area: left;
}

.right_panel {
  width: 49%;
  height: 50%;
  display: inline-block;
  background: white;
  grid-area: right;
}
.tooltip {
    position: absolute;
    width: 300px;
    z-index: 8000;
    padding: 16px;
}

</style>