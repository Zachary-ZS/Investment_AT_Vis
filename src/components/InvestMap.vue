<template>
  <div id="MapGrid">
    <div id="investmap"></div>
    <div id="mapTiming">
      <h1>腾讯与阿里海外投资版图对比</h1>
      <h2>{{year}} 年 {{month}} 月</h2>
      <el-button mini round @click="timeSetTicking()">TimeTicking</el-button>
    </div>
    <div id="slider">
      <el-slider v-model="moon" :format-tooltip="getYM" :min='1' :max='156' :marks="slider_marks" @change="timeSetTicking('before')"></el-slider>
    </div>
    <div id="invest_animation">
      <div class="animate" id="animate_t">
        <img src="@static/icon/company/tencent.png" :height="`${height_t}px`"/>
      </div>
      <div class="animate" id="animate_a">
        <img src="@static/icon/company/alibaba.png" :height="`${height_a}px`"/>
      </div>
    </div>
    <!-- <div></div>
    <div></div> -->
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
      large_iconsize: 40,
      year: 2008,
      month: 1,
      moon: 1,
      mix_color: "lightgreen",
      single_color: ["lightblue", "lightyellow"],
      slider_marks: {
        1: "2008年",
        25: "2010年",
        49: "2012年",
        73: "2014年",
        97: "2016年",
        121: "2018年",
        145: "2020年",
        156: "2020/12"
      },
      country_inds: null,

      height_a: 60,
      height_t: 60,
      max_height: 400,
      min_height: 60,
      val: [,],
      // logscale : d3.scaleLog()
      // .domain([150, 70000])
      // .range([this.min_height, this.max_height]),
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
            if (d.properties.name == "China")
              return "red";
            return "#e0e0e0";
          })
          .attr("d", path)
          .attr("id", d=>d.properties.name.replace(/\s*/g,""))
          .attr("stroke", "white")
          .on("mouseover", function(e,d) {
            // d3.select(this).attr("fill", "skyblue")
            // let bd = d3.select(this).node().getBoundingClientRect()
            // let bdf = svg.node().getBoundingClientRect()
            // console.log(bd.x-bdf.x, bd.y-bdf.y)
          })
        .append("title")
          .text(d=>d.properties.name)

      svg.append("g")
        .attr("id", "iconlayer")
      
    },
    logscale(a) {
      let k = (this.max_height-this.min_height)/(Math.log10(70000) - Math.log10(150))
      return k*(Math.log10(a)-Math.log10(150))+this.min_height
    },
    
    timeSetTicking(mode) {
      mode = typeof(mode) == 'undefined' ? "reset" : mode;
      console.log(mode)
      if (mode=="reset") {
        this.year=2008
        this.month=1
        this.moon=1
      }
      this.svg.selectAll("#iconlayer > *").remove()
      this.svg.selectAll("path")
        .attr("fill", d=>{
            if (d.properties.name == "China")
              return "red";
            return "#e0e0e0";
          })
      this.country_inds = [[],[]]
      console.log(this.country_inds)
      for (var i=0;i<900;i++) {
        this.country_inds[0][i] = []
        this.country_inds[1][i] = []
      }
      clearTimeout(this.timeout)
      d3.csv("../static/invest_abroad.csv", d => {
        return d;
      }).then((data) => {
        this.data = data
        if (mode!="reset") {
          this.drawInvest("before")
        }
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
          this.moon++;
          this.timeTicking()
        }, 500)
      } else {
        clearTimeout(this.timeout)
      }
    },
    drawInvest(mode) {
      // console.log(this.data)
      mode = typeof(mode) == 'undefined' ? "now" : mode;
      // if (mode=="now") {
        this.data.forEach(d=>{
          if ((mode=="now" && parseInt(d["year"]) == this.year &&
          parseInt(d["month"]) == this.month)||(
            mode=="before" && (parseInt(d["year"]) < this.year || (parseInt(d["year"])==this.year && parseInt(d["month"]) < this.month))
          )) {
            let g = this.svg.select("#iconlayer")
            let path_c = this.svg.select("#"+d["region"].replace(/\s*/g,""))

            let idxx = (d["投资方"]=="阿里巴巴")?1:0
            console.log(path_c.data()[0].id)
            // console.log(this.country_inds[idxx])
            let coutryind_invested_byAT = this.country_inds[idxx][parseInt(path_c.data()[0].id)]
            let hasIdxx = (this.country_inds[idxx][parseInt(path_c.data()[0].id)].length!=0)
            let hasOther = (this.country_inds[1-idxx][parseInt(path_c.data()[0].id)].length!=0)
            if (this.country_inds[idxx][parseInt(path_c.data()[0].id)].indexOf(parseInt(d["行业"]))==-1) {
              this.country_inds[idxx][parseInt(path_c.data()[0].id)].push(d["行业"])
            }
            if (hasOther && (!hasIdxx)) {
              path_c
                .transition()
                .duration(500)
                .attr("fill", this.mix_color)
            } else if ((!hasOther)&&(!hasIdxx)) {
              console.log(this.single_color[idxx])
              console.log(this.country_inds)
              path_c
                .transition()
                .duration(500)
                .attr("fill", this.single_color[idxx])
            }

            let bd = path_c.node().getBoundingClientRect()
            let bdf = this.svg.node().getBoundingClientRect()
            // console.log(bd.x-bdf.x, bd.y-bdf.y)
            d3.xml(`../static/icon/svg/ind_${d["行业"].replace(/\s*/g,"")}.svg`, d => {
              return d;
            }).then( data => {
              var svgNode = data
                .getElementsByTagName("svg")[0];
              g.node().appendChild(svgNode)
              let newsvg = g.selectAll("svg")
                .filter((d,i)=>{
                  return i == g.selectAll("svg").size()-1
                })
                .attr("x", bd.x-bdf.x+(d["region"]=="United States of America")*150+(d["region"]=="Russia")*500)
                .attr("y", bd.y-bdf.y+(d["region"]=="United States of America")*75+5)
              newsvg.selectAll("path")
                .attr("fill", d["投资方"]=="腾讯"?"#2168DE":"#ff6a00")

              newsvg.attr("width", this.large_iconsize)
                .attr("height", this.large_iconsize)
                .transition()
                .duration(500)
                .attr("width", 0)
                .attr("height", 0)
                .remove()

              
                
            })

          
        } 
      })
      // } else {
        
    },
    // Slider Functions
    getYM(moon) {
      console.log(moon)
      let year = Math.floor((moon-1)/12) + 2008
      let month = moon % 12 || 12
      this.year = year
      this.month = month
      return `${year}年${month}月`
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
    d3.csv("../static/value_tencent.csv", d=>{
      return d;
    }).then((data)=>{
      this.val[0]=data
      d3.csv("../static/value_alibaba.csv", d=>{
        return d;
      }).then(data => {
        this.val[1]=data
        console.log(parseFloat(this.val[1][0].marketvalue))
        this.height_a = this.logscale(parseFloat(this.val[1][0].marketvalue))
        this.height_t = this.logscale(parseFloat(this.val[0][0].marketvalue))
      })
    })
  },
};
</script>

