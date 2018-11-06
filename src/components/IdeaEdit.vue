<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid grid-list-md>
      <v-layout row wrap align-center>
        <v-flex md8 offset-md2 xs12>
          <h1>Deine Idee</h1>
        </v-flex>
        <v-flex md8 offset-md2 xs12>
          <v-text-field
            label="Wie soll deine Idee heißen?"
            hint="z.B. bessere Ausstattung im Computerraum"
            required
            v-model="title"
            ></v-text-field>
        </v-flex>
        <v-flex md8 offset-md2 xs12>
        <v-textarea
          label="Was möchtest du vorschlagen?"
          hint="Hier kanst du deine Idee so ausführlich wie möglich beschreiben..."
          v-model="description"
          ></v-textarea>
        </v-flex>
        <v-flex  xs12 md8 offset-md2 pa-2 align-center justify-center text-md-center text-xs-center>
            <v-btn @click="submitIdea" round color="green" dark>{{ $vuetify.t('$vuetify.IdeaCreation.publish') }}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>

<script>

import * as api from '@/api/ideaSpace'
import Filters from '@/components/Filters'

export default {
  name: 'IdeaEdit',
  components: { Filters },
  data: () => ({
    title: '',
    description: '',
    tab: 0
  }),

  props: {
    spaceSlug: ''
  },

  beforeMount: function () {
  },

  methods: {
    submitIdea: function () {
      const newIdea = {
        title: this.title,
        description: this.description,
        school_id: this.$store.getters.selected_school,
        created_by: this.$store.getters.userId,
        changed_by: this.$store.getters.userId,
        idea_space: this.$route.params['spaceId']
      }

      api.createIdea(newIdea)
        .then((res) => {
          if (res.status < 400 && res.data.length > 0) {
            const spaceSlug = this.$route.params['spaceSlug']
            const ideaId = res.data[0].id
            this.$router.push(
              { name: 'IdeaView', params: { spaceSlug, ideaId } }
            )
          } else {
            console.log(res)
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
