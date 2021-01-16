<template>
  <div id="smm">
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as d3 from "d3";
import $ from "jquery";
import '@/assets/style.css'
export default {
  name: "SmallMultiple",
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(["mail"]),
  },
  methods: {
    

  },
  created() {
    
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
