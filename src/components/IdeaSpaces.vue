<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap align-center>
        <v-flex d-flex xs12 sm4 pa-2>
          <v-card v-for="space in idea_space" :key="space.id">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ space.title }}</h3>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm4 pa-2>
          <v-card v-for="space in idea_space" :key="space.id">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ space.title }}</h3>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm4 pa-2>
           <v-card v-for="space in idea_space" :key="space.id">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ space.title }}</h3>
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
      idea_space: []
    }),

    props: {
    },

    beforeMount: function () {
      this.$http({ url: 'http://localhost/api/idea_space', method: 'GET' })
        .then((res) => {
          this.idea_space = res.data
          let user = this.$auth.user()
          console.log(user)
        })
    },

    methods: {
    }
  }
</script>
