<template>
  <v-container pa-0>
    <v-layout row wrap>
      <v-flex xs12 class="phase-banner" px-3 py-2>
        <h2>{{ $vuetify.t('$vuetify.TopicPhase.' + topic.phase) }}</h2>
      </v-flex>

      <v-flex xs12 class="phase-notification" px-3 py-1 v-if="timeLeft != null">
        <v-icon>timer</v-icon>
        {{ $vuetify.t('$vuetify.Topic.phaseTimeLeft', timeLeft) }}
      </v-flex>

      <v-flex xs12 class="topic-wrapper">
        <v-container px-0 pb-3>
          <v-layout column class="topic" text-md-left >
            <v-flex md6 px-3 py-3>
              <h1>{{ topic.title }}</h1>
            </v-flex>
            <v-flex md6 px-3 py-3>
              <p>{{ topic.description }}</p>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <v-flex>
        <IdeaListing :ideas="ideas" :topic="topic" />
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
      const phaseDuration = [1, 'day']
      if (this.topic == null || this.topic.phase !== 'edit_topics') {
        return null
      } else {
        return moment(this.topic.meta.editTopicsStarted)
          .add(...phaseDuration)
          .calendar()
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

.topic > div {
  background-color: white;
  max-width: 750px;
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
  font-weight: bold;

  .v-icon {
    color: var(--v-secondary-base);
  }

  p {
    margin: 0;
  }
}
</style>
