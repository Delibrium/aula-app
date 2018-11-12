<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid grid-list-md>
        <v-layout row wrap align-center>
          <v-flex md8 xs12 offset-md2 color="green">
            <span>
              In
              <span v-if="this.idea.topic != null">
                {{ this.getPhaseName() }} für Thema {{ idea.topic.title }}
              </span>
              <span v-else>
                <router-link :to="{ name: 'Ideas', params: { spaceSlug:$route.params['spaceSlug']} }">
                  {{ this.getPhaseName() }}
                </router-link>
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

            <p v-if='quorum != null && votes != null'>
              {{ $vuetify.t('$vuetify.Idea.supporterCount',
                  votes.length,
                  quorum.requiredVoteCount
              ) }}
            </p>

            <p>{{ idea.description }}</p>

            <p v-if="idea.category != null">
              {{ $vuetify.t('$vuetify.Idea.category', idea.category.name) }}
            </p>
            <p v-else>{{ $vuetify.t('$vuetify.Idea.noCategory') }}</p>

            <div>
              <h3 v-if="comments != null">
                {{ $vuetify.t('$vuetify.Idea.suggestions', comments.length) }}
              </h3>

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
  </v-slide-y-transition>
</template>

<script>

import ideaApi from '@/api/idea'

export default {
  name: 'Idea',
  data: () => ({
    idea: {},
    created: null,
    quorum: null,
    comments: null,
    votes: null
  }),

  props: {

  },

  beforeMount: function () {
    ideaApi.getIdea(this.$route.params['ideaId']).then(res => {
      this.idea = res.data[0]
      this.created = new Date(res.data[0].created_at)
      this.getQuorumInfo()
      this.getVotes()
      this.getComments()
    })
  },

  methods: {
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
    getComments: function () {
      ideaApi.getComments(this.idea.id).then(resp => {
        this.comments = resp.data
      })
    },
    getVotes: function () {
      ideaApi.getVotes(this.idea.id).then(resp => {
        this.votes = resp.data
      })
    }
  }
}
</script>
