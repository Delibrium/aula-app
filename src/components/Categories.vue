<template>
  <v-container fluid grid-list-md>
    <v-alert
      :value="true"
      type="info"
      icon="create"
      dismissible
      outline
    >
      Klicke auf bestehende Kategorien, um deren Namen und Beschreibung zu ändern.
    </v-alert>
    <v-list v-if="categories != null" two-line>
      <v-list-tile
        v-for="(category, index) in categories"
        :key="category.id"
        @click="selectedCategory = index"
      >
        <v-list-tile-content>
          <v-list-tile-title>
            {{ category.name }}
          </v-list-tile-title>
          <v-list-tile-sub-title v-if="category.description.length > 0">
            {{ category.description }}
          </v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-btn icon ripple @click.stop="toDelete = index">
            <v-icon color="grey">delete</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>

    <v-card v-if="toDelete != null">
      <v-card-title><h3>Kategorie löschen</h3></v-card-title>
      <v-card-text>
        <p>
          Kategorie "{{ categories[toDelete].name }}" wirklich löschen?
          Alle darin enthaltenen Ideen haben dann keine Kategorie mehr.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="deleteCategory" color="error">Unwiederrufbar löschen</v-btn>
        <v-btn @click="toDelete = null">Zurück</v-btn>
      </v-card-actions>
    </v-card>

    <CategoryEdit
      v-else
      :category="selectedCategory != null && categories[selectedCategory]"
      :handleCancel="this.selected = null"
      :handleSuccess="this.reset"
    />

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
  </v-container>
</template>

<script>

import api from '@/api'
import CategoryEdit from '@/components/CategoryEdit'

export default {
  name: 'Categories',
  components: {
    CategoryEdit
  },
  data: function () {
    return {
      categories: null,
      selectedCategory: null,
      toDelete: null,
      showSnackbar: false,
      snackbarMsg: ''
    }
  },

  props: {},

  beforeMount: function () {
    this.getCategories()
  },

  methods: {
    reset: function () {
      this.selectedCategory = null
      this.toDelete = null
      this.getCategories()
    },
    getCategories: function () {
      const schoolId = this.$store.getters.selected_school
      api.category.get(schoolId).then((res) => {
        this.categories = res.data
      })
    },
    deleteCategory: function () {
      api.category.remove(this.categories[this.toDelete].id)
        .then(res => {
          if (res.status < 400) {
            this.reset()
            this.showSnackbar = true
            this.snackbarMsg = 'Die Kategorie wurde gelöscht.'
          } else {
            this.reset()
            this.showSnackbar = true
            this.snackbarMsg = 'Die Kategorie konnte nicht gelöscht werden'
          }
        })
    }
  }
}
</script>
