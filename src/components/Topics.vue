<template>
  <v-container pa-0>
      <v-layout row wrap align-center>
        <v-flex xs12 text-xs-left mt-1 pa-0 hidden-sm-and-down class='breadcrumbs'>
          <v-breadcrumbs>
            <v-breadcrumbs-item href="/">
              Aula
            </v-breadcrumbs-item>
            <v-breadcrumbs-item :href="'#/space/' + this.$route.params.spaceSlug + '/topics'">
              [Space Name] Themenraum
            </v-breadcrumbs-item>
            <v-icon slot="divider">arrow_forward</v-icon>
          </v-breadcrumbs>
        </v-flex>

        <NavTabs active=1 />

        <v-layout column  class="page-header-background">
          <v-flex xs12 text-xs-center class="page-header-topics">
            <span class="info-helper">
              <v-icon dark>info</v-icon>
            </span>
            <img src="/static/img/Karteikasten.svg">
          </v-flex>

          <v-flex xs12 text-xs-center pa-3>
            <v-btn large color="white"  :to="{ name: 'TopicCreate', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}">{{ $vuetify.t('$vuetify.Topic.newTopic') }}</v-btn>
          </v-flex>
        </v-layout>

        <v-flex xs12 text-xs-center class='boldfont tab-bar'>
          <h3>{{ topics.length }} Themen</h3>
        </v-flex>

        <v-flex class='topic-list'>
          <v-container justify-center fluid grid-list-md px-0>
            <v-layout row wrap>
              <v-flex v-for="topic in topics" :key="topic.id" sm12 md4 pb-3>
                <v-card
                  class="topic-card"
                  @click.native="openTopic(topic)">
                  <v-img :src="topic.image"></v-img>
                  <PhaseBanner :topic="topic" small />
                  <v-card-title primary-title>
                      <h3 class="headline mb-0">{{topic.title}}</h3>
                  </v-card-title>
                  <v-card-text>
                    <p>{{ topic.description }}</p>
                    <div>
                      <v-icon>chat_bubble</v-icon>
                      {{ getIdeaCount(topic) }} Ideen
                    </div>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import * as api from '@/api/ideaSpace'
import NavTabs from '@/components/NavTabs'
import PhaseBanner from '@/components/PhaseBanner'
import { isUserMemberOf } from '@/utils/permissions'

export default {
  name: 'Topics',
  data: function () {
    return {
      tab: 1,
      topics: [],
      spaceId: this.$route.params['spaceId']
    }
  },

  components: { NavTabs, PhaseBanner },

  props: {
    spaceSlug: ''
  },

  beforeMount: function () {
    if (!this.spaceId) {
      api.getSpace(this.$store.getters.selected_school, this.$route.params['spaceSlug'])
        .then((res) => {
          this.spaceId = res.data[0].id
          this.getTopics(this.$store.getters.selected_school, this.spaceId)
        })
    } else {
      this.getTopics(this.$store.getters.selected_school, this.spaceId)
    }
  },

  methods: {
    userMayCreateTopics: function () {
      return isUserMemberOf(['admin', 'school_admin', 'principal'])
    },
    getTopics: function (schoolId, spaceId) {
      const phaseOrder = {
        'edit_topics': 1,
        'feasibility': 2,
        'vote': 3,
        'finished': 4
      }
      const byPhase = (a, b) => {
        if (phaseOrder[a.phase] === phaseOrder[b.phase]) return 0
        return phaseOrder[a.phase] < phaseOrder[b.phase] ? 1 : -1
      }
      api.getTopics(schoolId, spaceId)
        .then(res => {
          res.data.sort(byPhase)
          this.topics = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    getIdeaCount (topic) {
      if (topic.idea && topic.idea.count != null) {
        return topic.idea.count
      } else {
        return null
      }
    },
    openTopic: function (topic) {
      console.log(topic.id)
      this.$router.push({
        name: 'Topic',
        params: {
          spaceSlug: this.$route.params['spaceSlug'],
          topicId: topic.id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .v-card {
    cursor: pointer;
  }

  .v-card__title {
    padding-bottom: 0
  }

  .topic-phase {
    text-transform: uppercase;
    color: #777;
    font-size: .8em;
  }

  .breadcrumbs {
    font-family: 'visionbold', Helvetica, Arial, sans-serif;
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

  .page-header-background {
    background-color: #8c9eff;
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    background-image: linear-gradient(122deg, #ffffff, #304ffe);
  }

  .page-header-topics {
    .info-helper {
      width: 35px;
      padding: 5px;
      float: right;
    }

    img {
      margin-right: -35px;
      height: 180px;
    }

    .v-btn {
      font-family: 'visionbold', Helvetica, Arial, sans-serif;
      color: var(--v-secondary-base);
      border-radius: 5px;
    }
  }

  .tab-bar {
    background-color: white;
    border-bottom: 1px solid #999;
  }
</style>
