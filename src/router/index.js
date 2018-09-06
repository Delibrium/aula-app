import Vue from 'vue'
import Router from 'vue-router'
import IdeaSpaces from '@/components/IdeaSpaces'
import Admin from '@/components/Admin'
import Login from '@/components/Login'
import Ideas from '@/components/Ideas'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IdeaSpaces',
      component: IdeaSpaces,
      meta: {auth: true}
    },
    {
      path: '/space/:spaceSlug/ideas',
      name: 'Ideas',
      component: Ideas,
      meta: {auth: true}
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {auth: false}
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      meta: {auth: true}
    }

  ]
})
