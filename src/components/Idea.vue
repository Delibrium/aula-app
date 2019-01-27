<template>
    <v-container  pa-0>
      <v-layout row wrap justify-center align-center>
        <v-flex md10 xs12>
           <Breadcrumbs :items="breadcrumbs"/>
        </v-flex>
        <v-flex md10 xs12 class="idea-banner" color="primary" :class="ideaPhaseClass">
          <v-layout column md10 xs12>
            <v-flex md10 xs10 pa-2>
              <h1 class="phase-title">{{ this.getPhaseName() }}</h1>
            </v-flex>
            <v-flex md6>
              <v-layout row>
                <v-flex md8>
                  <v-card class="idea">
                    <v-card-title>
                      <v-layout row>
                        <v-flex v-if="idea.created_by">
                          <v-avatar size="36px">
                            <v-img :src="idea.created_by.picture"/>
                          </v-avatar>
                          <div class="author-info">
                          <p v-if="idea.created_by != null" v-html="$vuetify.t('$vuetify.Idea.authorCreated', idea.created_by.first_name)">
                          </p>
                          <p>
                          {{ created.toLocaleString() }}
                          </p>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-card-title>
                    <v-card-text>
                      <v-layout row wrap align-center>
                        <v-flex xs12 md12>
                          <h1 v-if="idea">{{ idea.title }}</h1>

                          <!-- <p v-if="idea.created_by != null">
                            {{
                            $vuetify.t('$vuetify.Idea.authorCreated',
                            idea.created_by.first_name,
                            created.toLocaleString()
                            )
                            }}
                          </p> -->


                          <p>{{ idea.description }}</p>

                          <div>
                          <div v-if="quorum != null && votes != null && !idea.topic || (idea.topic && idea.topic.phase !== 'feasibility' && idea.topic.phase !== 'edit_topics')" class="quorum-info">
                            <div class="text" v-html="$vuetify.t('$vuetify.Idea.supporterCount', proVotes.length,
                            quorum.requiredVoteCount
                            )">
                            </div>
                            <div class="bar">
                              <div class="votes" :style="{width: `${proVotesPercent}%`}"></div>
                            </div>
                          </div>


                          </div>
                      </v-flex>
                      <v-flex>
                        <v-layout align-center justify-center>
                          <v-flex md4 align-center text-xs-center text-md-center v-if="idea.topic && idea.topic.phase !== 'feasibility' && idea.topic.phase !== 'edit_topics' && idea.topic.phase !== 'finished'">
                            <v-btn-toggle v-model="voteValue" @change="voteChanged">
                              <v-btn primary>
                                <v-icon left>thumb_up</v-icon>Dafür
                              </v-btn>
                              <v-btn primary>
                                <v-icon left>thumb_down</v-icon>Dagegen
                              </v-btn>
                            </v-btn-toggle>
                          </v-flex>
                          <v-flex md4 align-center text-xs-center text-md-center v-else-if="!idea.topic || idea.topic.phase !== 'feasibility' && idea.topic.phase !== 'edit_topics'">
                            <v-btn-toggle v-model="voteValue" @change="voteChanged">
                              <v-btn primary class="support-idea white--text" color="#00c853">
                                <v-icon left>thumb_up</v-icon>Unterstützten
                              </v-btn>
                            </v-btn-toggle>
                          </v-flex>
                        </v-layout>
                      </v-flex>

                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex pl-4 hidden-xs-only>
                  <v-card>
                    <v-card-text class="thema-card-info">
                      <h3>{{ $vuetify.t('$vuetify.Topic.topic') }}</h3>
                      <p>
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
                      </p>

                      <h3>{{ $vuetify.t('$vuetify.Category.category') }} </h3>
                      <v-img v-if="idea.category" :src="idea.category.image" height="60" width="60"></v-img>
                      <p v-else>{{ $vuetify.t('$vuetify.Idea.noCategory') }}</p>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          </v-flex>
          <v-flex  md10 xs12 color="primary">

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
import Breadcrumbs from '@/components/Breadcrumbs'

