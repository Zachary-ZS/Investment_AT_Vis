<template>
  <div id="MapGrid">
    <div id="investmap">
      <div class="tooltip"></div>
    </div>
    <div id="mapTiming">
      <h1>腾讯与阿里海外投资版图对比</h1>
      <h2>{{year}} 年 {{month}} 月</h2>
      <!-- <el-button mini round @click="timeSetTicking('reset', goon=false)">TimeTicking</el-button> -->
    </div>
    <div id="slider">
      <el-slider v-model="moon" :format-tooltip="getYM" :min='1' :max='156' :marks="slider_marks" @change="timeSetTicking('before', goon=false)" style="width:70%;display:inline-block;margin-right:30px"></el-slider>
      <el-button mini round @click="timeSetTicking('before', true)">go on</el-button>
      <el-button mini round @click="pauses()">pause</el-button>
      <el-button mini round @click="timeSetTicking('reset', goon=false)">reset</el-button>
    </div>
    <div id="invest_animation">
      <div class="animate" id="animate_t">
        <img src="@static/icon/company/tencent.png" :height="`${height_t}px`"/>
        <!-- <svg-icon v-for="i in Array(22).fill().map((_,i)=>i+1)" :key="i" :name="`ind_${i}`" :width="'30'" ></svg-icon> -->
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
      svghome: [null, null],
      mapdata: null,
      data: null,
      iconsize: 10,
      large_iconsize: 40,
      year: 2008,
      month: 1,
      moon: 1,
      mix_color: "lightgreen",
      single_color: ["lightblue", "khaki"],
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
      industries: ["文娱传媒", "游戏", "企业服务", "金融/支付", "社交社区", "电子商务", "医疗健康/生物医药", "教育培训", "直播/视频", "汽车交通", "生活服务", "工具软件", "人工智能", "电信/通信", "旅游/OTA", "科创/技术研发", "食品/商贸零售", "硬件/生产制造", "物流运输", "房产家居", "AR/VR", "其他"],
      country_inds: null,
      data_a: [],
      data_t: [],

      height_a: 60,
      height_t: 60,
      max_height: 400,
      min_height: 60,
      val: [,],
      timeout: null
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
      let _this = this
      svg.append("g")
        .selectAll("path")
        .data(this.mapdata.features)
        .join("path")
          .attr("fill", d=>{
            if (d.properties.name == "China"||d.properties.name == "Taiwan")
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
            let tooltip = d3.select("#investmap").select(".tooltip")
            let cty = d.properties.name
            // console.log(d.id)
            let ins = ''
            if (_this.country_inds[0][parseInt(d.id)].length+_this.country_inds[1][parseInt(d.id)].length==0)
              return;
            let dlist = _this.country_inds[0][parseInt(d.id)]
            if (dlist.length) {
            ins += `在 ${cty}, Tencent 投资行业有:<br />`
            // console.log(_this.country_inds[0][d.id])
            // console.log(_this.country_inds[0][d.id])
            // console.log(_this.country_inds[1][d.id])
            // console.log(parseInt(d.id))
            // console.log(_this.country_inds[0])
            dlist.sort()
            var dd = [dlist[0]]
            for (var i=1;i<dlist.length;i++) {
              if (dlist[i]!=dlist[i-1])
                dd.push(dlist[i])
            }
            console.log(dd)
            dd.forEach(d=>{
              ins += _this.industries[parseInt(d)-1] + " "
            })
            }

            dlist = _this.country_inds[1][parseInt(d.id)]
            if (dlist.length) {
            ins += `<br />在 ${cty}, Alibaba 投资行业有:<br />`
            dlist.sort()
            var dd = [dlist[0]]
            for (var i=1;i<dlist.length;i++) {
              if (dlist[i]!=dlist[i-1])
                dd.push(dlist[i])
            }
            dd.forEach(d=>{
              ins += _this.industries[parseInt(d)-1] + " "
            })
            }
            tooltip
              .html(ins)
              .style("left", e.layerX + 100 + "px")
              .style("top", e.layerY + 20 +  "px")
              .style("visibility", "visible");
          })
          .on("mouseout", function(d) {
          
          let div = d3.select("#investmap")
          let tooltip = div.select(".tooltip")
          tooltip.style("visibility", "hidden")
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
    logscale2(a) {
      let k = (60-35)/(Math.sqrt(10) - Math.sqrt(1))
      return k*(Math.sqrt(a)-Math.sqrt(1))+35
    },
    pauses() {
      clearTimeout(this.timeout)
    },
    
    timeSetTicking(mode, goon) {
      mode = typeof(mode) == 'undefined' ? "reset" : mode;
      // console.log(mode)
      if (mode=="reset") {
        this.year=2008
        this.month=1
        this.moon=1
      }
      this.svg.selectAll("#iconlayer > *").remove()
      this.svg.selectAll("path")
        .attr("fill", d=>{
            if (d.properties.name == "China" || d.properties.name == "Taiwan")
              return "red";
            return "#e0e0e0";
          })
      this.country_inds = [[],[]]
      this.svghome[0].select("#indicon").selectAll("path").attr("fill", function() {
              let th = d3.select(this).attr("colorbackup")
              let r = parseInt(th.slice(1,3), 16)
              let g = parseInt(th.slice(3,5), 16)
              let b = parseInt(th.slice(5,7), 16)
              if (r>215 && g>215 && b>215)
                return th;
              return "#c0c0c0";
            })
      this.svghome[1].select("#indicon").selectAll("path").attr("fill", function() {
              let th = d3.select(this).attr("colorbackup")
              let r = parseInt(th.slice(1,3), 16)
              let g = parseInt(th.slice(3,5), 16)
              let b = parseInt(th.slice(5,7), 16)
              if (r>215 && g>215 && b>215)
                return th;
              return "#c0c0c0";
            })

      // console.log(this.country_inds)
      for (var i=0;i<900;i++) {
        this.country_inds[0][i] = []
        this.country_inds[1][i] = []
      }
      clearTimeout(this.timeout)
      d3.csv("../static/invest_abroad.csv", d => {
        return d;
      }).then((data) => {
        this.data = data
        
        this.drawInvest("before")
        this.drawHome("before")
        
        if (goon)
          this.timeTicking()
      })   

    },
    timeset(mode) {

    },
    timeTicking() {
      this.drawInvest()
      this.drawHome()
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
            // console.log(path_c.data()[0].id)
            // console.log(this.country_inds[idxx])
            let coutryind_invested_byAT = this.country_inds[idxx][parseInt(path_c.data()[0].id)]
            let hasIdxx = (this.country_inds[idxx][parseInt(path_c.data()[0].id)].length!=0)
            let hasOther = (this.country_inds[1-idxx][parseInt(path_c.data()[0].id)].length!=0)
            if (this.country_inds[idxx][parseInt(path_c.data()[0].id)].indexOf(parseInt(d["行业"]))==-1) {
              this.country_inds[idxx][parseInt(path_c.data()[0].id)].push(d["行业"])
            }
            if (path_c.data()[0].properties.name != "Taiwan") {
            if (hasOther && (!hasIdxx)) {
              path_c
                .transition()
                .duration(500)
                .attr("fill", this.mix_color)
            } else if ((!hasOther)&&(!hasIdxx)) {
              // console.log(this.single_color[idxx])
              // console.log(this.country_inds)
              path_c
                .transition()
                .duration(500)
                .attr("fill", this.single_color[idxx])
            }
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
                .delay(800)
                .duration(500)
                .attr("width", 0)
                .attr("height", 0)
                .remove()

              
                
            })

          
        } 
      })
      // } else {
        
    },
    drawHome(mode) {
      // mode = now or before
      mode = typeof(mode) == 'undefined' ? "now" : mode;
      this.height_a = this.logscale(parseFloat(this.val[1][this.moon-1].marketvalue))
      this.height_t = this.logscale(parseFloat(this.val[0][this.moon-1].marketvalue))
      this.drawByCompany(0, mode)
      this.drawByCompany(1, mode)
      

    },
    drawByCompany(idx, mode) {
      let data = (idx==1)?this.data_a:this.data_t
      let svgid = (idx==1)?"#animate_a":"#animate_t"
      data.forEach(d=>{
        if ((
          mode == "now" && d["year"] == this.year && d["month"] == this.month
        )||(
          mode == "before" && (d["year"]<this.year || (d["year"]==this.year && d["month"]<=this.month))
        )) {
          let g = d3.select(svgid).select("#indicon")
          let svgnode = g.select(`.ind_${d["industry"]}`)
          let tmpsize = this.logscale2(d["num"])
          // console.log(tmpsize)
          svgnode
            .transition()
            .duration(400)
            .attr("width", tmpsize)
            .attr("height", tmpsize)
            .transition()
            .duration(400)
            .attr("width", 30)
            .attr("height", 30)
          svgnode.selectAll("path")
            .transition()
            .duration(400)
            .attr("fill", function() {
              return d3.select(this).attr("colorbackup")
            })
          // svgnode


        }
      })

    },
    drawHomeGraph(idx) {
      let svgid = (idx==0)?"#animate_t":"#animate_a"
      let div = d3.select(svgid)
      let svgWidth = 700
      let svgHeight = 450

      this.svghome[idx] = div.append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr("preserveAspectRatio", "none")
      let svg = this.svghome[idx]

      let y = d3
        .scaleLog()
        .domain([150,70000])
        .range([this.max_height,this.min_height])
      let axis_y = d3
        .axisLeft()
        .scale(y)
        // .ticks(3)
        .tickFormat(d=> {
          let tmp = [200, 500, 1000, 2000, 4000, 10000, 20000, 40000, 70000]
          if (tmp.indexOf(d)!=-1)
            return `${d}亿HK\$`
          return null
        })
      let axis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(350,0)")
        .call(axis_y)
      axis.selectAll("line").remove()
      axis.selectAll("path")
        .attr("stroke", "#e0e0e0")
      axis.selectAll("text")
        .attr("fill", "gray")

      let g = svg.append("g").attr("id", "indicon")
      let cx = [0, 120,120,120,120,120,120,570,570,570,570,570,570,80,80,80,80,80,610,610,610,610,610]
      let cy = [0, 410,370,330,290,250,210, 410,370,330,290,250,210, 410,370,330,290,250, 410,370,330,290,250]

      for (var i=1; i<=22; i++) {
        let _i = i
        d3.xml(`../static/icon/svg/ind_${i}.svg`, d => {
          return d;
        }).then(data => {
          var svgNode = data.getElementsByTagName("svg")[0];
          g.node().appendChild(svgNode)

          let newsvg = g.selectAll("svg")
            .filter((d,i)=>{
              return i == g.selectAll("svg").size()-1
            })
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", cx[_i])
            .attr("y", cy[_i])
            .attr("class", `ind_${_i}`)
          newsvg.append("title")
            .text(this.industries[_i-1])
          newsvg.selectAll("path")
            .attr("colorbackup", function() {
              return d3.select(this).attr("fill")
            })
          newsvg.selectAll("path")
            .attr("fill", function() {
              let th = d3.select(this).attr("fill")
              let r = parseInt(th.slice(1,3), 16)
              let g = parseInt(th.slice(3,5), 16)
              let b = parseInt(th.slice(5,7), 16)
              if (r>215 && g>215 && b>215)
                return th;
              return "#c0c0c0";
            })
          

        })
      }

    },
    // Slider Functions
    getYM(moon) {
      // console.log(moon)
      let year = Math.floor((moon-1)/12) + 2008
      let month = moon % 12 || 12
      this.year = year
      this.month = month
      return `${year}年${month}月`
    },
    data_processing(data) {
      // let data_t = [], data_a
      this.data_t.splice(0, this.data_t.length)
      this.data_a.splice(0, this.data_a.length)
      data.forEach(d=>{
        if (d["投资方"]=="腾讯") {
          this.data_t.push({
            "year": parseInt(d["year"]<2008?2007:d["year"]),
            "industry": parseInt(d["industry"])-1,
            "num": parseInt(d["num"]),
            "month": parseInt(d["month"])
          })
        } else {
          this.data_a.push({
            "year": parseInt(d["year"]<2008?2007:d["year"]),
            "industry": parseInt(d["industry"])-1,
            "num": parseInt(d["num"]),
            "month": parseInt(d["month"])
          })
        }
      })
    },
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
        // console.log(parseFloat(this.val[1][0].marketvalue))
        this.height_a = this.logscale(parseFloat(this.val[1][0].marketvalue))
        this.height_t = this.logscale(parseFloat(this.val[0][0].marketvalue))
        d3.csv("../static/industry_month_china.csv", d=>{
          return d;
        }).then(data => {
          this.data_processing(data)
          this.drawHomeGraph(0)
          this.drawHomeGraph(1)
          // console.log("tmp")
        })
      })
    })
  },
};
</script>

<style scoped>
#MapGrid {
  display: inline-grid;
  height: 950px;
  width: 100%;
  text-align: center;
  grid-template-columns: 1000px 400px;
  grid-template-rows: 420px 60px 450px;
}
#slider {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  background-color: rgba(198, 232, 235, 0.595);
  border-radius: 5px;
  padding-left: 10%;
  padding-right: 5%;
}
#invest_animation {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 3;
  /* background-color: rgb(212, 190, 233); */
  /* background-color: khaki; */
}
#mapTiming h1 {
  font-weight: normal;
}
.animate {
  text-align:center;
  position: relative;
  vertical-align: bottom;
  float: left;
  width: 50%;
  height: 100%;
  box-shadow: 0 5px 10px -7px;
}
.animate img {
  position: absolute;
  bottom: 5px;
  border-top: 1px solid #d8d8d8;
  left: 50%;
  transform: translate3d(-50%,0,0);
}

.tooltip {
    position: absolute;
    width: 200px;
    padding: 16px;
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