# Investment_AT_VIS

> A vue.js project using d3.js to visualize Tencent and Alibaba's investment activities.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

已经build完成，见`/dist`目录

## 项目架构

采用vue架构，组件化编程，把所有的东西都视为组件，组织条理比较清晰。

- static/ 静态资源
  - icon/svg svg图标
  - 项目直接使用的数据文件
- src/ 源代码
  - store/ 状态管理
  - main.js App.vue 项目入口
  - components/
    - HelloWorld2.vue 主页大框架组件
    - IndustryAnalysis.vue 行业投资对比概览视图
    - SmallMultiple.vue 分行业投资对比视图
    - SmallPic.vue 分行业投资对比的单个小图组件，单行业视图
    - InvestMap.vue 海外投资与国内行业扩张视图
  


组件树示意：
```
- App
  - HelloWorld2
    - el-header -> el-menu
    - el-main -> el-carousel
    - el-main -> IndustryAnalysis
    - el-main -> SmallMultiple -> el-carousel -> SmallPic
    - el-main -> InvestMap
```


