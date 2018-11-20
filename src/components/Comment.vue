<template>
  <li>
    <div v-if="commentId != null">
      {{ comment.text }}

      <div>
        <em>von {{ comment.created_by.first_name }}</em>
        <em v-if="comment.changed_by != null">
          bearbeitet von {{ comment.changed_by.first_name }}
        </em>

        <v-btn
          small icon
          v-if="isOwnComment"
          @click="setEditingId"
        >
          <v-icon>edit</v-icon>
        </v-btn>

        <v-btn
          small icon
          v-if="commentId != null"
          @click="setReplyId"
        >
          <v-icon>reply</v-icon>
        </v-btn>
      </div>
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
  export default {
    name: 'Comment',
    props: ['comments', 'commentId'],
    computed: {
      comment: function () {
        // Return data for current comment
        return this.comments == null
          ? null
          : this.comments.filter(c => c.id === this.commentId).shift()
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
      }
    },
    methods: {
      setReplyId: function () {
        this.$root.$emit('set-reply', this.commentId)
      },
      setEditingId: function () {
        this.$root.$emit('set-edit', this.commentId)
      }
    }
  }
</script>
