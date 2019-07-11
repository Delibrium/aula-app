<template>
  <v-layout row wrap grid-list-md justify-center>
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
      <v-card class="idea-card" flat>
        <v-card-title><h2>{{ $vuetify.t('$vuetify.IdeaListing.noIdeas') }}</h2></v-card-title>
      </v-card>
    </v-flex>

    <v-flex v-for="idea in this.sortedIdeas" :key="idea.id" sm12 md12 lg12 pa-0>
      <v-card class="idea-card" flat>
        <v-card-title @click="openIdea(idea)">
          <v-layout row>
            <v-flex md10>
              <v-tooltip class="winner" bottom>
                <v-img slot="activator" src="/static/img/icons/idea-winner.png" width="44" height="44" v-if="isWinner(idea)"/>
                  <span> {{ $vuetify.t('$vuetify.Topic.winnerIdea') }}</span>
              </v-tooltip>
              <v-icon class="possible" color="primary" v-if="isPossible(idea)">check</v-icon>
              <h3>{{ idea.title }}</h3>
              <div class="card-meta">
                {{ $vuetify.t('$vuetify.IdeaListing.ideaSubtitle',
                getAuthorName(idea),
                getCreatedDate(idea)) }}
              </div>
            </v-flex>
            <v-flex>
            <v-tooltip bottom>
              <v-img class="idea-category" slot="activator" v-if="idea.category" :src="idea.category.image" width="44" height="44"/>
              <span v-if="idea.category">{{ idea.category.name }}</span>
            </v-tooltip>
            </v-flex>
          </v-layout>
        </v-card-title>

        <v-card-text>
          <v-layout column>
            <v-flex xs12 class="text-xs-left suggestions">
              <v-container pl-0 pr-0 pt-2 pb-2 fill-height>
                <v-layout row>
                  <v-flex pl-2 pr-2>
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
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>

            <v-flex pl-2 pr-2 v-if="topic == null" class="suppporters">
              <VotesBar :wildIdea="true" :proVotes="getSupporterCount(idea)" :quorumTotalVoters="quorum.totalVoters" :quorumRequiredVoters="quorum.requiredVoteCount"/>
              <!-- <span v-if="getSupporterCount(idea) === 0" class="no-supporters">
                <v-icon>thumb_up</v-icon>
                {{ $vuetify.t('$vuetify.IdeaListing.noSupporters') }}
              </span>
              <span v-else :class="isSupportedByUser(idea) ? 'idea-supported' : ''">
                <v-icon>thumb_up</v-icon>
                {{ $vuetify.t(
                '$vuetify.IdeaListing.numSupporters',
                getSupporterCount(idea))
                }}
              </span> -->
            </v-flex>

            <v-flex pl-2 pr-2 pb-2 v-else-if="topic.phase === 'feasibility'">
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
            </v-flex>

            <v-flex pl-2 pr-2 pb-2 v-else-if="topic.phase === 'vote' || topic.phase === 'finished'" class="showing-votes">
              <VotesBar :proVotes="getVotesPro(idea)" :againstVotes="getVotesAgainst(idea)" :quorumTotalVoters="quorum.totalVoters" :quorumRequiredVoters="quorum.requiredVoteCount"/>
            </v-flex>

          </v-layout>

        </v-card-text>
      </v-card>
    </v-flex>

  <!--  <v-btn
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
  </v-btn> -->
  </v-layout>
</template>

<script>

import VotesBar from '@/components/VotesBar'

export default {
  name: 'IdeaListing',
  components: { VotesBar },
  // Ideas list should have created_by(username), comment(count),
  // idea_vote(created_by) and feasible(val) embedded
  props: ['ideas', 'topic', 'quorum'],

  data: function () {
    return {
      orderBy: 0,
      query: ''
    }
  },

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
            idea.title.toLowerCase().includes(this.query.toLowerCase()) ||
            idea.description.toLowerCase().includes(this.query.toLowerCase())
          )

      const sortFn = {
        Age: (a, b) => a.created_at > b.created_at ? -1 : 1, // eslint-disable-line
        Supporters: (a, b) => // eslint-disable-line
          this.getSupporterCount(a) > this.getSupporterCount(b) ? -1 : 1,
        Name: (a, b) => a.title === b.title ? 0 : a.title > b.title ? 1 : -1, // eslint-disable-line,
        Random: (a, b) => 0.5 - Math.random(),
        Result: (a, b) => {
          if (a.selected) {
            if (!b.selected) {
              return -1
            } else {
              return 0
            }
          }
          if (b.selected) return 1
        },
        Feasibility: (a, b) => {
          if (a.feasible == null) {
            if (b.feasible == null) return 0
            return 1
          }
          if (b.feasible == null) return -1
          return a.feasible.val < b.feasible.val ? -1 : 1
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

  methods: {
    isWinner: function (idea) {
      if (idea.selected) {
        return true
      } else {
        return false
      }
    },
    isPossible: function (idea) {
      if (idea.feasible && idea.feasible[0] && idea.feasible[0].val) {
        return true
      } else {
        return false
      }
    },
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
        return `${idea.created_by.username}`
      } else {
        return `Author #${idea.created_by}`
      }
    },
    getCreatedDate (idea) {
      return new Date(idea.created_at).toLocaleDateString()
    },
    getSuggestionCount (idea) {
      return idea.comment ? idea.comment.length : 0
    },
    getVotesPro (idea) {
      return idea.idea_vote != null && idea.idea_vote.filter(v => v.val === 'yes').length
    },
    getVotesAgainst (idea) {
      return idea.idea_vote != null && idea.idea_vote.filter(v => v.val === 'no').length
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

.idea-category {
  float: right;
}

.winner {
  float: left;
}

.possible {
   float: left;
   font-size: 30px;
   font-weight: bold;
}

.idea-card {
  margin: 10px;
  border-radius: 7px;
  text-align: left;

  .v-card__title {
    cursor: pointer;
    border-bottom: 3px solid #eee !important;
    padding: 12px;

    h3 {
      font-size: 1.6em;
      line-height: 1.4em;
    }

    .card-meta {
      font-size: 14px;
    }
  }

  .v-card__text {
    padding: 0;
  }

  .v-list__tile span {
    font-size: 14px;
  }

  .categories {
    padding-left: 10px;
    align-self: center;

    .v-image {
       float: right;
    }
  }

  .suggestions {
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

  .showing-votes i:nth-child(2) {
    margin-left: 10px;
  }
}
</style>
