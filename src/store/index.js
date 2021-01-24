import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

Vue.use(Vuex)

const user = {
    state: {
        mail: 'test@gmail.com',
        indus: -1
    },

    mutations: {
        SET_MAIL: (state, mail) => {
            state.mail = mail;
        },
        SET_IND: (state, ind) => {
            state.indus = ind;
        }
    },
    actions: {
        setIndustry({ commit }, ind) {
            commit("SET_IND", ind)
        }
    }

}


// vuex的基础属性包括5类：state（储存基础数据和状态），mutations（只有声明的指令才能改变state，且需要commit调用），actions（进行异步调用，且触发commit） , getter （state中数据的预处理，类似compute, module
const store = new Vuex.Store({
    modules: {
        user
    },
    getters
})

export default store