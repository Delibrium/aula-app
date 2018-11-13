<template>
  <v-card class='card'>
    <form>
      <v-card-title><h3>Neue Kategorie hinzufügen</h3></v-card-title>
      <v-card-text>
        <v-text-field
          name='name'
          v-model='name'
          v-validate="'required'"
          :error-messages="errors.collect('name')"
          label='Name'
          required
          >
        </v-text-field>
        <v-text-field
          name='description'
          v-model='description'
          v-validate="'required'"
          :error-messages="errors.collect('description')"
          label='Beschreibung'
          required
          >
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn flat @click="this.submit">Erstellen</v-btn>
        <v-btn flat @click="this.cancel">Zurücksetzen</v-btn>
      </v-card-actions>
    </form>
    <v-snackbar
      v-model="showSnackbar"
      :bottom="true"
    >
      {{ snackbarMsg }}
      <v-btn
        color="pink"
        flat
        @click="showSnackbar = false"
      >
        {{ $vuetify.t('$vuetify.Snackbar.close') }}
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import api from '@/api'
import { isUserMemberOf } from '../utils/permissions'

export default {
  $_veeValidate: { validator: 'new' },

  name: 'CreateCategoryForm',
  data: function () {
    return {
      name: '',
      description: '',
      showSnackbar: false,
      snackbarMsg: ''
    }
  },

  props: ['handleSuccess'],

  methods: {
    cancel: function () {
      this.name = ''
      this.description = ''
      this.$nextTick(() => this.$validator.reset())
    },
    submit: function () {
      this.$validator.validate()
        .then(isFormValid => {
          // Do nothing if validation fails -  errors are displayed in UI
          if (!isFormValid) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.formError')
            return
          }

          if (!isUserMemberOf(['admin'])) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.rightsError')
            return
          }

          const category = {
            school_id: this.$store.getters.selected_school,
            name: this.name,
            description: this.description
          }

          api.category.create(category)
            .then((res) => {
              if (res.status < 400) {
                this.showSnackbar = true
                this.snackbarMsg = 'Kategorie wurde erstellt'
                this.handleSuccess(res.data)
              } else {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t(
                  '$vuetify.Snackbar.serverError')
              }
            })
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .card {
    padding: 10px;
  }
</style>
