<template>
  <v-container fluid grid-list-md>
    <v-alert
      :value="true"
      type="info"
      icon="create"
      dismissible
      outline
    >
      {{ $vuetify.t('$vuetify.AdminCategories.usageNote') }}
    </v-alert>
    <v-list v-if="categories != null" two-line>
      <v-list-tile
        v-for="(category, index) in categories"
        :key="category.id"
        @click="selectedCategory = index"
      >

        <v-list-tile-avatar>
          <img :src="category.icon">
        </v-list-tile-avatar>

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
      <v-card-title>
        <h3>{{ $vuetify.t('$vuetify.AdminCategories.deleteHeader') }}</h3>
      </v-card-title>
      <v-card-text>
        <p>
          {{ $vuetify.t('$vuetify.AdminCategories.deleteText',
            categories[toDelete].name) }}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="deleteCategory" color="error">
          {{ $vuetify.t('$vuetify.AdminCategories.deleteConfirm') }}
        </v-btn>
        <v-btn @click="toDelete = null">
          {{ $vuetify.t('$vuetify.AdminCategories.deleteCancel') }}
        </v-btn>
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

// PostgREST retuns binary columns in hex encoded format
// this function can be used to return them back to an ascii representation
function hex2a (hexx) {
  var hex = hexx.toString() // force conversion
  var str = ''
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  }
  return str
}

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
        const categories = res.data
        // Decode icon file from hex
        for (let i = 0; i < res.data.length; i++) {
          if (categories[i].icon != null) {
            categories[i].icon = hex2a(categories[i].icon)
          }
        }
        this.categories = categories
      })
    },
    deleteCategory: function () {
      api.category.remove(this.categories[this.toDelete].id)
        .then(res => {
          if (res.status < 400) {
            this.reset()
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t(
              '$vuetify.AdminCategories.snackbarDeleted')
          } else {
            this.reset()
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t(
              '$vuetify.AdminCategories.snackbarDeleteFailed')
          }
        })
    }
  }
}
</script>
