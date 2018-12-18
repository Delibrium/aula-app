<template>
  <v-container pa-0>
    <v-layout row wrap>
      <v-flex xs12 class="phase-banner" px-3 py-2>
        <h2>{{ $vuetify.t('$vuetify.TopicPhase.' + topic.phase) }}</h2>
      </v-flex>

      <v-flex xs12 class="phase-notification boldfont" px-3 py-1 v-if="timeLeft != null">
        <v-icon small>timer</v-icon>
        {{ $vuetify.t('$vuetify.Topic.phaseTimeLeft', timeLeft) }}
      </v-flex>

      <v-flex xs12 class="topic-wrapper">
        <v-container px-0 pb-3 my-4>
          <v-layout row wrap class="topic">
            <v-flex raised sm8 offset-sm2 px-4 py-4>
              <h1>{{ topic.title }}</h1>
              <p>{{ topic.description }}</p>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <v-flex>
        <IdeaListing :ideas="ideas" :topic="topic"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import api from '@/api'
import IdeaListing from '@/components/IdeaListing'
import { isUserMemberOf } from '../utils/permissions'
import moment from 'moment'

export default {
  name: 'Topic',
  components: { IdeaListing },
  computed: {
    spaceId: function () { return this.$route.params['spaceId'] },
    topicId: function () { return this.$route.params['topicId'] },
    timeLeft: function () {
      // Return an array with the amount of days in current phase and unit 'day'
      const phaseDuration = key => [
        (this.$store.getters.schoolConfig[key] || 1),
        'day'
      ]

      if (this.topic == null) return null

      if (this.topic.phase === 'edit_topics' && this.topic.config.edit_topics_started != null) {
        return moment(this.topic.config.edit_topics_started)
          .add(...phaseDuration('phaseWorking'))
          .calendar()
      } else if (this.topic.phase === 'vote' && this.topic.config.vote_started != null) {
        return moment(this.topic.config.vote_started)
          .add(...phaseDuration('phaseWorking'))
          .calendar()
      } else {
        return null
      }
    }
  },

  data: function () {
    return {
      tab: 1,
      topic: null,
      ideas: []
    }
  },

  beforeMount: function () {
    this.getTopic()
    this.getIdeas()

    // Set momeent locale to be the same as configured for vuetify
    moment.locale(this.$vuetify.lang.current)
  },

  methods: {
    userMayCreateIdeas: function () {
      return !isUserMemberOf(['school_admin', 'principal'])
    },
    openIdea: function (idea) {
      this.$router.push({ name: 'IdeaView', params: { spaceSlug: this.$route.params['spaceSlug'], ideaId: idea.id } })
    },

    getTopic: function () {
      api.topic.get(this.topicId)
        .then((res) => {
          this.topic = res.data[0]
          this.topic.meta = { editTopicsStarted: new Date() }
        })
    },
    getIdeas: function () {
      api.topic.getIdeas(this.topicId)
        .then((res) => {
          this.ideas = res.data
        })
    }
  }
}
</script>


<style scoped lang="scss">
.topic-wrapper {
  background-color: var(--v-secondary-base);
}

h1 {
  margin-bottom: 0.5em;
}

.topic > div {
  background-color: white;
}

.phase-banner {
  text-transform: uppercase;
  background-color: var(--v-secondary-base);
  color: white;
  font-size: 0.8em;
}

.phase-notification {
  text-transform: uppercase;
  color: var(--v-secondary-base);
  background-color: white;
  font-size: 0.9em;

  .v-icon {
    color: var(--v-secondary-base);
  }

  p {
    margin: 0;
  }
}
</style>