export default {
  name: 'Idea',
  components: { Comments, Breadcrumbs },
  data: () => ({
    idea: {},
    ideaSpace: null,
    quorum: null,
    comments: null,
    votes: null,
    voteValue: null,
    breadcrumbs: []
  }),

  beforeMount: function () {
    this.getIdea()
  },

  computed: {
    proVotesPercent: function () {
      return 100.0 * this.proVotes.length / this.quorum.requiredVoteCount
    },

    ideaPhaseClass: function () {
      return {
        'md': this.$vuetify.breakpoint.mdAndUp,
        'wild-idea-phase': !this.idea.topic,
        'edit-topic': this.idea.topic && this.idea.topic.phase === 'edit_topics',
        'feasibility': this.idea.topic && this.idea.topic.phase === 'feasibility',
        'vote': this.idea.topic && this.idea.topic.phase === 'vote',
        'finished': this.idea.topic && this.idea.topic.phase === 'finished'
      }
    },

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
      ideaApi.getIdea(this.$route.params['ideaId'], true).then(res => {
        this.idea = res.data[0]
        this.getQuorumInfo()
        this.getVotes()

        var ideaPlaceRoute = {}
        if (this.idea.topic) {
          ideaPlaceRoute = {
            title: `${this.getPhaseName()} für Thema ${this.idea.topic.title}`,
            to: {
              name: 'Topic',
              params: {
                spaceSlug: this.$route.params['spaceSlug'],
                topicId: this.idea.topic.id
              }
            }
          }
        } else {
          var ideaSpaceTitle = ''
          if (this.idea.idea_space !== null) {
            ideaSpaceTitle = `[${this.idea.idea_space.title}]`
          } else {
            ideaSpaceTitle = `[${this.$store.getters.schoolConfig.mainSpaceName}]`
          }

          ideaPlaceRoute = {
            title: `${ideaSpaceTitle} ${this.$vuetify.t('$vuetify.Idea.wildIdeas')}`,
            to: {
              name: 'Ideas',
              params: {
                spaceSlug: this.$route.params['spaceSlug']
              }
            }
          }
        }

        this.breadcrumbs = [
          { title: 'aula',
            to: '/'
          },
          ideaPlaceRoute,
          {
            title: this.$vuetify.t('$vuetify.Idea.idea'),
            to: this.$route.path
          }
        ]
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
      var ideaSpaceId
      if (this.idea.idea_space !== null) {
        ideaSpaceId = this.idea.idea_space.id
      }
      ideaApi.getQuorumInfo(
        this.$store.getters.selected_school,
        ideaSpaceId
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
          school_id: this.$store.getters.user.profile.school_id,
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

<style lang="scss">
  .idea-banner {
    padding-bottom: 25px;
    padding-left: 10px;
    padding-right: 10px;

    &.wild-idea-phase {
      background-color: #00c853;
    }

    &.edit-topic {
      background-color: #8c9eff;
    }

    &.feasibility {
      background-color: #536dfe;
    }

    &.vote {
      background-color: #304ffe;
    }

    &.finished {
      background-color: #1a237e;
    }

    &.md {
      padding-left: 80px;
      padding-right: 80px;
    }
  }
  .phase-title {
     color: white;
     text-transform: uppercase;
     font-size: 16px;
  }
  .idea {
    .v-card__title {
      border-bottom: 1px solid #eee;
    }
  }
  .support-idea {
    color: white;
  }
  .v-avatar {
     float: left;
  }
  .author-info {
    float: left;
    padding-left: 20px;

    p {
      margin-bottom: 0;
    }
  }

  .quorum-info {
     background-color: #eee;
     padding: 15px 20px;
     border-radius: 4px;
     margin-bottom: 20px;

     .text {
       .supportNum {
         color: #00c853;
       }
       .neededNum {
         color: #777;
       }
       margin-bottom: 15px;
     }

     .bar {
        min-height: 20px;
        background-color: #bdbdbd;
        border-radius: 10px;

        .votes {
           background-color: #00c853;
           border-radius: 10px;
           min-height: 20px;
           width: 50%;
           transition: width 0.5s;
        }
     }
  }

  .thema-card-info {
    h3 {
      text-transform: uppercase;
      color: #212121;
    }

  }
</style>
