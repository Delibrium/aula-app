import Vue from 'vue'
import Router from 'vue-router'
import IdeasSpaces from '@/components/IdeasSpaces'
import Admin from '@/components/Admin'
import Login from '@/components/Login'
import Ideas from '@/components/Ideas'
import Idea from '@/components/Idea'
import IdeaEdit from '@/components/IdeaEdit'
import Profile from '@/components/Profile'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'IdeasSpaces',
      component: IdeasSpaces,
      meta: { auth: true }
    },
    {
      path: '/space/:spaceSlug/ideas',
      name: 'Ideas',
      component: Ideas,
      meta: { auth: true }
    },
    {
      path: '/space/:spaceSlug/idea/create',
      name: 'IdeaCreate',
      component: IdeaEdit,
      meta: { auth: true }
    },
    {
      path: '/space/:spaceSlug/idea/:ideaId/view',
      name: 'IdeaView',
      component: Idea,
      meta: { auth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { auth: false }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      meta: { auth: true }
    },
    {
      path: '/user/:userId',
      name: 'Profile',
      component: Profile,
      meta: { auth: true }
    }

  ]
})

router.beforeResolve((to, from, next) => {
  var selectedSchool = store.getters.selected_school
  if (to.path === '/admin') {
    next()
  }
  console.log('FROM', from)
  if (to.path !== '/login' && selectedSchool < 0 && (store.getters.user.user.role.indexOf('admin') >= 0)) {
    next({path: '/admin'})
  } else {
    next()
  }
})

export default router
