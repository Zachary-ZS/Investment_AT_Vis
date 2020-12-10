<template>
  <div class="hello">
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
    <scatter />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import scatter from './scatterplot'
export default {
  name: 'HelloWorld',
  components: {scatter},
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