<style scoped>
#MapGrid {
  display: inline-grid;
  height: 880px;
  width: 100%;
  text-align: center;
  grid-template-columns: 1000px 400px;
  grid-template-rows: 420px 60px 400px;
}
#slider {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  background-color: antiquewhite;
  padding-left: 10%;
  padding-right: 5%;
}
#invest_animation {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 3;
  background-color: rgb(212, 190, 233);
}
#mapTiming h1 {
  font-weight: normal;
}
.animate {
  text-align:center;
  vertical-align: bottom;
  display: inline-block;
  width: 50%;
  height: 100%;
}
</style>


<!--
          g.append("svg-icon")
            .attr("name", `ind_${d["行业"]}`)
            .attr("x", bd.x-bdf.x)
            .attr("y", bd.y-bdf.y)
            .attr("width", 8)
            .attr("height", 8)
          
          g.append("svg:image")
            // .attr("src",`../static/icon/svg/ind_${d["行业"].replace(/\s*/g,"")}.svg`)
            .attr("xlink:href", `../static/icon/svg/ind_${d["行业"].replace(/\s*/g,"")}.svg`)
            .attr("x", bd.x-bdf.x)
            .attr("y", bd.y-bdf.y)
            .attr("width", 8)
            .attr("height", 8)
            .attr("style", `color:${d["投资方"]=="腾讯"?"#2168DE":"#ff6a00"}`)
            -->