<template>
  <v-container pa-0>
      <v-layout row wrap align-center>
        <v-flex xs12 offset-md1 md10>
          <v-layout row wrap align-center>
            <v-flex xs12 text-xs-left mt-1 pa-0 hidden-sm-and-down class='breadcrumbs'>
              <v-breadcrumbs>
                <v-breadcrumbs-item href="#/">
                  aula
                </v-breadcrumbs-item>
                <v-breadcrumbs-item :href="'#/space/' + this.$route.params.spaceSlug + '/topics'">
                  [{{ spaceName }}] Themenraum
                </v-breadcrumbs-item>
                <v-icon slot="divider" color="primary">arrow_forward</v-icon>
              </v-breadcrumbs>
            </v-flex>

            <NavTabs active=1 />

            <v-layout column  class="page-header-background">
              <v-flex xs12 text-xs-center class="page-header-topics">
                <div class="info-helper">
                  <v-icon @click="info = true" dark>info</v-icon>
                </div>
                <div>
                  <v-img class="topics-icon" src="/static/img/Karteikasten.svg" width="300" height="300"/>
                </div>
              </v-flex>

              <v-flex xs12 text-xs-center pa-3 v-if="userMayCreateTopics">
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
                          {{ topic.count }} Ideen
                        </div>
                      </v-card-text>
                    </v-card>
                    </v-flex>
               </v-layout>
              </v-container>
            </v-flex>
          </v-layout>
        </v-flex>
    </v-layout>
    <v-dialog v-model="info" width="500">
        <v-card>
          <v-card-text>
            {{ $vuetify.t('$vuetify.Topic.info') }}
          </v-card-text>
        </v-card>
    </v-dialog>

  </v-container>
</template>

<script>

import * as api from '@/api/ideaSpace'
import * as apiTopic from '@/api/topic'
import NavTabs from '@/components/NavTabs'
import PhaseBanner from '@/components/PhaseBanner'
import { isUserMemberOf } from '@/utils/permissions'

export default {
  name: 'Topics',
  data: function () {
    return {
      tab: 1,
      topics: [],
      topicsCount: {},
      spaceId: this.$route.params['spaceId'],
      spaceName: '',
      info: false
    }
  },

  components: { NavTabs, PhaseBanner },

  props: {
    spaceSlug: ''
  },

  beforeMount: function () {
    if (!this.spaceId) {
      if (this.$route.params['spaceSlug'] !== 'school') {
        api.getSpace(this.$store.getters.selected_school, this.$route.params['spaceSlug'])
          .then((res) => {
            this.spaceId = res.data[0].id
            this.spaceName = res.data[0].title
            this.getTopics(this.$store.getters.selected_school, this.spaceId)
          })
      } else {
        this.spaceName = this.$store.getters.schoolConfig.mainSpaceName
        this.getTopics(this.$store.getters.selected_school)
      }
    } else {
      this.getTopics(this.$store.getters.selected_school, this.spaceId)
    }
  },

  computed: {
    userMayCreateTopics: function () {
      return isUserMemberOf(['admin', 'school_admin', 'principal'])
    }
  },

  methods: {
    getTopics: function (schoolId, spaceId = null) {
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
      return api.getTopics(schoolId, spaceId)
        .then(res => {
          res.data.sort(byPhase)
          this.topics = res.data
          var ps = []
          this.topics.forEach(topic => {
            this.topicsCount[topic.id] = 0
            ps.push(apiTopic.getIdeasCount(topic.id).then((res) => {
              this.topicsCount[topic.id] = res.data[0]['count']
            }))
          })
          return Promise.all(ps).then(res => {
            for (var topic of this.topics) {
              this.$set(topic, 'count', this.topicsCount[topic.id])
            }
          })
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

  .topics-icon {
     margin: auto;
  }
</style>
