<template>
  <div id="analysis">
      <div id="scatter_t">
        <div class="tooltip"></div>
      </div>
      <div id="industry_note">
          <p v-for="item in this.get_ordered_industry()" :key="item.key">{{item}}</p>
      </div>
      <div id="scatter_a">
        <div class="tooltip"></div>
      </div>
      <div id="stack_t"></div>
      <div id="note_null">
        <el-radio-group style="margin-bottom:10px" v-model="range" @change="flushrange()">
          <el-radio-button label="china">国内</el-radio-button>
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="abroad">国外</el-radio-button>
        </el-radio-group>
        <p style="margin:0px;font-size:6px;" v-for="(item,key) in this.types" :key="key">
          <span :style="`border:1px solid #000;background-color:${color_list_t[key]}`">&emsp;</span><span style="display:inline-block;width:70px">{{item}}</span>
          <span :style="`border:1px solid #000;background-color:${color_list_a[key]}`">&emsp;</span>
        </p>
        
        
      </div>
      <div id="stack_a"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as d3 from "d3";
import $ from "jquery";
import '@/assets/style.css'
export default {
  name: "IndustryAnalysis",
  data() {
    return {
      svg: [null, null, null, null],
      svgWidth: 600,
      svgHeight: 560,
      range: "all",
      years: ["before 2008", "2008", "2009", "2010", "2011", '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
      industries: ["文娱传媒", "游戏", "企业服务", "金融/支付", "社交社区", "电子商务", "医疗健康/生物医药", "教育培训", "直播/视频", "汽车交通", "生活服务", "工具软件", "人工智能", "电信/通信", "旅游/OTA", "科创/技术研发", "食品/商贸零售", "硬件/生产制造", "物流运输", "房产家居", "AR/VR", "其他"],
      types: ["100亿及以上", "10-100亿", "1-10亿", "1000万-1亿", "1000万以下"],
      ind_order: null,
      data_a: [],
      data_t: [],
      amount_a: [],
      amount_t: [],
      color_list_a: [],
      color_list_t: []
      
    };
  },
  computed: {
    ...mapGetters(["mail"]),
  },
  methods: {
    
    drawScatter(idx) {
      var svgid=(idx? "#scatter_a":"#scatter_t")
      let div = d3.select(svgid);
      // let svgWidth = 640;
      // let svgHeight = 640;
      
      this.svg[idx]=div
        .append("svg")
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight-60)
        .attr("preserveAspectRatio", "none")

      // alibaba scatter, range changed
      let range_x = idx?[505, 0]:[0, 505]
      
      let x = d3
        .scalePoint()
        .domain(this.years)
        .range(range_x);
      // x.nice();
      let axis_x = d3.axisBottom()
        .scale(x)
        // .ticks(this.years.length)
        // .tickFormat(d => d)

      let axis = this.svg[idx].append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${(idx?14:78)}, ${this.svgHeight-4*this.industries.length+6})`)
        .call(axis_x)
        .attr('font-size', '0.5rem')
      axis.select('path').remove()
      axis.selectAll('line').remove()


      this.svg[idx].selectAll('line.xline')
      .data(this.years)
      .enter()
      .append("line")
      .attr('class', 'xline')
      .attr('x1', (d,i)=>{
        return (this.svgWidth/this.years.length-4)* i+(idx?14:78);
      })
      .attr('x2', (d,i)=>{
        return (this.svgWidth/this.years.length-4)* i+(idx?14:78);
      })
      .attr('y1', 20)
      .attr('y2', this.svgHeight-4*this.industries.length+16)
      .attr('stroke', '#f8f8f8')
      .attr('stroke-width', '1px');

      this.svg[idx].selectAll('line.yline')
      .data(this.industries)
      .enter()
      .append("line")
      .attr('class', 'yline')
      .attr('y1', (d,i)=>{
        return (this.svgHeight/this.industries.length-4) * i+22;
      })
      .attr('y2', (d,i)=>{
        return (this.svgHeight/this.industries.length-4) * i+22;
      })
      .attr('x1', idx?0:76)
      .attr('x2', this.svgWidth-4*this.years.length+(idx?-24:70))
      .attr('stroke', '#e4e4e4')
      .attr('stroke-width', '1px');

      this.drawPoints(idx)

    },
    drawPoints(idx) {
      let data = idx?this.data_a:this.data_t;
      let svg = this.svg[idx]

      let colorscale = d3
        .scaleLog()
        .domain(this.get_min_max(data, "avg", true))
        .range([255, 6])
      let sizescale = d3
        .scaleSqrt()
        .domain(this.get_min_max(data, "num"))
        .range([3, 14])

      svg.selectAll("circle").remove()

      let _this = this
      svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", (d)=>"circle")
        .attr("fill", d=>{
          let vl = colorscale(d["avg"])
          if (isNaN(vl))
            return "#eee";
          if (idx)
            return d3.rgb(255,vl,255);
          return d3.rgb(vl,vl,255)
        })
        .attr("cx", (d,i)=>{
          if (idx)
            return (this.svgWidth/this.years.length-4)*(2020-d["year"])+(idx?14:78);  
          return (this.svgWidth/this.years.length-4)*(d["year"]-2007)+(idx?14:78);
          
        })
        .attr("cy", (d,i)=>{
          return (this.svgHeight/this.industries.length-4)*d["industry"]+22;
        })
        .attr("r", d=>{
          return sizescale(d["num"])
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("opacity", 1)
        .on("mouseover", function(e,d) {
          d3.select(this).attr("stroke-width", 1.8)
          let instruction1 = `<p><b>${d["year"]}年</b>，<b>${idx?"阿里巴巴":"腾讯"}</b>在<b>${_this.industries[d["industry"]]}</b>行业投资了<b>${d["num"]}家</b>公司，`
          let instruction2 = d["avg"]?`平均投资金额为<b>${Math.round(d["avg"]/1e5)/1e3}亿</b>RMB</p>`:"投资金额未披露</p>"

          let svgid=(idx? "#scatter_a":"#scatter_t")
          let div = d3.select(svgid)
          let tooltip = div.select(".tooltip")
          
          tooltip
            .html(instruction1+instruction2)
            .style("left", e.layerX + 10+ (1-idx)*50 + "px")
            .style("top", e.layerY + 20 +  "px")
            .style("visibility", "visible");
        })
        .on("mouseout", function(d) {
          d3.select(this).attr("stroke-width", 1)
          let svgid=(idx? "#scatter_a":"#scatter_t")
          let div = d3.select(svgid)
          let tooltip = div.select(".tooltip")
          tooltip.style("visibility", "hidden")
        })


    },
    get_ordered_industry() {
      if (this.ind_order == null)
        return this.industries;
      var res = []
      this.ind_order.forEach(idx=>{
        res.push(this.industries[idx])
      })
      return res;
    },
    drawStack(idx) {
      let data = idx?this.amount_a:this.amount_t;
      var svgid=(idx? "#stack_a":"#stack_t")
      let div = d3.select(svgid);
      let svgWidth = 600;
      let svgHeight = 120;
      // console.log(data)
      let cl = idx?this.color_list_a:this.color_list_t;
      cl.splice(0, cl.length)
      this.types.forEach(d=>{
        cl.push(this.get_type_color(d, idx))
      })
      
      if (this.svg[idx+2] == null) {
        this.svg[idx+2]=div
          .append("svg")
          .attr('width', svgWidth)
          .attr('height', svgHeight)
          .attr("preserveAspectRatio", "none")
      }
      this.svg[idx+2].selectAll("svg > *").remove()
        
      let series = d3.stack()
        .keys(this.types)
        .offset(d3.stackOffsetExpand)
      (data)


      let range_x = idx?[483, 14]:[116, 585]
      let x = d3.scaleTime()
        .domain(d3.extent(data, d => d.year))
        .range(range_x)
      let y = d3.scaleLinear()
        .range([0, svgHeight])
      let area = d3.area()
        .x(d => x(d.data.year))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
      
      this.svg[idx+2].append("g")
        .selectAll("path")
        .data(series)
        .join("path")
          .attr("fill", ({key}) => this.get_type_color(key, idx))
          .attr("d", area)
        .append("title")
          .text(({key}) => key);

    },
    get_type_color(type, idx) {
      let data = idx?this.data_a:this.data_t;
      let colorscale = d3
        .scaleLog()
        .domain(this.get_min_max(data, "avg", true))
        .range([255, 6])
      let amount=0
      switch (type) {
        case "1000万以下": amount = 10000000; break;
        case "1000万-1亿": amount = 50000000; break;
        case "1-10亿": amount = 400000000; break;
        case "10-100亿": amount = 3000000000; break;
        case "100亿及以上": amount = 20000000000;
      }
      let vl = colorscale(amount)
      if (idx)
        return d3.rgb(255,vl,255);
      return d3.rgb(vl,vl,255);
    },
    flushrange() {
      // if (range == this.range) 
      //   return;
      // this.range = range;
      d3.csv(`../static/industry_year_${this.range}.csv`, (d) => {
        return d;
      }).then((data) => {
        this.data_processing(data);
        this.drawPoints(0);
        this.drawPoints(1);
      });
      d3.csv(`../static/amount_year_${this.range}.csv`, (d) => {
        return d;
      }).then((data) => {
        this.amount_processing(data);
        this.drawStack(0);
        this.drawStack(1);
      })

    },


    data_processing(data) {
      // let data_t = [], data_a
      this.data_t.splice(0, this.data_t.length)
      this.data_a.splice(0, this.data_a.length)
      data.forEach(d=>{
        if (d["投资方"]=="腾讯") {
          this.data_t.push({
            "year": parseInt(d["年份"]<2008?2007:d["年份"]),
            "industry": parseInt(d["行业"])-1,
            "num": parseInt(d["数量"]),
            "avg": parseFloat(d["平均数"])
          })
        } else {
          this.data_a.push({
            "year": parseInt(d["年份"]<2008?2007:d["年份"]),
            "industry": parseInt(d["行业"])-1,
            "num": parseInt(d["数量"]),
            "avg": parseFloat(d["平均数"])
          })
        }
      })
      // console.log(this.data_t)
      // console.log(this.data_a)

    },
    amount_processing(data) {
      this.amount_t.splice(0, this.amount_t.length)
      this.amount_a.splice(0, this.amount_a.length)
      data.forEach(d=>{
        if (d["投资方"]=="腾讯") {
          this.amount_t.push({
            "year": parseInt(d["年份"]),
            "1000万以下": 0||parseInt(d["1000万以下"]),
            "1000万-1亿": 0||parseInt(d["1000万-1亿"]),
            "1-10亿": 0||parseInt(d["1-10亿"]),
            "10-100亿": 0||parseInt(d["10-100亿"]),
            "100亿及以上": 0||parseInt(d["100亿及以上"])
          })
        } else {
          this.amount_a.push({
            "year": parseInt(d["年份"]),
            "1000万以下": 0||parseInt(d["1000万以下"]),
            "1000万-1亿": 0||parseInt(d["1000万-1亿"]),
            "1-10亿": 0||parseInt(d["1-10亿"]),
            "10-100亿": 0||parseInt(d["10-100亿"]),
            "100亿及以上": 0||parseInt(d["100亿及以上"])
          })
        }
      })

    },
    get_min_max(data, attr, ignore_zero=false) {
      let min = 1e13;
      let max = 0;
      data.forEach((d) => {
        let v = d[attr];
        if (v > max) max = v;
        if ((ignore_zero && v && v < min) ||
          (!ignore_zero && v<min))
          min = v;
      });
      return [min, max];
    }

  },
  created() {
    // console.log(this.mail);
    d3.csv("../static/industry_year_all.csv", (d) => {
      return d;
    }).then((data) => {
      this.data_processing(data);
      this.drawScatter(0);
      this.drawScatter(1);
    });
    d3.csv("../static/amount_year_all.csv", (d) => {
      return d;
    }).then((data) => {
      this.amount_processing(data);
      this.drawStack(0);
      this.drawStack(1);
    })
  },
};
</script>


<style scoped>
#analysis {
  display: inline-grid;
  height: 680px;
  width: 100%;
  text-align: center;
  grid-template-columns: 45% 9% 46%;
  grid-template-rows: 510px 140px;
}
.axis path {
  visibility: hidden;
  color: aqua;
  fill: none;
}
#scatter_t {
    /* width: 640px; */
    padding-top: 10px;
    text-align: right;
}
#stack_t {
  text-align: right;
}
#industry_note {
  width: auto;
  /* height: 100%; */
  font-size: 12px;
  padding-top: 17px;
}
#industry_note p {
  margin: 5.6px;
  overflow: hidden;
  /* text-overflow:ellipsis; */
  white-space: nowrap;
}
#scatter_a {
    /* width: 640px; */
    padding-top: 10px;
    text-align: left;
}
#stack_a {
  text-align: left;
}
/deep/.el-radio-group .el-radio-button .el-radio-button__inner {
  padding: 6px;
}

.tooltip {
    position: absolute;
    width: 200px;
    padding: 16px;
}
#scatter_t,#scatter_a {
    position: relative;
}
</style>
