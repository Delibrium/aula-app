// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
import VeeValidate from 'vee-validate'
import 'vuetify/dist/vuetify.css'
import VueQuillEditor from 'vue-quill-editor'
import VueCordova from 'vue-cordova'
import VueHead from 'vue-head'
import en from './locale/en'
import de from './locale/de'

import App from './App'
import router from './router'
import store from './store'
import api from './api'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.use(Vuetify, {
  lang: {
    locales: { de, en },
    current: 'de'
  },
  options: {
    customProperties: true
  },
  theme: {
    primary: '#00C853',
    secondary: '#2962FF',
    accent: '#00E676',
    error: '#FF0055',
    warning: '#212121',
    info: '#8C9EFF',
    success: '#00C853'
  }
})
Vue.use(VueAxios, api.service)
Vue.config.productionTip = false
Vue.use(VueCordova)
Vue.use(VueHead)

// add cordova.js only if serving the app through file://
if (window.location.protocol === 'file:' || window.location.port === '3000') {
  var cordovaScript = document.createElement('script')
  cordovaScript.setAttribute('type', 'text/javascript')
  cordovaScript.setAttribute('src', 'cordova.js')
  document.body.appendChild(cordovaScript)
}

Vue.router = router

Vue.use(VueAuth, {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  tokenDefaultName: 'auth_token',
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: {
    url: process.env.BASE_API + 'rpc/login',
    method: 'POST',
    redirect: '/',
    fetchUser: true
  },
  refreshData: { url: 'refresh', method: 'GET', enabled: false, interval: 0 },
  fetchData: { url: process.env.BASE_API + 'rpc/me', enabled: true },
  parseUserData: function (data) {
    store.commit('SET_USER', data)
    return data
  }
})

Vue.use(VeeValidate)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  head: {
    meta: [
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      }
    ]
  }
})
