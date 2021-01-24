import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld2 from '@/components/HelloWorld2'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld2
    }, {
        path: '/MapGrid',
        // component: import('./components/InvestMap'),
        name: 'InvestMap'
    }]
})