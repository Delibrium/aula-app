<template>
  <v-container pa-0>
    <v-layout row wrap align-center>
      <v-flex xs12 text-xs-left mt-1 pa-0 hidden-sm-and-down class="breadcrumbs">
        <v-breadcrumbs>
          <v-breadcrumbs-item href="/">Aula</v-breadcrumbs-item>
          <v-breadcrumbs-item
            :href="'#/space/' + this.$route.params.spaceSlug + '/ideas'"
          >[Space Name] Wilde ideen</v-breadcrumbs-item>
          <v-icon slot="divider">arrow_forward</v-icon>
        </v-breadcrumbs>
      </v-flex>

      <NavTabs active="0"/>

      <v-flex xs12 text-xs-center class="page-header">
        <span class="info-helper">
          <v-icon dark>info</v-icon>
        </span>

        <div><img src="/static/img/header_temp.png"></div>
      </v-flex>

      <v-flex xs12 text-xs-center pa-3 class="page-header">
        <v-btn
          large
          color="white"
          :to="{ name: 'IdeaCreate', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}"
        >{{ $vuetify.t('$vuetify.Space.newIdea') }}</v-btn>
      </v-flex>

      <v-flex xs12>
        <IdeaListing :ideas="ideas"/>
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
      this.$router.push({ name: 'IdeaView', params: { spaceSlug: this.$route.params['spaceSlug'], ideaId: idea.id } })
    },

    getIdeas: function (schoolId, spaceId) {
      api.getIdeas(schoolId, spaceId).then((res) => {
        this.ideas = res.data
      })
    }
  }
}
</script>

<style lang="scss">
.breadcrumbs {
  font-family: "visionbold", Helvetica, Arial, sans-serif;
  background-color: white;
  border-bottom: 1px solid grey;

  .v-breadcrumbs {
    padding: 14px 12px 12px;
  }

  li a.v-breadcrumbs__item {
    color: #222;
  }

  li:last-child a.v-breadcrumbs__item {
    color: var(--v-secondary-base) !important;
  }
}

.page-header {
  background-color: var(--v-primary-lighten3);

  .info-helper {
    width: 35px;
    padding: 5px;
    float: right;
  }

  img {
    height: 120px;
    margin-right: -35px;
  }

  .v-btn {
    font-family: "visionbold", Helvetica, Arial, sans-serif;
    color: var(--v-primary-base);
    border-radius: 5px;
  }
}
</style>
