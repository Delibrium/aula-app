import Vue from 'vue'
import Router from 'vue-router'
import IdeaSpaces from '@/components/IdeaSpaces'
import Admin from '@/components/Admin'
import Login from '@/components/Login'
import Ideas from '@/components/Ideas'
import Idea from '@/components/Idea'
import IdeaEdit from '@/components/IdeaEdit'
import Topic from '@/components/Topic'
import Topics from '@/components/Topics'
import TopicEdit from '@/components/TopicEdit'
import Profile from '@/components/Profile'
import ProfileEdit from '@/components/ProfileEdit'
import UserEdit from '@/components/UserEdit'
import PassList from '@/components/PassList'
import Redirect from '@/components/Redirect'
import Page from '@/components/Page'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'IdeaSpaces',
      component: IdeaSpaces,
      meta: { auth: true }
    },
    {
      path: '/space/:spaceSlug/ideas',
      name: 'Ideas',
      component: Ideas,
      meta: { auth: true }
    },
    {
      path: '/space/:spaceSlug/idea/create/:topicId?',
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
      path: '/space/:spaceSlug/topics',
      name: 'Topics',
      component: Topics,
      meta: { auth: true }
    },
    {
      path: '/space/:spaceSlug/topics/create',
      name: 'TopicCreate',
      component: TopicEdit,
      meta: { auth: true }
    },
    {
      path: '/space/:spaceSlug/topics/:topicId',
      name: 'Topic',
      component: Topic,
      meta: { auth: true }
    },
    {
      path: '/space/:spaceSlug/topics/:topicId/edit',
      name: 'TopicEdit',
      component: TopicEdit,
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
      path: '/admin/password-printout',
      name: 'PassList',
      component: PassList,
      meta: { auth: true }
    },
    {
      path: '/user/settings',
      name: 'UserEdit',
      component: UserEdit,
      meta: { auth: true }
    },
    {
      path: '/user/:userId',
      name: 'Profile',
      component: Profile,
      meta: { auth: true }
    },
    {
      path: '/user/:userId/edit',
      name: 'ProfileEdit',
      component: ProfileEdit,
      meta: { auth: true }
    },
    {
      path: '/impressum',
      name: 'Impressum',
      component: Page,
      props: { page_name: 'impressum' },
      meta: {}
    },
    {
      path: 'Redirect/:path',
      name: 'Redirect',
      component: Redirect,
      meta: { auth: true }
    }

  ]
})

router.beforeResolve((to, from, next) => {
  var selectedSchool = store.getters.selected_school
  if (to.path === '/admin') {
    next()
  }
  if (to.path !== '/login' && selectedSchool < 0 && (store.getters.user.profile.role && store.getters.user.profile.role.indexOf('admin') >= 0)) {
    next({path: '/admin'})
  } else {
    next()
  }
})

export default router
