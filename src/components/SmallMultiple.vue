<template>
  <div id="smm">
    <el-carousel ref="carousel" :autoplay="false" type="card" trigger="click" height="540px">
    <el-carousel-item v-for="idx in 22" :key="idx">
      <single-pic :ind=idx />
    </el-carousel-item>
    </el-carousel>
    <span class="footer_ind" v-for="(item,idx) in industries" :key="item" @click="$refs.carousel.setActiveItem(idx)">{{item}} </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as d3 from "d3";
import $ from "jquery";
import SinglePic from './SinglePic'
import '@/assets/style.css'
export default {
  name: "SmallMultiple",
  components: {SinglePic},
  data() {
    return {
      industries: ["文娱传媒", "游戏", "企业服务", "金融/支付", "社交社区", "电子商务", "医疗健康/生物医药", "教育培训", "直播/视频", "汽车交通", "生活服务", "工具软件", "人工智能", "电信/通信", "旅游/OTA", "科创/技术研发", "食品/商贸零售", "硬件/生产制造", "物流运输", "房产家居", "AR/VR", "其他"]
    };
  },
  computed: {
    ...mapGetters(["mail", "indus"]),
  },
  methods: {
    

  },
  watch: {
    indus: function() {
      // console.log("found")
      this.$refs.carousel.setActiveItem(this.indus-1)
    }
  },
  created() {
    
  },
};
</script>


<style scoped>
#smm {
  height: 900px;
  width: 100%;
  padding-top: 100px;
  text-align: center;
}
.footer_ind {
  font-size: 10px;
  vertical-align: top;
  display: inline-block;
  width: 38px;
}
.footer_ind:hover {
  cursor: pointer;
}



.el-carousel__item {
  /* font-size: 14px; */
  opacity: 0.1;
  height: 500px;
  width: 900px;
  /* background-color: #d3dce6; */
  /* margin: 0; */
}
.el-carousel__item.is-active {
  opacity: 1;
  border: 1px solid #000;
}
</style>
