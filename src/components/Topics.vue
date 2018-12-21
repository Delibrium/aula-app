<template>
  <v-container fluid grid-list-md pa-0>
      <v-layout row wrap align-center>

        <v-flex md10 offset-md1 xs12 text-xs-left mt-1 pa-0 hidden-sm-and-down class='breadcrumbs'>
          <v-breadcrumbs>
            <v-breadcrumbs-item href="/">
              Aula
            </v-breadcrumbs-item>
            <v-breadcrumbs-item :href="'#/space/' + this.$route.params.spaceSlug">
              [SpaceName]
            </v-breadcrumbs-item>
            <v-breadcrumbs-item :href="'#/space/' + this.$route.params.spaceSlug + '/topics'">
              Themenraum
            </v-breadcrumbs-item>
            <v-icon slot="divider">arrow_forward</v-icon>
          </v-breadcrumbs>
        </v-flex>

        <NavTabs active=1 />

        <v-flex md10 offset-md1 xs12 text-xs-center class="page-header">
          <img src="/static/img/header_temp.png">
        </v-flex>

        <v-flex md10 offset-md1 xs12 text-xs-center pa-3 class="page-header">
          <v-btn large color="white"  :to="{ name: 'TopicCreate', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}">{{ $vuetify.t('$vuetify.Topic.newTopic') }}</v-btn>
        </v-flex>

        <v-flex xs12 md10 offset-md1 pa-2 align-center justify-center text-md-left text-xs-left class='topic-list'>
          <v-layout row wrap>
            <v-flex v-for="topic in topics" :key="topic.id" sm12 md6>
              <v-card
                class="topic-card"
                hover
                @click.native="openTopic(topic)">
                <v-img :src="topic.image"></v-img>
                <v-card-title primary-title>
                  <div>
                    <span class='topic-phase'>{{ $vuetify.t('$vuetify.TopicPhase.' + topic.phase) }}</span>
                    <h3 class="headline mb-0">{{topic.title}}</h3>
                  </div>
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
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import * as api from '@/api/ideaSpace'
import NavTabs from '@/components/NavTabs'
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

  components: { NavTabs },

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
      api.getTopics(schoolId, spaceId)
        .then(res => {
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
  }

  .page-header {
    background-color: #8c9eff;

    img {
      height: 120px;
    }

    .v-btn {
      font-family: 'visionbold', Helvetica, Arial, sans-serif;
      color: var(--v-secondary-base);
    }
  }
</style>
