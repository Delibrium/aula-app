<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex md2 v-for="(category, index) in categories" :key="category.id" align-center @click="selectCategory(category)" :class="{selected: category.id === selectedCategory}">
        <v-layout column>
          <v-flex class="category-title">
            <h3>{{ category.name }}</h3>
          </v-flex>
          <v-flex>
            <v-img :src="category.image" width="90" height="90"/>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import api from '@/api'

export default {
  name: 'CategorySelect',
  props: ['category'],
  data: function () {
    return {
      selectedCategory: this.category,
      categories: []
    }
  },

  beforeMount: function () {
    api.category.get(this.$store.getters.school_id).then((res) => {
      console.log(res.data)
      this.categories = res.data
    })
  },

  methods: {
    selectCategory: function (category) {
      this.selectedCategory = category.id
      console.log(category)
      this.$emit('selectedCategory', category.id)
    }
  }

}
</script>

<style scoped scss>

.category-title {
   text-align: center;
}

.v-image {
   margin: auto;
}

.selected {
  border: 1px solid var(--v-secondary-base);
}
</style>
