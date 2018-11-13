<template>
  <v-container fluid grid-list-md>
    <v-list v-if="categories != null" two-line>
      <v-subheader>Bestehende Kategorien</v-subheader>
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
          <v-btn icon ripple @click.stop="deleteCategory(index)">
            <v-icon color="grey">delete</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <CategoryEdit
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
      this.getCategories()
      this.selectedCategory = null
    },
    getCategories: function () {
      const schoolId = this.$store.getters.selected_school
      api.category.get(schoolId).then((res) => {
        this.categories = res.data
      })
    },
    deleteCategory: function (index) {
      api.category.remove(this.categories[index].id)
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
