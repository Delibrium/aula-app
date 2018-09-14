<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid grid-list-md>
        <v-layout row wrap align-center>
          <v-flex md8 xs12 offset-md2 color="green">
            <v-card dark color="green" width="50%" style="float: left" height="100%">
              <v-card-text class="text-md-center text-xs-center">{{ $vuetify.t('$vuetify.Space.wildIdeas') }}</v-card-text>
            </v-card>
            <v-card dark color="gray" width="50%" style="float: left" height="100%">
              <v-card-text class="text-md-center text-xs-center">{{ $vuetify.t('$vuetify.Space.ideaTopics') }}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex md8 offset-md2 xs12 align-center justify-center>
            <h2 class="text-md-center text-xs-center">WILDE IDEEN</h2>
          </v-flex>
          <v-flex md8 offset-md2 xs12 align-center justify-center>
            <h1 class="text-md-center text-xs-center">Was soll sich verändern?</h1>
          </v-flex>
          <v-flex md8 offset-md2 xs12 align-center justify-center>
            <p class="text-md-center text-xs-center">
              Du kannst hier jede lose Idee, die du im Kopf hast, einwerfen und
ka  nnst für die Idee abstimmen und diese somit "auf den Tisch bringen".
            </p>
          </v-flex>
          <v-flex  xs12 md8 offset-md2 pa-2 align-center justify-center text-md-center text-xs-center>
            <router-link :to="`/space/${$route.params['spaceSlug']}/idea/create`"><v-btn round color="green" dark>{{ $vuetify.t('$vuetify.Space.newIdea') }}</v-btn></router-link>
          </v-flex>
          <v-flex md8 offset-md2>
            <Filters></Filters>
          </v-flex>
      </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>

<script>

import { getIdeas } from '@/api/ideaSpace'
import Filters from '@/components/Filters'

export default {
  name: 'Ideas',
  components: { Filters },
  data: () => ({
    tab: 0,
    ideas: []
  }),

  props: {
    spaceSlug: ''
  },

  beforeMount: function () {
    getIdeas(this.$store.getters.selected_school, this.$route.params['spaceId']).then((res) => {
      console.log(res.data)
      this.ideas = res.data
    })
  },

  methods: {
  }
}
</script>
