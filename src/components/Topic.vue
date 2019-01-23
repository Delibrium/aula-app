<template>
  <v-container pa-0 v-if="topic != null">
    <v-layout row wrap justify-center align-center>
      <v-flex md10>
        <v-layout row wrap>
          <v-flex text-xs-left mt-1 pa-0 hidden-sm-and-down class='breadcrumbs'>
            <v-breadcrumbs>
              <v-breadcrumbs-item href="/">
                aula
              </v-breadcrumbs-item>
              <v-breadcrumbs-item :href="'#/space/' + this.spaceSlug + '/topics'">
                {{ topic.idea_space.title }}
              </v-breadcrumbs-item>
              <v-breadcrumbs-item :href="'#/space/' + this.spaceSlug + '/topics/' + this.topicId ">
                {{ topic.title }}
              </v-breadcrumbs-item>
              <v-icon slot="divider">arrow_forward</v-icon>
            </v-breadcrumbs>
          </v-flex>

          <PhaseBanner :topic="this.topic"/>

          <v-flex xs12 class="phase-notification boldfont" px-3 py-1 v-if="phaseComplete === false">
            <v-icon small>timer</v-icon>
            {{ $vuetify.t('$vuetify.Topic.phaseTimeLeft', timeLeft) }}
          </v-flex>

          <v-flex xs12 class="phase-notification boldfont" px-3 py-1 v-if="phaseComplete === true">
            <v-icon small>check</v-icon>
            {{ $vuetify.t('$vuetify.Topic.phaseComplete') }}
          </v-flex>

          <v-flex xs12 class="topic-wrapper" :class="topicPhaseClass">
            <v-container px-0 pb-3 my-4>
              <v-layout row wrap class="topic">
                <v-flex raised sm8 offset-sm2 px-4 py-4>
                  <h1>{{ topic.title }}</h1>
                  <p>{{ topic.description }}</p>
                  <v-btn small
                    v-if="mayEditTopic"
                    :to="{
                      name: 'TopicEdit',
                      topicId: this.topicId,
                      spaceSlug: this.spaceSlug
                    }">
                    {{ $vuetify.t('$vuetify.Topic.edit') }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
          <v-flex>
            <IdeaListing :ideas="ideas" :topic="topic"/>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import api from '@/api'
import IdeaListing from '@/components/IdeaListing'
import PhaseBanner from '@/components/PhaseBanner'
import { isUserMemberOf } from '../utils/permissions'
import moment from 'moment'

export default {
  name: 'Topic',
  components: { IdeaListing, PhaseBanner },
  computed: {
    topicPhaseClass: function () {
      return {
        'edit-topics': this.topic.phase === 'edit_topics',
        'feasibility': this.topic.phase === 'feasibility',
        'vote': this.topic.phase === 'vote',
        'finished': this.topic.phase === 'finished'
      }
    },
    spaceId: function () { return this.$route.params['spaceId'] },
    topicId: function () { return this.$route.params['topicId'] },
    spaceSlug: function () { return this.$route.params['spaceSlug'] },
    mayEditTopic: function () {
      return isUserMemberOf(
        ['admin', 'school_admin', 'moderator']
      )
    },
    phaseEndsAt: function () {
      // Return end of current phase as a moment.js object

      // Returns an array with the amount of days in current phase and unit 'day'
      // as used by moment.js
      const phaseDuration = key => [
        (this.$store.getters.schoolConfig[key] || 1),
        'day'
      ]

      if (this.topic == null) return null

      if (this.topic.phase === 'edit_topics' && this.topic.config.edit_topics_started != null) {
        return moment(this.topic.config.edit_topics_started)
          .add(...phaseDuration('phaseWorking'))
      } else if (this.topic.phase === 'vote' && this.topic.config.vote_started != null) {
        return moment(this.topic.config.vote_started)
          .add(...phaseDuration('phaseVoting'))
      } else {
        return null
      }
    },
    phaseComplete: function () {
      const end = this.phaseEndsAt
      if (end == null) {
        return null
      } else {
        return end.isBefore()
      }
    },
    timeLeft: function () {
      const end = this.phaseEndsAt
      if (end == null) {
        return null
      } else {
        return end.calendar()
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
          if (!this.topic.idea_space) {
            this.topic.idea_space = {'title': this.$store.getters.schoolConfig.mainSpaceName}
          }
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

.topic-wrapper {

  &.edit-topics {
    background: url('/static/img/01_Banner_Ausarbeitungsphase.svg');
  }

  &.feasibility {
    background: url('/static/img/02_Banner_Pruffungsphase.svg');
  }

  &.vote {
    background: url('/static/img/03_Banner_Abstimmungsphase.svg');
  }

  &.finished {
    background: url('/static/img/04_Banner_Ergebnisphase_dunkel.svg');
  }


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
