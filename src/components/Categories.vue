<template>
  <v-container fluid grid-list-md>
    <v-list v-if="categories != null" two-line>
      <v-subheader>Bestehende Kategorien</v-subheader>
      <v-list-tile
        v-for="category in categories"
        :key="category.id"
        @click=""
      >
        <v-list-tile-content>
          <v-list-tile-title>
            {{ category.name }}
          </v-list-tile-title>
          <v-list-tile-sub-title v-if="category.description.length > 0">
            {{ category.description }}
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <CreateCategoryForm />
  </v-container>
</template>

<script>

import api from '@/api'
import CreateCategoryForm from '@/components/CreateCategoryForm'

export default {
  name: 'Categories',
  components: {
    CreateCategoryForm
  },
  data: function () {
    return {
      categories: null
    }
  },

  props: {
  },

  beforeMount: function () {
    this.getCategories()
  },

  methods: {
    getCategories: function () {
      const schoolId = this.$store.getters.selected_school
      api.category.get(schoolId).then((res) => {
        this.categories = res.data
      })
    }
  }
}
</script>
