<template>
  <v-layout row wrap>
    <v-flex sm12 mb-0 pa-0>
      <v-tabs v-model="orderBy">
        <v-tab ripple disabled>
          <v-icon>swap_vert</v-icon>
        </v-tab>
        <v-tab ripple >
          {{ $vuetify.t('$vuetify.IdeaListing.sortByAge') }}
        </v-tab>
        <v-tab ripple >
          {{ $vuetify.t('$vuetify.IdeaListing.sortBySupporters') }}
        </v-tab>
        <v-spacer></v-spacer>
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
    <v-flex
      v-for="idea in sortedIdeas"
      :key="idea.id"
      sm12 md6 lg4 ma-2>
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
              <span v-if="getCommentCount(idea) === 0" class="no-suggestions">
                {{ $vuetify.t('$vuetify.IdeaListing.noComments') }}
              </span>
              <span v-else>
                {{ $vuetify.t(
                    '$vuetify.IdeaListing.numComments',
                    getCommentCount(idea))
                }}
              </span>
            </v-list-tile>

            <v-divider v-if="topic == null || topic.phase != 'edit_topics'">
            </v-divider>

            <v-list-tile
              v-if="topic == null"
              class="suppporters">
              <span
                v-if="getSupporterCount(idea) === 0"
                class="no-supporters">
                <v-icon>thumb_up</v-icon>
                {{ $vuetify.t('$vuetify.IdeaListing.noSupporters') }}
              </span>
              <span
                v-else
                :class="isSupportedByUser(idea) ? 'idea-supported' : ''">
                <v-icon>thumb_up</v-icon>
                {{ $vuetify.t(
                    '$vuetify.IdeaListing.numSupporters',
                    getSupporterCount(idea))
                }}
              </span>
            </v-list-tile>

            <v-list-tile v-else-if="topic.phase === 'feasibility'">
              <span v-if="isIdeaFeasible(idea) === true" class='feasible'>
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

          <div class="categories">
            <img class="header_logo" src="/static/img/aula_old_logo.svg" />
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
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
    sortedIdeas: function () {
      // Apply search query before sorting
      const ideaSet = this.query === ''
        ? this.ideas
        : this.ideas.filter(idea =>
          idea.title.toLowerCase().indexOf(this.query) >= 0 ||
          idea.description.toLowerCase().indexOf(this.query) >= 0
        )

      const byAge = (a, b) => a.created_at < b.created_at ? -1 : 1
      const bySupporters = (a, b) =>
        this.getSupporterCount(a) > this.getSupporterCount(b) ? -1 : 1

      const fn = this.orderBy === 1
        ? byAge
        : bySupporters

      return ideaSet.sort(fn)
    }
  },

  data: function () {
    return {
      orderBy: 1,
      query: ''
    }
  },

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
    getCommentCount (idea) {
      return idea.comment && idea.comment.length === 1
        ? idea.comment[0].count
        : null
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
  .idea-card {
    border-radius: 7px;
    text-align: left;

    .v-card__title {
      flex-direction: column;
      align-items: baseline;
      cursor: pointer;
      border-bottom: 5px solid #eee !important;

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
      word-break: break-all
    }

    .v-list__tile span {
      font-size: 14px;
    }

    .categories {
      padding-left: 10px;
      align-self: center
    }

    .suggestions {
      margin-bottom: 10px;
    }

    .v-divider {
      border-color: #eee
    }

    .v-icon {
      margin-right: 10px;
    }

    .no-supporters, .no-suggestions {
      color: grey;
    }

    .idea-supported, .idea-supported .v-icon, .feasible, .feasible .v-icon {
      color: var(--v-primary-base);
    }
  }
</style>
