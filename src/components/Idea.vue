<template>
    <v-container  pa-0>
      <v-dialog
        v-model="confirmDeleteIdea"
        persistent
        max-width="280"
        >
        <v-card>
          <v-card-title class="headline">{{ $vuetify.t('$vuetify.Idea.delete') }}?</v-card-title>
          <v-card-text>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="confirmDeleteIdea = false">{{ $vuetify.t('$vuetify.Form.cancel') }}</v-btn>
            <v-btn color="red darken-1" flat @click="deleteIdea()">{{ $vuetify.t('$vuetify.Form.delete') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
                            <v-img v-if="idea.created_by.picture" :src="idea.created_by.picture"/>
                            <v-img v-else src="./static/img/svg/Aula_Logo_Kopf.svg" width="40" height="40"/>
                          </v-avatar>
                          <div class="author-info">
                          <p v-if="idea.created_by != null" v-html="$vuetify.t('$vuetify.Idea.authorCreated', idea.created_by.username)">
                          </p>
                          <p>
                          {{ created.toLocaleString() }}
                          </p>
                          </div>
                        </v-flex>
                        <v-flex class="text-md-right text-xs-right">
                           <v-icon v-if="canDelete" @click="confirmDeleteIdea = true">delete</v-icon>
                           <router-link v-if="canEdit" tag="v-icon" :to="{ name: 'IdeaEdit', params: { ideaId: this.idea.id }}">edit</router-link>
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
                            idea.created_by.username,
                            created.toLocaleString()
                            )
                            }}
                          </p> -->

                          <div  v-dompurify-html="idea.description" pa-5 class="page ql-editor"/>

                          <div>
                          <div v-if="quorum != null && votes != null && !idea.topic " class="quorum-info">
                            <div class="text" v-html="$vuetify.t('$vuetify.Idea.supporterCount', proVotes.length,
                            quorum.requiredVoteCount
                            )">
                            </div>
                            <div class="bar">
                                <div slot="activator" class="proVotes" :style="{width: `${proVotesPercent}%`}"></div>
                            </div>
                          </div>
                          <div v-if="quorum != null && votes != null && (idea.topic && (idea.topic.phase === 'vote' || idea.topic.phase === 'finished'))" class="quorum-info">
                            <div class="text" v-html="$vuetify.t('$vuetify.Idea.votesCount', proVotes.length, againstVotes.length,
                            quorum.requiredVoteCount
                            )">
                            </div>
                            <div class="bar">
                              <div class="quorumMin" :style="{left: `${quorumMinPercent}%`}">
                                <v-tooltip top>
                                  <v-icon slot="activator">arrow_downward</v-icon>
                                  <span>{{ $vuetify.t('$vuetify.Idea.quorum') }}</span>
                                </v-tooltip>
                              </div>
                              <v-tooltip top>
                                <div slot="activator" class="proVotes" :style="{width: `${proVotesPercent}%`}"></div>
                                <span>{{ $vuetify.t('$vuetify.Idea.proVotes') }}</span>
                              </v-tooltip>
                              <v-tooltip top>
                                <div slot="activator" class="againstVotes" :style="{width: `${againstVotesPercent}%`, 'border-radius': againstBorder}"></div>
                                <span>{{ $vuetify.t('$vuetify.Idea.againstVotes') }}</span>
                              </v-tooltip>
                            </div>
                          </div>
                          </div>
                      </v-flex>
                      <v-flex>
                        <v-layout align-center justify-center wrap>
                          <v-flex md4 align-center text-xs-center text-md-center v-if="idea.topic && idea.topic.phase !== 'feasibility' && idea.topic.phase !== 'edit_topics' && idea.topic.phase !== 'finished'">
                            <v-btn-toggle v-model="voteValue" @change="voteChanged">
                              <v-btn primary>
                                <v-icon left>thumb_up</v-icon>{{ $vuetify.t('$vuetify.Idea.voteInFavor') }}
                              </v-btn>
                              <v-btn primary>
                                <v-icon left>thumb_down</v-icon>{{ $vuetify.t('$vuetify.Idea.voteAgainst') }}
                              </v-btn>
                            </v-btn-toggle>
                          </v-flex>
                          <v-flex md2 align-center v-if="canMarkWinner && idea.topic && idea.topic.phase === 'finished'">
                              <v-btn :color="!idea.selected ? 'primary' : 'secondary'" @click="markWinner">
                              <v-icon>gavel</v-icon>
                              <span v-if="!idea.selected">{{ $vuetify.t('$vuetify.Idea.markWinner') }}</span>
                              <span v-if="idea.selected">{{ $vuetify.t('$vuetify.Idea.unmarkWinner') }}</span>
                              </v-btn>
                          </v-flex>

                          <v-flex md4 align-center text-xs-center text-md-center v-if="!idea.topic">
                            <v-btn-toggle v-model="voteValue" @change="voteChanged">
                            <v-btn primary class="support-idea white--text" color="primary">
                                <v-icon left>{{ (!voteValue && voteValue !== 0)?'thumb_up':'thumb_down' }}</v-icon>
                                <span v-if="!voteValue && voteValue !== 0">{{$vuetify.t('$vuetify.Idea.support')}}</span>
                                <span v-else>{{$vuetify.t('$vuetify.Idea.noSupport')}}</span>
                              </v-btn>
                            </v-btn-toggle>
                          </v-flex>

                          <!-- Is Idea Feasible? -->
                          <v-flex md4 text-xs-center text-md-center v-if="(this.idea.topic && this.idea.topic.phase === 'feasibility') && canEditFeasibility">
                              <v-btn @click="setFeasibility">
                                <span v-if="feasibility.val === true">{{ $vuetify.t('$vuetify.Idea.isPossible')  }}</span>
                                <span v-else-if="feasibility.val === false">{{ $vuetify.t('$vuetify.Idea.notPossible')  }}</span>
                                <span v-else>{{$vuetify.t('$vuetify.Idea.isPossible')}}?</span>
                              </v-btn>
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
                      <v-tooltip bottom v-if="idea.category">
                      <v-img slot="activator" :src="idea.category.image" height="60" width="60"></v-img>
                      <span>{{ idea.category.name }}</span>
                      </v-tooltip>
                      <p v-if="!idea.category">{{ $vuetify.t('$vuetify.Idea.noCategory') }}</p>
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
                  <strong>{{ comment.created_by.username }}</strong>
                  {{ comment.text }}
                </p>
              </li>
            </ul>
          </div>
        </v-flex>
      </v-layout>
      <v-dialog
        width="500"
        v-model="dialogFeasible">
        <v-card>
          <v-card-text>
            <v-select
               :label="$vuetify.t('$vuetify.Idea.isPossible') + '?'"
               v-model="feasibility.val"
               :items="feasibleOptions"/>
             <v-textarea
               :label="$vuetify.t('$vuetify.Idea.statement')"
               :hint="$vuetify.t('$vuetify.Idea.feasibilityReason')"
               v-model="feasibility.reason"
             ></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="saveFeasibility">{{ $vuetify.t('$vuetify.Form.save') }}</v-btn>
            <v-btn @click="dialogFeasible = false">{{ $vuetify.t('$vuetify.Form.cancel') }}</v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>
    </v-container>
