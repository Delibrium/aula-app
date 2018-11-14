<template>
  <li>
    <div v-if="commentId != null">
      {{ comment.text }}

      <v-btn
        v-if="commentId != null"
        @click="$emit('setReplyEvent', commentId)"
      >
        Antworten
      </v-btn>
    </div>

    <ul v-if="directChildren.length > 0">
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
    props: ['comments', 'commentId', 'setReplyId'],
    computed: {
      comment: function () {
        return this.comments == null
          ? []
          : this.comments.filter(c => c.id === this.commentId).shift()
      },
      directChildren: function () {
        return this.comments == null
          ? []
          : this.comments.filter(c => c.parent_comment == this.commentId) // eslint-disable-line eqeqeq
      }
    }
  }
</script>
