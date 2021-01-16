<template>
  <el-container id="mainview">
    <div id="header_header" />
    <el-header>
      <svg-icon name="ind_2" color="red" width="24"></svg-icon>
    </el-header>
    <el-main>
      <h1> 腾讯投资版图概览 </h1>
      <h2> （与阿里对比） </h2>
      <ul>
        <li>
          <a
            href="https://vuejs.org"
            target="_blank"
          >
            Core Docs
          </a>
        </li>
        <li>
          <a
            href="https://forum.vuejs.org"
            target="_blank"
          >
            Forum
          </a>
        </li>
        <li>
          <a
            href="https://chat.vuejs.org"
            target="_blank"
          >
            Community Chat
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/vuejs"
            target="_blank"
          >
            Twitter
          </a>
        </li>
        <br>
        <li>
          <a
            href="http://vuejs-templates.github.io/webpack/"
            target="_blank"
          >
            Docs for This Template
          </a>
        </li>
      </ul>
      
      <el-button>{{ this.mail }}</el-button>
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
    </el-main><el-main>
      <scatter />
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import scatter from './scatterplot'
import IndustryAnalysis from './IndustryAnalysis'
import SmallMultiple from './SmallMultiple'
import InvestMap from './InvestMap'
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
  background-color:rgb(219, 235, 248);
  margin-top: 8px solid rgb(219, 235, 248);
  top: 0;
  box-shadow: 0px 5px 10px -8px #000;
  z-index: 3000;
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