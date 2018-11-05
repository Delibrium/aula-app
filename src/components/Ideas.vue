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

          <v-flex  xs12 md8 offset-md2 pa-2 align-center justify-center text-md-center text-xs-center>
            <router-link :to="{ name: 'IdeaCreate', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}"><v-btn round color="green" dark>{{ $vuetify.t('$vuetify.Space.newIdea') }}</v-btn></router-link>
          </v-flex>
          <v-flex md8 offset-md2>
            <Filters></Filters>
          </v-flex>
          <v-flex  xs12 md8 offset-md2 pa-2 align-center justify-center text-md-center text-xs-center>
            <v-list two-line>
              <template v-for="(idea, index) in ideas">
                <v-list-tile
                  :key="idea.id"
                  ripple
                  @click="openIdea(idea)"
                        >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ idea.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-flex>
      </v-layout>
    </v-container>
</template>

<script>

import { getSpace, getIdeas } from '@/api/ideaSpace'
import Filters from '@/components/Filters'

export default {
  name: 'Ideas',
  components: { Filters },
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
      getSpace(this.$store.getters.selected_school, this.$route.params['spaceSlug'])
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
    openIdea: function (idea) {
      this.$router.push({name: 'IdeaView', params: { spaceSlug: this.$route.params['spaceSlug'], ideaId: idea.id }})
    },

    getIdeas: function (schoolId, spaceId) {
      getIdeas(schoolId, spaceId).then((res) => {
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
