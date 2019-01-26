<template>
  <li>
    <div v-if="commentId != null">
      <v-card class="comment">
        <v-card-text>
          <span v-if="comment.is_deleted">
            {{ $vuetify.t('$vuetify.Comment.isDeleted') }}
          </span>
          <span v-else>
            {{ comment.text }}
          </span>

          <div>
            <v-tooltip bottom>
              <v-btn-toggle slot="activator" v-model="voteValue" @change="voteChanged">
                <v-btn flat small>
                  <v-icon>thumb_up</v-icon>
                </v-btn>
                <v-btn flat small>
                  <v-icon>thumb_down</v-icon>
                </v-btn>
              </v-btn-toggle>
              <span>
                {{ $vuetify.t('$vuetify.Comment.tally', this.tally) }}
              </span>
            </v-tooltip>

            <em>
              {{
                $vuetify.t('$vuetify.Comment.authorCreated',
                  comment.created_by.first_name,
                  created.toLocaleString())
              }}
            </em>
            <em v-if="comment.changed_by != null">
              {{ $vuetify.t('$vuetify.Comment.editedBy',
                this.comment.changed_by.first_name) }}
            </em>

            <v-btn
              small icon
              v-if="isOwnComment"
              :disabled="comment.is_deleted"
              @click="setEditingId"
            >
              <v-icon>edit</v-icon>
            </v-btn>

            <v-btn
              small icon
              v-if="isOwnComment"
              :disabled="comment.is_deleted"
              @click="setDeleted"
            >
              <v-icon>delete</v-icon>
            </v-btn>

            <v-btn
              small icon
              v-if="commentId != null"
              @click="setReplyId"
            >
              <v-icon>reply</v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <ul v-if="directChildren.length > 0">
      <!-- Recursive insertion of child comments -->
      <Comment
        v-for="child in directChildren"
        :key="child.id"
        :comments="comments"
        :commentId="child.id"
      />
    </ul>
  </li>
</template>

<script>
  import api from '@/api'

  export default {
    name: 'Comment',
    props: ['comments', 'commentId'],
    data: function () {
      return {
        voteValue: null // record the current state of the button
      }
    },
    beforeMount: function () {
      this.voteValue = this.currentVote
    },
    computed: {
      comment: function () {
        // Return data for current comment
        return this.comments == null
          ? null
          : this.comments.filter(c => c.id === this.commentId).shift()
      },
      created: function () {
        return this.comment && this.comment.created_at &&
          new Date(this.comment.created_at)
      },
      changed: function () {
        return this.comment && this.comment.changed_at &&
          new Date(this.comment.changed_at)
      },
      directChildren: function () {
        return this.comments == null
          ? []
          : this.comments.filter(
            c => c.parent_comment == this.commentId // eslint-disable-line eqeqeq
          )
      },
      isOwnComment: function () {
        return this.comment &&
          this.comment.created_by.id === this.$store.getters.userId
      },
      currentVote: function () {
        // Retrieve the current vote value from data (instead of the button)
        const currentId = this.$store.getters.userId
        const vote = this.comment && this.comment.votes
          .filter(v => v.created_by === currentId)
          .shift()

        return vote == null
          ? null
          : vote.val === 'up'
            ? 0
            : 1
      },
      tally: function () {
        // Tally up the votes on a comment and return a numerical result
        if (this.comment == null) return 0
        const up = this.comment.votes.filter(v => v.val === 'up').length
        const down = this.comment.votes.filter(v => v.val === 'down').length
        return up - down
      }
    },
    methods: {
      setReplyId: function () {
        this.$root.$emit('set-reply', this.commentId)
      },
      setEditingId: function () {
        this.$root.$emit('set-edit', this.commentId)
      },
      setDeleted: function () {
        this.$root.$emit('set-deleted', this.commentId)
      },
      reload: function () {
        this.$root.$emit('reload')
      },
      setVote: function (val) {
        if (val == null) {
          // Vote was reset => delete vote
          api.comment.deleteVote(
            this.$store.getters.userId,
            this.commentId
          ).catch(() => {
            this.reload()
          })
        } else {
          const vote = {
            school_id: this.$store.getters.school_id,
            comment: this.commentId,
            created_by: this.$store.getters.userId,
            changed_by: this.$store.getters.userId,
            val
          }
          console.log(vote)
          api.comment.postVote(vote)
            .catch((err) => {
              if (err.request != null && err.request.status === 409) {
                // User has already voted
                api.comment.patchVote(vote)
                  .catch(() => {
                    this.reload()
                  })
              } else {
                this.reload()
              }
            })
        }
      },
      voteChanged: function (clicked) {
        // The clicked param contains the index of the clicked vote button
        // or null if the vote was reset
        const value = clicked === 0
          ? 'up'
          : clicked === 1
            ? 'down'
            : null
        this.setVote(value)
      }
    }
  }
</script>

<style scoped lang="scss">
.comment {
   margin-top: 10px;
}

ul {
   padding-left: 0;
}
</style>
