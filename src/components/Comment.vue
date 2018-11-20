<template>
  <li>
    <div v-if="commentId != null">
      {{ comment.text }}

      <v-btn
        small icon
        v-if="commentId != null"
        @click="setReplyId"
      >
        <v-icon>reply</v-icon>
      </v-btn>
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
          ? []
          : this.comments.filter(c => c.id === this.commentId).shift()
      },
      directChildren: function () {
        return this.comments == null
          ? []
          : this.comments.filter(
            c => c.parent_comment == this.commentId // eslint-disable-line eqeqeq
          )
      }
    },
    methods: {
      setReplyId: function () {
        this.$root.$emit('set-reply', this.commentId)
      }
    }
  }
</script>
