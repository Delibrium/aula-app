<template>
  <v-container fluid grid-list-md>
      <v-layout row wrap align-center>
        <v-flex md10 xs12 offset-md1 color="green" class='tab-nav'>
          <v-card dark color="green" width="50%" style="float: left" height="100%">
            <router-link :to="{ name: 'Ideas', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}">
              <v-card-text class="text-md-center text-xs-center">{{ $vuetify.t('$vuetify.Space.wildIdeas') }}</v-card-text>
            </router-link>
          </v-card>
          <v-card dark color="gray" width="50%" style="float: left" height="100%">
            <router-link :to="{ name: 'Topics', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}">
              <v-card-text class="text-md-center text-xs-center">{{ $vuetify.t('$vuetify.Space.ideaTopics') }}</v-card-text>
            </router-link>
          </v-card>
        </v-flex>


        <v-flex md8 offset-md2 xs12 align-center justify-center>
          <h1 class="text-md-left text-xs-left">
            {{ topic.title }}
          </h1>
        </v-flex>
        <v-flex md8 offset-md2 xs12 align-center justify-center>
          <p class="text-md-left text-xs-left">
            {{ topic.description }}
          </p>
        </v-flex>

        <v-flex v-if="this.userMayCreateIdeas()" xs12 md8 offset-md2 pa-2 align-center justify-center text-md-center text-xs-center>
          <router-link :to="{ name: 'IdeaCreate', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}">
            <v-btn round color="green" dark>{{ $vuetify.t('$vuetify.Space.newIdea') }}</v-btn>
          </router-link>
        </v-flex>
        <v-flex md8 offset-md2>
          <Filters></Filters>
        </v-flex>
        <v-flex  xs12 md8 offset-md2 pa-2>
          <IdeaListing :ideas="ideas" :topic="topic" />
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import api from '@/api'
import Filters from '@/components/Filters'
import IdeaListing from '@/components/IdeaListing'
import { isUserMemberOf } from '../utils/permissions'

export default {
  name: 'Topic',
  components: { Filters, IdeaListing },
  computed: {
    spaceId: function () { return this.$route.params['spaceId'] },
    topicId: function () { return this.$route.params['topicId'] }
  },

  data: function () {
    return {
      tab: 1,
      topic: null,
      ideas: []
    }
  },

  beforeMount: function () {
    this.getTopic()
    this.getIdeas()
  },

  methods: {
    userMayCreateIdeas: function () {
      return !isUserMemberOf(['school_admin', 'principal'])
    },
    openIdea: function (idea) {
      this.$router.push({name: 'IdeaView', params: { spaceSlug: this.$route.params['spaceSlug'], ideaId: idea.id }})
    },

    getTopic: function () {
      api.topic.get(this.topicId)
        .then((res) => {
          this.topic = res.data[0]
        })
    },
    getIdeas: function () {
      api.topic.getIdeas(this.topicId)
        .then((res) => {
          this.ideas = res.data
        })
    }
  }
}
</script>


<style scoped lang="scss">
  .tab-nav {
    margin-bottom: 2em;
  }

  .tab-nav a {
    font-size: 1.4em;
    color: white;
    text-decoration: none;
  }
</style>
