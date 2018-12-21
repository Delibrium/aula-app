<template>
  <v-container fluid pa-0>
      <v-layout row wrap align-center>
        <NavTabs active=0 />

        <v-flex md10 offset-md1 xs12 text-xs-center pa-3 class='page-header'>
          <h1 class="text-md-left text-xs-left">{{ $vuetify.t('$vuetify.Space.subtitle') }}</h1>
          <p class="text-md-left text-xs-left">
            {{ $vuetify.t('$vuetify.Space.description') }}
          </p>
          <v-btn large :to="{ name: 'IdeaCreate', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}">{{ $vuetify.t('$vuetify.Space.newIdea') }}</v-btn>
        </v-flex>

        <v-flex xs12 md10 offset-md1 pa-2>
          <IdeaListing :ideas="ideas" />
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import * as api from '@/api/ideaSpace'
import IdeaListing from '@/components/IdeaListing'
import NavTabs from '@/components/NavTabs'
import { isUserMemberOf } from '../utils/permissions'

export default {
  name: 'Ideas',
  components: { IdeaListing, NavTabs },
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
  .page-header {
    background-color: #8c9eff;

    .v-btn {
      font-family: 'visionbold', Helvetica, Arial, sans-serif;
      color: var(--v-secondary-base);
    }
  }
</style>
