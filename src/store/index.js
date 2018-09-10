import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import school from './modules/school'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    school
  },
  getters
})

export default store
