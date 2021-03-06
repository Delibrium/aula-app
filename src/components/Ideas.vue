<template>
  <v-container pa-0>
    <v-layout row wrap align-center>
      <v-flex xs12 md10 offset-md1>
        <v-layout row wrap align-center>
          <v-flex xs12 text-xs-left mt-1 pa-0 hidden-sm-and-down class="breadcrumbs">
            <v-breadcrumbs>
              <v-breadcrumbs-item href="#/">aula</v-breadcrumbs-item>
              <v-breadcrumbs-item
                :href="'#/space/' + this.$route.params.spaceSlug + '/ideas'"
                                  >[{{ spaceName}}] Wilde ideen</v-breadcrumbs-item>
              <v-icon color="primary" slot="divider">arrow_forward</v-icon>
            </v-breadcrumbs>
          </v-flex>

          <NavTabs active="0"/>

          <v-layout column class="page-header-background-ideas">
            <v-flex xs12 text-xs-center text-center class="page-header">
              <span class="info-helper" @click="info = true">
                <v-icon dark>info</v-icon>
              </span>

              <div>
                <v-img class="wild-ideas-icon" src="./static/img/lamp.svg" width="300" height="300"></v-img>
              </div>
            </v-flex>

            <v-flex xs12 text-xs-center pa-3 class="page-header" v-if="userMayCreateIdeas">
              <v-btn
                large
                color="white"
                :to="{ name: 'IdeaCreate', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}"
              >{{ $vuetify.t('$vuetify.Space.newIdea') }}</v-btn>
            </v-flex>
          </v-layout>

          <v-flex xs12>
            <IdeaListing :ideas="ideas" :quorum="quorum"/>
          </v-flex>

          <v-dialog v-model="info" width="500">
            <v-card>
              <v-card-text>
                {{ $vuetify.t('$vuetify.Space.info') }}
              </v-card-text>
            </v-card>
          </v-dialog>

        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import ideaApi from '@/api/idea'
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
      spaceId: this.$route.params['spaceId'],
      spaceName: '',
      info: false,
      quorum: {}
    }
  },

  props: {
    spaceSlug: ''
  },

  beforeMount: function () {
    var spaceSlug = this.$route.params['spaceSlug']
    if (spaceSlug !== 'school') {
      api.getSpace(this.$store.getters.selected_school, this.$route.params['spaceSlug'])
        .then((res) => {
          this.spaceId = res.data[0].id
          this.spaceName = res.data[0].title
          this.getIdeas(this.$store.getters.selected_school, this.spaceId)
          ideaApi.getQuorumInfo(
            this.$store.getters.selected_school,
            this.spaceId
          ).then(resp => {
            this.$set(this, 'quorum', resp.data)
          })
        })
    } else {
      this.spaceName = this.$store.getters.schoolConfig.mainSpaceName
      this.getIdeas(this.$store.getters.selected_school)
      ideaApi.getQuorumInfo(
        this.$store.getters.selected_school,
        this.spaceId
      ).then(resp => {
        this.$set(this, 'quorum', resp.data)
      })
    }
  },

  computed: {
    userMayCreateIdeas: function () {
      return (isUserMemberOf(['school_admin', 'principal', 'admin']) || isUserMemberOf([(this.spaceId) ? ['moderator', this.spaceId] : 'moderator']) || isUserMemberOf([(this.spaceId) ? ['student', this.spaceId] : 'student']))
    }
  },

  methods: {
    openIdea: function (idea) {
      this.$router.push({ name: 'IdeaView', params: { spaceSlug: this.$route.params['spaceSlug'], ideaId: idea.id } })
    },

    getIdeas: function (schoolId, spaceId = null) {
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

.page-header-background-ideas {
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  background-image: linear-gradient(281deg, #00c853, #ffffff);
}

.page-header {
  position: relative;
  .info-helper {
    width: 35px;
    padding: 5px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 5;
  }

  img {
    height: 180px;
    margin-right: -35px;
  }

  .v-btn {
    font-family: "visionbold", Helvetica, Arial, sans-serif;
    color: var(--v-primary-base);
    border-radius: 5px;
  }
}

.wild-ideas-icon {
   margin: auto;
}
</style>
