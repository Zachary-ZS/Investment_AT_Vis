<template>
  <el-container id="mainview">
    <div id="header_header" />
    <el-header>
    <!-- <span id="web_title">Tencent VS Alibaba</span> -->
      <!-- <svg-icon name="ind_2" width="24"></svg-icon> -->
      <a href="#"><img src="@static/icon/title.png" style="height:40px"/></a>
      <el-menu background-color="#dbebf8" class="el-menu-demo" mode="horizontal" style="height: 55px; display:inline-block;">
        <!-- <el-menu-item index="0" id="web_title">Tencent VS Alibaba
        </el-menu-item> -->
        <el-menu-item index="1"><a href="#invest_analysis">行业数据对比</a>
        </el-menu-item>
        <el-menu-item index="2"><a href="#MapGrid">海外投资版图</a>
        </el-menu-item>
        <el-menu-item index="3"><a href="#slider">国内行业扩张</a>
        </el-menu-item>
      </el-menu>    
    </el-header>
    <el-main>
      <el-carousel type="card" trigger="click" height="400px">
      <el-carousel-item v-for="item in 8" :key="item">
        <img :src="`../static/intro/${item}.png`" style="border: 2px solid #000; width:99%;vertical-align:center;" />
      </el-carousel-item>
    </el-carousel>


    </el-main>
    <el-main>
      <h1 style="margin: 10px;">腾讯与阿里投资行业对比</h1>
      <industry-analysis />
    </el-main>
    <el-main>
      <small-multiple />
    </el-main>
    <el-main>
      <invest-map />
    </el-main>
    <!-- <el-main>
      <scatter />
    </el-main> -->
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import scatter from './scatterplot'
import IndustryAnalysis from './IndustryAnalysis'
import SmallMultiple from './SmallMultiple'
import InvestMap from './InvestMap'
// import banner from './banner'
import '@/assets/svg/'
export default {
  name: 'HelloWorld',
  components: {scatter, IndustryAnalysis, SmallMultiple, InvestMap},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
  computed: {
      ...mapGetters([
          'mail'
      ])
  },
  created() {
      console.log(this.mail)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#header_header {
  background-color: rgb(219, 235, 248);
  height: 10px;
}
.el-header {
  position: -webkit-sticky;
  position: sticky;
  /* border-bottom: 2px solid rgb(219, 235, 248); */
  background-color:rgb(219, 235, 248);
  margin-top: 8px solid rgb(219, 235, 248);
  top: 0;
  box-shadow: 0px 5px 10px -8px #000;
  z-index: 3000;
  vertical-align: top;
}
/deep/.el-header .el-menu #web_title:hover {
  background-color: white;
}
.el-main {
  position: sticky;
  background-color: white;
  top: 0;
  padding-left: 5%;
  padding-right: 5%;
  box-shadow: 0px -5px 10px -8px #000;
}
.el-main:nth-child(2n) {
  background-color: rgb(243, 247, 251);
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
  text-decoration: none;
}

.el-carousel__item {
  font-size: 14px;
  opacity: 0.25;
  line-height: 200px;
  /* background-color: #d3dce6; */
  margin: 0;
}
.el-carousel__item.is-active {
  opacity: 1;
}


</style>

<!--

<template>
  <div>
      <div>hello d3</div>
  </div>
</template>
 
<script>
import * as d3 from 'd3';//引入d3
export default {
      data() {
      return {
        name: "我的名字是test01",
      }
      },
      methods:{
      }, 
      created(){
      },
      mounted(){
          console.log(d3)
      },
      beforeMount(){
      },
      watch: {
    //     number(newValue, oldValue) {
    //   }
      },
      components: {},
      //props: ['name'],
      
}
</script>
 
<style>
 
</style>

-->