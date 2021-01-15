<template>
  <div id="analysis">
      <div id="scatter_t">
      </div>
      <div id="industry_note">
      <el-button v-on:click="get_ordered_industry()"></el-button>
      <transition-group  tag="div">
          <p v-for="(item,key) in this.ordered_industry" :key="key">{{item}}</p>
          
      </transition-group></div>
      <div id="scatter_a">
      </div>
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
      svg: null,
      years: ["before 2008", "2008", "2009", "2010", "2011", '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
      industries: ["文娱传媒", "游戏", "企业服务", "金融/支付", "社交社区", "电子商务", "医疗健康/生物医药", "教育培训", "直播/视频", "汽车交通", "生活服务", "工具软件", "人工智能", "电信/通信", "旅游/OTA", "科创/技术研发", "食品/商贸零售", "硬件/生产制造", "物流运输", "房产家居", "AR/VR", "其他"],
      ind_order: null,
      ordered_industry: null,
      
    };
  },
  computed: {
    ...mapGetters(["mail"]),
  },
  methods: {
    
    drawScatter() {
      let div = d3.select("#scatter_t");
      let svgWidth = 600;
      let svgHeight = 600;
      
      console.log(div)
      this.svg=div
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr("preserveAspectRatio", "none")
        // .attr("viewBox", [0, 0, svgWidth, svgHeight]);
      // .classed("svg-content-responsive", true)

      let x = d3
        .scalePoint()
        .domain(this.years)
        .range([0, svgWidth-4*this.industries.length-6]);
      // x.nice();
      let axis_x = d3.axisBottom()
        .scale(x)
        // .ticks(this.years.length)
        // .tickFormat(d => d)

      let axis = this.svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${78}, ${svgHeight-4*this.industries.length-4})`)
        .call(axis_x)
        .attr('font-size', '0.5rem')
      axis.select('path').remove()
      axis.selectAll('line').remove()


      this.svg.selectAll('line.xline')
      .data(this.years)
      .enter()
      .append("line")
      .attr('class', 'xline')
      .attr('x1', (d,i)=>{
        return (svgWidth/this.years.length-4)* i+78;
      })
      .attr('x2', (d,i)=>{
        return (svgWidth/this.years.length-4) * i+78;
      })
      .attr('y1', 0)
      .attr('y2', svgHeight-4*this.industries.length-4)
      .attr('stroke', '#f8f8f8')
      .attr('stroke-width', '1px');

      this.svg.selectAll('line.yline')
      .data(this.industries)
      .enter()
      .append("line")
      .attr('class', 'yline')
      .attr('y1', (d,i)=>{
        return (svgHeight/this.industries.length-4) * i+2;
      })
      .attr('y2', (d,i)=>{
        return (svgHeight/this.industries.length-4) * i+2;
      })
      .attr('x1', 76)
      .attr('x2', svgWidth-4*this.years.length+70)
      .attr('stroke', '#e4e4e4')
      .attr('stroke-width', '1px');


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
    get_ordered_industry() {
      console.log(this.ind_order)
      if (this.ind_order == null) {
        this.ordered_industry = this.industries;
        this.ind_order = [0,1,2,3,4,5,6,7,15,9,10,11,12,13,14,8,16,17,18,19,20,21]
        console.log(this.ind_order)
        return;
      }
      var res = []
      this.ind_order.forEach(idx=>{
        res.push(this.industries[idx])
      })
      console.log(res)
      this.ordered_industry = res;
    }


  },
  created() {
    this.get_ordered_industry()
  },
  mounted() {
    
    // console.log(this.mail);
    // d3.csv("@/../static/final.csv", (d) => {
    //   return d;
    // }).then((data) => {
    //     console.log(data)
      this.drawScatter();

    // });
  },
};
</script>


<style scoped>
#analysis {
  display: inline-grid;
  height: 640px;
  width: 95%;
  grid-template-columns: 46% 8% 46%;
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
#industry_note {
  width: auto;
  height: 100%;
  font-size: 12px;
}
#industry_note p {
  margin: 7.3px;
  overflow: hidden;
  /* text-overflow:ellipsis; */
  white-space: nowrap;
}
#scatter_a {
    width: 640px;
}

.v-enter,.v-leave-to {
            opacity: 0;
            transform: translateY(100px);
        }

        .v-enter-active,.v-leave-active {
            transition: all 1s ease;
        }
        
        .v-move {
            transition: all 1s ease;
        }

        .v-leave-active {
            position: absolute;
        }

/* .tooltip {
    position: absolute;
}
div {
    position: relative;
} */
</style>
