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
          <h1 class="text-md-left text-xs-left">Was soll sich verändern?</h1>
        </v-flex>
        <v-flex md8 offset-md2 xs12 align-center justify-center>
          <p class="text-md-left text-xs-left">
            Du kannst hier jede lose Idee, die du im Kopf hast, einwerfen und
ka  nnst für die Idee abstimmen und diese somit "auf den Tisch bringen".
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
        <v-flex  xs12 md8 offset-md2 pa-2 align-center justify-center text-md-center text-xs-center>
          <IdeaListing :ideas="ideas" :isTopic="false" />
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import * as api from '@/api/ideaSpace'
import Filters from '@/components/Filters'
import IdeaListing from '@/components/IdeaListing'
import { isUserMemberOf } from '../utils/permissions'

export default {
  name: 'Ideas',
  components: { Filters, IdeaListing },
  data: function () {
    return {
      tab: 0,
      ideas: [],
      spaceId: this.$route.params['spaceId']
    }
  },

  props: {
    spaceSlug: ''
  },

  beforeMount: function () {
    if (!this.spaceId) {
      api.getSpace(this.$store.getters.selected_school, this.$route.params['spaceSlug'])
        .then((res) => {
          console.log(res)
          this.spaceId = res.data[0].id
          this.getIdeas(this.$store.getters.selected_school, this.spaceId)
        })
    } else {
      this.getIdeas(this.$store.getters.selected_school, this.spaceId)
    }
  },

  methods: {
    userMayCreateIdeas: function () {
      return !isUserMemberOf(['school_admin', 'principal'])
    },
    openIdea: function (idea) {
      this.$router.push({name: 'IdeaView', params: { spaceSlug: this.$route.params['spaceSlug'], ideaId: idea.id }})
    },

    getIdeas: function (schoolId, spaceId) {
      api.getIdeas(schoolId, spaceId).then((res) => {
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
