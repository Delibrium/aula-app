<template>
  <v-container fluid grid-list-md pa-0>
      <v-layout row wrap align-space-around>
        <NavTabs active=1 />

        <v-flex md8 offset-md2 xs12 align-center justify-center pa-3>
          <h1 class="text-md-left text-xs-left">
            {{ $vuetify.t('$vuetify.Topic.introTitle') }}
          </h1>
          <p class="text-md-left text-xs-left" pa-3>
            {{ $vuetify.t('$vuetify.Topic.introDescription') }}
          </p>
          <router-link :to="{ name: 'TopicCreate', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}">
            <v-btn round color="primary" dark>{{ $vuetify.t('$vuetify.Topic.newTopic') }}</v-btn>
          </router-link>
        </v-flex>

        <v-flex  xs12 md10 offset-md1 pa-2 align-center justify-center text-md-left text-xs-left class='topic-list'>
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

  .topic-list {
    margin-top: 2em;
  }

  .topic-phase {
    text-transform: uppercase;
    color: #777;
    font-size: .8em;
  }
</style>
