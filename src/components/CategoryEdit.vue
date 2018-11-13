<template>
  <v-card class='card'>
    <form>
      <v-card-title v-if="editingId == null"><h3>Neue Kategorie hinzufügen</h3></v-card-title>
      <v-card-title v-else><h3>Kategorie "{{ name }}" bearbeiten</h3></v-card-title>
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
        <v-btn flat @click="this.submit" v-if="this.editingId == null">Erstellen</v-btn>
        <v-btn flat @click="this.submit" v-else>Sichern</v-btn>
        <v-btn flat @click="this.cancel" v-if="this.editingId == null">Zurücksetzen</v-btn>
        <v-btn flat @click="this.cancel" v-else>Abbrechen</v-btn>
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
      editingId: null,
      showSnackbar: false,
      snackbarMsg: ''
    }
  },

  props: ['handleSuccess', 'handleCancel', 'category'],

  watch: {
    category: function (next, prev) {
      if (next === false) {
        // Reset form when deselecting
        this.cancel()
      } else {
        // Fill input elems with selected category data
        this.name = next.name
        this.description = next.description
        this.editingId = next.id
      }
    }
  },

  methods: {
    cancel: function () {
      this.editingId = null
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

          // Select the appripriate api depending on whether
          // a category is being added or edited. Also fill
          // in the category id when editing.
          let fn
          if (this.editingId == null) {
            fn = api.category.create
          } else {
            category.id = this.editingId
            fn = api.category.update
          }

          fn(category)
            .then((res) => {
              if (res.status < 400) {
                this.showSnackbar = true
                this.snackbarMsg = this.editingId == null
                  ? 'Kategorie erstellt' : 'Kategorie gespeichert'
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
