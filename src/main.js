// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// store - vuex
import store from './store'
import router from './router'

// svg-icon
import SvgIcon from 'vue-svgicon'
Vue.use(SvgIcon, {
    tagName: 'svg-icon'
});

// Element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, {
    size: 'mini'
})


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})