</template>

<script>

import ideaApi from '@/api/idea'
import Comments from '@/components/Comments'
import Breadcrumbs from '@/components/Breadcrumbs'
import { isUserMemberOf } from '../utils/permissions'

export default {
  name: 'Idea',
  components: { Comments, Breadcrumbs },
  data: function () {
    return {
      idea: {},
      ideaSpace: null,
      quorum: null,
      comments: null,
      votes: null,
      voteValue: null,
      breadcrumbs: [],
      dialogFeasible: false,
      confirmDeleteIdea: false,
      feasibility: { val: null, reason: '' },
      feasibleOptions: [
        {text: this.$vuetify.t('$vuetify.Idea.isPossible'), value: true},
        {text: this.$vuetify.t('$vuetify.Idea.notPossible'), value: false}
      ]
    }
  },

  beforeMount: function () {
    this.getIdea()
  },

  computed: {
    canEditFeasibility: function () {
      return isUserMemberOf(['admin', 'school_admin', 'principal'])
    },

    canMarkWinner: function () {
      if (this.idea.idea_space) {
        return isUserMemberOf(['admin', 'school_admin', 'principal', ['moderator', this.idea.idea_space.id]])
      } else {
        return isUserMemberOf(['admin', 'school_admin', 'principal', 'moderator'])
      }
    },

    canDelete: function () {
      return isUserMemberOf(['admin', 'school_admin', 'principal'])
    },

    canEdit: function () {
      return isUserMemberOf(['admin', 'school_admin', 'principal', 'moderator']) || (this.idea.created_by && this.idea.created_by.id === this.$store.getters.user.profile.id)
    },

    phase: function () {
      return !this.idea.topic ? 'wild-idea-phase' : this.idea.topic
    },

    proVotesPercent: function () {
      return 100.0 * Math.min(this.proVotes.length / this.quorum.totalVoters, 1)
    },

    againstVotesPercent: function () {
      return 100.0 * Math.min(this.againstVotes.length / this.quorum.totalVoters, 1)
    },

    againstBorder: function () {
      if (this.proVotesPercent === 0) {
        return '10px 0 0 10px'
      } else {
        return '0'
      }
    },

    quorumMinPercent: function () {
      return 100.0 * Math.min(this.quorum.requiredVoteCount / this.quorum.totalVoters, 1)
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
    },

    againstVotes: function () {
      return this.votes && this.votes.filter(v => v.val === 'no')
    }
  },

  methods: {
    deleteIdea: function () {
      ideaApi.deleteIdea(this.$store.getters.school_id, this.idea.id).then(res => {
        console.log(res, this.$route.params['spaceSlug'])
        this.$router.push({ name: 'Ideas', params: { spaceSlug: this.$route.params['spaceSlug'] } })
      })
    },

    markWinner: function () {
      const selected = !this.idea.selected
      ideaApi.updateIdeas([this.idea.id], { 'selected': selected }).then(res => {
        this.idea.selected = selected
      })
    },
    saveFeasibility: function () {
      if (!this.feasibility.created_at) {
        this.feasibility.school_id = this.$store.getters.school_id
        this.feasibility.created_by = this.$store.getters.user.profile.id
        this.feasibility.idea = this.idea.id
      }
      ideaApi.updateOrCreateFeasibility(this.feasibility).then(res => {
        if (res.status < 400) {
          this.dialogFeasible = false
        }
      })
    },
    setFeasibility: function () {
      this.dialogFeasible = true
    },
    isPossible: function (value) {
      if (value === this.idea.feasible) {
        value = null
      }
      this.$set(this.idea, 'feasible', value)
      ideaApi.updateIdeas([this.idea.id], {feasible: value})
    },

    getIdea: function () {
      ideaApi.getIdea(this.$route.params['ideaId'], true).then(res => {
        this.idea = res.data[0]
        this.getQuorumInfo()
        this.getVotes()

        if (this.idea.topic && this.idea.topic.phase !== 'finished') {
          ideaApi.getFeasibility(this.idea.id).then((res) => {
            if (res.data.length > 0) {
              this.feasibility = res.data[0]
            }
          })
        }

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
      ideaApi.getVotes(this.idea.id, this.phase).then(resp => {
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
          this.$route.params['ideaId'],
          this.phase
        ).then(res => {
          this.getVotes()
        })
          .catch(() => {
            this.getVotes()
          })
      } else {
        var vote = {
          school_id: this.$store.getters.user.profile.school_id,
          idea: this.$route.params['ideaId'],
          created_by: this.$store.getters.userId,
          val: val
        }

        if (this.idea.topic) {
          vote = {
            school_id: this.$store.getters.user.profile.school_id,
            idea_id: this.$route.params['ideaId'],
            user_id: this.$store.getters.userId,
            vote_value: val,
            topic_id: this.idea.topic.id
          }
        }
        ideaApi.postVote(vote, this.phase)
          .then(res => {
            this.getVotes()
          })
          .catch((err) => {
            if (err.request != null && err.request.status === 409) {
              // User has already voted
              ideaApi.patchVote(vote, this.phase)
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

  .v-btn-toggle .v-btn {
    opacity: 1;
  }

  .idea-banner {
    padding-bottom: 25px;
    padding-left: 10px;
    padding-right: 10px;

    &.wild-idea-phase {
      background-color: var(--v-primary-base);
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
         color: var(--v-primary-base);
       }
       .againstNum {
         color: var(--v-secondary-base);
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
        position: relative;

        .quorumMin {
          position: absolute;
          top: -20px;

          i {
            margin-left: -50%;
          }
        }

        .proVotes {
          float: left;
           background-color: var(--v-primary-base);
           border-radius: 10px 0 0 10px;
           min-height: 20px;
           width: 50%;
           transition: width 0.5s;
        }

        .againstVotes {
          float: left;
           background-color:  var(--v-secondary-base);
           border-radius: 0 10px 10px 0;
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

  .pressed {
     background-color: var(--v-primary-lighten2) !important;
  }
</style>
