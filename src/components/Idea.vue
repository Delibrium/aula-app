<template>
    <v-container  pa-0>
      <v-layout row wrap align-center>
        <v-flex md8 xs12 offset-md2 class="idea-banner" color="primary">
          <v-card class="idea">
            <v-card-text>
              <v-layout row wrap align-center>
                <v-flex xs12 md12>
                  <span>
                    In
                    <span v-if="this.idea.topic != null">
                      {{ this.getPhaseName() }} für Thema
                      <router-link
                        :to="{
                          name: 'Topic',
                          params: {
                            spaceSlug: $route.params['spaceSlug'],
                            topicId: this.idea.topic.id
                          }
                        }"
                      >{{ idea.topic.title }}</router-link>
                    </span>
                    <span v-else>
                      <router-link
                        :to="{ name: 'Ideas', params: { spaceSlug:$route.params['spaceSlug']} }"
                      >{{ this.getPhaseName() }}</router-link>
                    </span>
                  </span>
                  <h1 v-if="idea">{{ idea.title }}</h1>

                  <p v-if="idea.created_by != null">
                    {{
                    $vuetify.t('$vuetify.Idea.authorCreated',
                    idea.created_by.first_name,
                    created.toLocaleString()
                    )
                    }}
                  </p>

                  <p v-if="quorum != null && votes != null">
                    {{ $vuetify.t('$vuetify.Idea.supporterCount',
                    proVotes.length,
                    quorum.requiredVoteCount
                    ) }}
                  </p>

                  <p>{{ idea.description }}</p>

                  <p
                    v-if="idea.category != null"
                  >{{ $vuetify.t('$vuetify.Idea.category', idea.category.name) }}</p>
                  <p v-else>{{ $vuetify.t('$vuetify.Idea.noCategory') }}</p>

                  <div>
                  </div>
              </v-flex>
              <v-flex>
                <v-layout align-content-center justify-space-around>
                  <v-flex md4 align-center>
                    <v-btn-toggle v-model="voteValue" @change="voteChanged">
                      <v-btn primary>
                        <v-icon left>thumb_up</v-icon>Dafür
                      </v-btn>
                      <v-btn primary>
                        <v-icon left>thumb_down</v-icon>Dagegen
                      </v-btn>
                    </v-btn-toggle>
                  </v-flex>
                </v-layout>
              </v-flex>

              </v-layout>
            </v-card-text>
          </v-card>
          </v-flex>
          <v-flex md8 offset-md2 xs12 offset-md2 color="primary">

          <Comments :disabled="!allowCommenting"/>

          <div>
            <h3
              v-if="comments != null"
            >{{ $vuetify.t('$vuetify.Idea.suggestions', comments.length) }}</h3>

            <ul>
              <li v-for="comment in comments">
                <p>
                  <strong>{{ comment.created_by.first_name }}</strong>
                  {{ comment.text }}
                </p>
              </li>
            </ul>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>

import ideaApi from '@/api/idea'
import Comments from '@/components/Comments'

export default {
  name: 'Idea',
  components: { Comments },
  data: () => ({
    idea: {},
    quorum: null,
    comments: null,
    votes: null,
    voteValue: null
  }),

  beforeMount: function () {
    this.getIdea()
  },

  computed: {
    created: function () {
      return this.idea && this.idea.created_at && new Date(this.idea.created_at)
    },
    allowCommenting: function () {
      const allowedPhases = ['wildIdeas', 'edit_topics']
      return this.idea && this.idea.topic == null
        ? true
        : allowedPhases.indexOf(this.idea.topic.phase) >= 0
    },
    currentVote: function () {
      const currentUserId = this.$store.getters.userId
      const vote = this.votes && this.votes
        .filter(v => v.created_by === currentUserId).shift()
      return vote == null
        ? null
        : vote.val === 'yes'
          ? 0
          : 1
    },
    proVotes: function () {
      return this.votes && this.votes.filter(v => v.val === 'yes')
    }
  },

  methods: {
    getIdea: function () {
      ideaApi.getIdea(this.$route.params['ideaId']).then(res => {
        this.idea = res.data[0]
        this.getQuorumInfo()
        this.getVotes()
      })
    },
    getPhaseName: function () {
      if (this.idea.topic == null) {
        return this.$vuetify.t('$vuetify.TopicPhase.wildIdeas')
      } else {
        return this.$vuetify.t('$vuetify.TopicPhase.' + this.idea.topic.phase)
      }
    },
    getQuorumInfo: function () {
      ideaApi.getQuorumInfo(
        this.$store.getters.selected_school,
        this.idea.idea_space
      ).then(resp => {
        this.quorum = resp.data
      })
    },
    getVotes: function () {
      ideaApi.getVotes(this.idea.id).then(resp => {
        this.votes = resp.data
        this.voteValue = this.currentVote
      })
    },
    voteChanged: function (clicked) {
      if (clicked !== this.currentVote) {
        const value = clicked === 0
          ? 'yes'
          : clicked === 1
            ? 'no'
            : null
        this.setVote(value)
      }
    },
    setVote: function (val) {
      if (val == null) {
        // Vote was reset => delete vote
        ideaApi.deleteVote(
          this.$store.getters.userId,
          this.$route.params['ideaId']
        ).then(res => {
          this.getVotes()
        })
          .catch(() => {
            this.getVotes()
          })
      } else {
        const vote = {
          school_id: this.$store.getters.schoolId,
          idea: this.$route.params['ideaId'],
          created_by: this.$store.getters.userId,
          changed_by: this.$store.getters.userId,
          val
        }
        ideaApi.postVote(vote)
          .then(res => {
            this.getVotes()
          })
          .catch((err) => {
            if (err.request != null && err.request.status === 409) {
              // User has already voted
              ideaApi.patchVote(vote)
                .then(res => {
                  this.getVotes()
                })
                .catch(() => {
                  this.getVotes()
                })
            }
            this.getVotes()
          })
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .idea-banner {
    background-color: #536dfe;
  }
  .idea {
    padding: 20px;
  }
</style>
