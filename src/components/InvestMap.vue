<template>
  <div id="MapGrid">
    <div id="investmap"></div>
    <div id="mapTiming" style="background-color: aliceblue">
      <h2>{{year}} 年 {{month}} 月</h2>
      <el-button mini round @click="timeSetTicking">TimeTicking</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as d3 from "d3";
import * as topojson from 'topojson'
import $ from "jquery";
import '@/assets/style.css';
export default {
  name: 'InvestMap',
  data() {
    return {
      svgWidth: 960,
      svgHeight: 420,
      svg: null,
      mapdata: null,
      data: null,
      iconsize: 10,
      year: 2008,
      month: 1
    }
  },
  computed: {
    ...mapGetters(["mail"]),
  },
  methods: {
    
    drawMap() {
      let div = d3.select("#investmap")
      let svgWidth = this.svgWidth
      let svgHeight = this.svgHeight

      this.svg = div.append("svg")
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .attr("preserveAspectRatio", "none")
      
      // console.log(this.mapdata)
      let projection = d3.geoEqualEarth()
      let path = d3.geoPath(projection)
      // let color = d3.scale

      let svg = this.svg
      svg.append("g")
        .selectAll("path")
        .data(this.mapdata.features)
        .join("path")
          .attr("fill", d=>{
            return "#c4e8b4";
          })
          .attr("d", path)
          .attr("id", d=>d.properties.name.replace(/\s*/g,""))
          .attr("stroke", "white")
          .on("mouseover", function(e,d) {
            let bd = d3.select(this).node().getBoundingClientRect()
            let bdf = svg.node().getBoundingClientRect()
            // console.log(bd)
            console.log(bd.x-bdf.x, bd.y-bdf.y)
          })
        .append("title")
          .text(d=>d.properties.name)

      svg.append("g")
        .attr("id", "iconlayer")
      
    },
    timeSetTicking() {
      this.year=2008
      this.month=1
      this.svg.selectAll("#iconlayer > *").remove()
      clearTimeout(this.timeout)
      d3.csv("../static/invest_abroad.csv", d => {
        return d;
      }).then((data) => {
        this.data = data
        this.timeTicking()   
      })   

    },
    timeTicking() {
      this.drawInvest()
      if (this.year != 2020 || this.month != 12) {
        this.timeout = setTimeout(()=>{
          if (this.month<12)
            this.month++;
          else {
            this.year++;
            this.month=1;
          }
          this.timeTicking()
        }, 800)
      } else {
        clearTimeout(this.timeout)
      }
    },
    drawInvest() {
      // console.log(this.data)
      this.data.forEach(d=>{
        if (parseInt(d["year"]) == this.year &&
        parseInt(d["month"]) == this.month) {
          let g = this.svg.select("#iconlayer")
          let path_c = this.svg.select("#"+d["地区"].replace(/\s*/g,""))
            
          console.log(path_c)
          let bd = path_c.node().getBoundingClientRect()
          let bdf = this.svg.node().getBoundingClientRect()
          console.log(bd.x-bdf.x, bd.y-bdf.y)
          // g.append("svg-icon")
          //   .attr("name", `ind_${d["行业"]}`)
          //   .attr("x", bd.x-bdf.x)
          //   .attr("y", bd.y-bdf.y)
          //   .attr("width", 8)
          //   .attr("height", 8)
          
          // g.append("svg:image")
          //   // .attr("src",`../static/icon/svg/ind_${d["行业"].replace(/\s*/g,"")}.svg`)
          //   .attr("xlink:href", `../static/icon/svg/ind_${d["行业"].replace(/\s*/g,"")}.svg`)
          //   .attr("x", bd.x-bdf.x)
          //   .attr("y", bd.y-bdf.y)
          //   .attr("width", 8)
          //   .attr("height", 8)
          //   .attr("style", `color:${d["投资方"]=="腾讯"?"#2168DE":"#ff6a00"}`)
          d3.xml(`../static/icon/svg/ind_${d["行业"].replace(/\s*/g,"")}.svg`, d => {
            return d;
          }).then( data => {
            var svgNode = data
              .getElementsByTagName("svg")[0];
            // svgNode.x = bd.x-bdf.x
            // svgNode.y = bd.y-bdf.y
            g.node().appendChild(svgNode)
            g.selectAll("svg")
              .filter((d,i)=>{
                return i == g.selectAll("svg").size()-1
              })
              .attr("x", bd.x-bdf.x)
              .attr("y", bd.y-bdf.y)
              .attr("width", this.iconsize)
              .attr("height", this.iconsize)
              .selectAll("path")
                .attr("fill", d["投资方"]=="腾讯"?"#2168DE":"#ff6a00")
            // .attr("color", d["投资方"]=="腾讯"?"#2168DE":"#ff6a00")
            // .attr("style", `color:${d["投资方"]=="腾讯"?"#2168DE":"#ff6a00"}`)
          })

          
        } 
      })
    }
  },
  created() {
    d3.json('../static/countries-50m.json', (d) => {
      return d;
    }).then((data) => {
      this.mapdata = topojson.feature(data, data.objects.countries)
      // console.log(this.mapdata)
      this.drawMap();
      // this.timeSetTicking();
    });
  },
};
</script>

<style scoped>
#MapGrid {
  display: inline-grid;
  height: 640px;
  width: 100%;
  text-align: center;
  grid-template-columns: 1000px auto;
}
</style>
