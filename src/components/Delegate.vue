<template>
  <v-container  pa-0>
    <v-layout row wrap justify-center align-center>
      <v-flex md10 xs12>
         <Breadcrumbs :items="breadcrumbs"/>
      </v-flex>
      <v-flex md10 xs12>
        <v-card>
          <v-card-text>
            <v-layout row wrap justify-center align-center>
              <v-flex md3 v-for="user in users" :key="user.id">
                <v-card :class="{selected: selectedDelegate && user.id === selectedDelegate.id}">
                  <v-card-text @click="selectDelegate(user)" class="text-xs-center text-md-center">
                    <v-img :src="user.picture?user.picture:'/static/img/svg/Aula_Logo_Kopf.svg'" width="100" height="100"/>
                    <h2>{{user.first_name}} {{user.last_name}}</h2>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex md10 xs12 class="text-xs-center text-md-center" pt-2>
                <v-btn
                  color="primary"
                  @click="changeDelegate"
                >{{ $vuetify.t('$vuetify.Topic.changeDelegate') }}</v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import api from '@/api'
import Breadcrumbs from '@/components/Breadcrumbs'

export default {
  name: 'Delegate',
  components: { Breadcrumbs },
  data: () => ({
    users: {},
    topic: {},
    topicId: null,
    breadcrumbs: [],
    spaceName: '',
    selectedDelegate: null,
    currentDelegate: null
  }),

  props: {
  },

  beforeMount: function () {
    this.topicId = this.$route.params['topicId']
    this.spaceId = this.$route.params['spaceId']
    this.userId = this.$store.getters.user.profile.id

    api.topic.get(this.topicId)
      .then((res) => {
        this.topic = res.data[0]
        if (!this.topic.idea_space) {
          this.topic.idea_space = {'title': this.$store.getters.schoolConfig.mainSpaceName}
        }
        this.topic.meta = { editTopicsStarted: new Date() }
        this.spaceName = this.topic.idea_space.title
        api.ideaSpace.getUsers(this.$store.getters.school_id, this.topic.idea_space.id).then(res => {
          this.users = res.data.filter(u => u.id !== this.$store.getters.user.profile.id)
          this.setBreadcrumbs()
          this.getDelegate(this.topicId).then(() => {
            if (this.currentDelegate) {
              this.selectedDelegate = this.users.filter(u => u.id === this.currentDelegate.to_user)[0]
            }
          })
        })
      })
  },

  methods: {
    changeDelegate: function () {
      // If there is already a delegate
      let apiRequest
      if (this.currentDelegate) {
        apiRequest = api.topic.updateDelegate(this.topicId, this.userId, this.selectedDelegate.id)
      } else {
        apiRequest = api.topic.createDelegate(this.$store.getters.school_id, this.topicId, this.userId, this.selectedDelegate.id)
      }

      apiRequest.then(r => {
        this.$router.back()
      })
    },
    getDelegate: function (topicId) {
      return api.topic.getDelegate(topicId, this.$store.getters.user.profile.id).then(res => {
        this.currentDelegate = res.data[0]
      })
    },
    selectDelegate: function (user) {
      console.log(user)
      this.selectedDelegate = user
    },
    setBreadcrumbs: function () {
      var topicRoute

      topicRoute = {
        title: `[${this.spaceName}] ${this.$vuetify.t('$vuetify.Space.ideaTopics')}`,
        to: {
          name: 'Topic',
          params: {
            spaceSlug: this.$route.params['spaceSlug'],
            spaceId: this.spaceId
          }
        }
      }

      this.breadcrumbs = [
        { title: 'aula',
          to: '/'
        },
        topicRoute,
        {
          title: this.$vuetify.t('$vuetify.Topic.changeDelegate'),
          to: this.$route.path
        }
      ]
    }

  }
}
</script>

<style scoped lang="scss">

.v-image {
   margin: auto;
}

.selected {
  background-color: var(--v-primary-base);
}
</style>
