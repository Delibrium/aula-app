<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap align-center>
        <!-- Default Idea Space -->
        <v-flex d-flex xs12 sm4 pa-2>
          <v-card>
            <div class="idea-space-teaser">
              <img
                src="/static/img/school_teaser.svg"
                ></img>
            </div>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">School</h3>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm4 pa-2>
          <v-card v-for="space in idea_space" :key="space.id">
            <div class="idea-space-teaser">
              <img
                src="/static/img/class_teaser.png"
                ></img>
            </div>
            <v-card-title primary-title>
              <div>
                <router-link :to="`/space/${space.title}/ideas`"><h3 class="headline mb-0">{{ space.title }}</h3></router-link>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
  export default {
    name: 'IdeaSpaces',
    data: () => ({
      idea_space: [],
      user: {}
    }),

    props: {
    },

    beforeMount: function () {
      this.$http({ url: 'http://localhost/api/idea_space', method: 'GET' })
        .then((res) => {
          this.idea_space = res.data
          this.user = this.$auth.user()
        })
    },

    methods: {
    }
  }
</script>

<style scoped lang="scss">
.idea-space-teaser {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #ededed;
  margin: auto;
  height: 150px;
}

</style>
