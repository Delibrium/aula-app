<template>
  <v-layout row wrap grid-list-md>
    <v-flex sm12 mb-0 pa-0>
      <v-tabs v-model="orderBy" show-arrows class="boldfont">
        <v-icon class='tab-icon'>swap_vert</v-icon>
        <v-tab
          ripple
          v-for="sortOption in sortOptions"
          :key="sortOption"
        >{{ $vuetify.t('$vuetify.IdeaListing.sortBy' + sortOption) }}</v-tab>
        <v-text-field
          v-model="query"
          flat
          :label="$vuetify.t('$vuetify.IdeaListing.search')"
          prepend-inner-icon="search"
          solo-inverted
        ></v-text-field>
      </v-tabs>
    </v-flex>

    <v-flex v-if="ideas.length === 0" pt-3>
      <h2>{{ $vuetify.t('$vuetify.IdeaListing.noIdeas') }}</h2>
    </v-flex>

    <v-flex v-for="idea in this.sortedIdeas" :key="idea.id" sm12 md6 lg4 pa-2>
      <v-card class="idea-card" flat>
        <v-card-title @click="openIdea(idea)">
          <h3>{{ idea.title }}</h3>
          <div class="card-meta">
            {{ $vuetify.t('$vuetify.IdeaListing.ideaSubtitle',
            getAuthorName(idea),
            getCreatedDate(idea)) }}
          </div>
        </v-card-title>

        <v-card-text>
          <v-list>
            <v-list-tile class="suggestions">
              <v-icon>comment</v-icon>
              <span
                v-if="getSuggestionCount(idea) === 0"
                class="no-suggestions"
              >{{ $vuetify.t('$vuetify.IdeaListing.noComments') }}</span>
              <span v-else>
                {{ $vuetify.t(
                '$vuetify.IdeaListing.numComments',
                getSuggestionCount(idea))
                }}
              </span>
            </v-list-tile>

            <v-divider v-if="topic == null || topic.phase != 'edit_topics'"></v-divider>

            <v-list-tile v-if="topic == null" class="suppporters">
              <span v-if="getSupporterCount(idea) === 0" class="no-supporters">
                <v-icon>thumb_up</v-icon>
                {{ $vuetify.t('$vuetify.IdeaListing.noSupporters') }}
              </span>
              <span v-else :class="isSupportedByUser(idea) ? 'idea-supported' : ''">
                <v-icon>thumb_up</v-icon>
                {{ $vuetify.t(
                '$vuetify.IdeaListing.numSupporters',
                getSupporterCount(idea))
                }}
              </span>
            </v-list-tile>

            <v-list-tile v-else-if="topic.phase === 'feasibility'">
              <span v-if="isIdeaFeasible(idea) === true" class="feasible">
                <v-icon>check</v-icon>
                {{ $vuetify.t('$vuetify.IdeaListing.isFeasible') }}
              </span>
              <span v-else-if="isIdeaFeasible(idea) === false">
                <v-icon>cancel</v-icon>
                {{ $vuetify.t('$vuetify.IdeaListing.isNotFeasible') }}
              </span>
              <span v-else>
                <v-icon>access_time</v-icon>
                {{ $vuetify.t('$vuetify.IdeaListing.waitingForFeasibility') }}
              </span>
            </v-list-tile>

            <v-list-tile v-else-if="topic.phase === 'vote'">
              <v-icon>schedule</v-icon>
              {{ $vuetify.t('$vuetify.IdeaListing.waitingForVoting') }}
            </v-list-tile>

            <v-list-tile v-else-if="topic.phase === 'results'">
              <v-icon>check</v-icon>
              {{ $vuetify.t('$vuetify.IdeaListing.resultsPhase') }}
            </v-list-tile>
          </v-list>

          <v-flex text-xs-right pr-4 class="categories">
            <img src="/static/img/svg/icon_regeln.svg">
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-btn
      color="primary"
      fixed
      dark
      fab
      bottom
      right
      icon
      href
      v-if="this.topic == null || this.topic.phase === 'edit_topics'"
      :to="{
        name: 'IdeaCreate',
        params: {
          space: this.$route.params.spaceSlug,
          topicId: this.topic && this.topic.id
        }
      }"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  name: 'IdeaListing',
  computed: {
    userId: function () {
      return this.$store.getters.userId
    },
    spaceName: function () {
      return this.$route.params['spaceSlug']
    },
    sortOptions: function () {
      if (this.topic == null) {
        return ['Age', 'Supporters']
      } else if (this.topic.phase === 'edit_topics') {
        return ['RecentComments', 'Name', 'Random']
      } else if (this.topic.phase === 'feasibility') {
        return ['Feasibility', 'Name']
      } else if (this.topic.phase === 'vote') {
        return ['Random']
      } else if (this.topic.phase === 'finished') {
        return ['Result', 'Name']
      }
    },
    sortedIdeas: function () {
      // Apply search query before sorting
      const ideaSet = this.query === ''
        ? Object.assign([], this.ideas)
        : this.ideas
          .filter(idea =>
            idea.title.toLowerCase().includes(this.query) ||
            idea.description.toLowerCase().includes(this.query)
          )

      const sortFn = {
        Age: (a, b) => a.created_at < b.created_at ? -1 : 1, // eslint-disable-line
        Supporters: (a, b) => // eslint-disable-line
          this.getSupporterCount(a) > this.getSupporterCount(b) ? -1 : 1,
        Name: (a, b) => a.title === b.title ? 0 : a.title > b.title ? 1 : -1, // eslint-disable-line,
        Random: (a, b) => 0.5 - Math.random(),
        Result: (a, b) => null,
        Feasibility: (a, b) => {
          if (a.feasible == null) {
            if (b.feasible == null) return 0
            return 1
          }
          if (b.feasible == null) return -1
          return a.feasible.val < b.feasible.val ? 1 : -1
        },
        RecentComments: (a, b) => {
          if (this.getSuggestionCount(a) === 0) {
            if (this.getSuggestionCount(b) === 0) return 0
            return 1
          }
          if (this.getSuggestionCount(b) === 0) return -1
          return this.getLastSuggestionDate(a) < this.getLastSuggestionDate(b) ? 1 : -1
        }
      }

      const fn = sortFn[this.sortOptions[this.orderBy]]
      ideaSet.sort(fn)
      return ideaSet
    }
  },

  data: () => ({
    orderBy: 0,
    query: ''
  }),

  // Ideas list should have created_by(first_name, last_name), comment(count),
  // idea_vote(created_by) and feasible(val) embedded
  props: ['ideas', 'topic'],

  methods: {
    openIdea: function (idea) {
      this.$router.push({
        name: 'IdeaView',
        params: {
          spaceSlug: this.spaceName,
          ideaId: idea.id
        }
      })
    },
    getAuthorName (idea) {
      if (typeof idea.created_by === 'object') {
        return `${idea.created_by.first_name} ${idea.created_by.last_name}`
      } else {
        return `Author #${idea.created_by}`
      }
    },
    getCreatedDate (idea) {
      return new Date(idea.created_at).toLocaleDateString()
    },
    getSuggestionCount (idea) {
      return idea.comment.length
    },
    getLastSuggestionDate (idea) {
      if (idea.comment.length === 0) return null
      const lastComment = Object.assign([], idea.comment)
        .sort((a, b) => a.created_at > b.created_at ? 1 : -1)
        .shift()
      return lastComment.created_at
    },
    getSupporterCount (idea) {
      return idea.idea_vote != null
        ? idea.idea_vote.length
        : null
    },
    isSupportedByUser (idea) {
      return idea.idea_vote
        .filter(vote => vote.created_by === this.userId)
        .length > 0
    },
    isIdeaFeasible (idea) {
      return idea.feasible == null
        ? null
        : idea.feasible.val
    }
  }
}
</script>

<style scoped lang="scss">
.tab-icon {
  margin: auto 10px;
}

.idea-card {
  border-radius: 7px;
  text-align: left;

  .v-card__title {
    flex-direction: column;
    align-items: baseline;
    cursor: pointer;
    border-bottom: 3px solid #eee !important;

    h3 {
      font-size: 1.6em;
      line-height: 1.4em;
    }

    .card-meta {
      font-size: 14px;
    }
  }

  .v-card__text {
    display: flex;
    word-break: break-all;
  }

  .v-list__tile span {
    font-size: 14px;
  }

  .categories {
    padding-left: 10px;
    align-self: center;
  }

  .suggestions {
    margin-bottom: 10px;
  }

  .v-divider {
    border-color: #eee;
  }

  .v-icon {
    margin-right: 10px;
  }

  .no-supporters,
  .no-suggestions {
    color: grey;
  }

  .idea-supported,
  .idea-supported .v-icon,
  .feasible,
  .feasible .v-icon {
    color: var(--v-primary-base);
  }
}
</style>
