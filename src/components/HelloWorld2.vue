<template>
  <el-container class="mainview">
    <el-header>
      <svg-icon name="03-企业服务" color="red" width="24"></svg-icon>
    </el-header>
    <el-main>
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
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
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
    <el-button>{{ this.mail }}</el-button>
    </el-main>
    <el-main>
      <industry-analysis />
    </el-main>
    <el-main>
      <scatter />
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import scatter from './scatterplot'
import IndustryAnalysis from './IndustryAnalysis'
import '@/assets/svg/'
export default {
  name: 'HelloWorld',
  components: {scatter, IndustryAnalysis},
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
.el-header {
  position: -webkit-sticky;
  position: sticky;
  background-color: aliceblue;
  top: 0;
  box-shadow: 0px 5px 10px -8px #000;
  z-index: 3000;
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