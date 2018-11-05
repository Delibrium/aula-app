import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import school from './modules/school'
import getters from './getters'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const store = new Vuex.Store({
  modules: {
    user,
    school
  },
  getters,
  plugins: [vuexLocal.plugin]
})

export default store
