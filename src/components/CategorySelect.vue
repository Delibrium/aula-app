<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex class="category-button" md1 v-for="category in cats" :key="category.id" @click="selectCategory(category)" :class="{selected: category.id === selectedCategory}">
        <v-layout column>
          <v-flex class="category-title">
            <h3>{{ category.name }}</h3>
          </v-flex>
          <v-flex>
            <v-img :src="category.image" width="50" height="50"/>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'CategorySelect',
  props: ['selectedCategory', 'cats'],
  data: function () {
    return {
    }
  },

  beforeMount: function () {
  },

  methods: {
    selectCategory: function (category) {
      this.$emit('select-category', category)
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

.category-button {
   border: 2px solid rgba(0,0,0,0);
}

.selected {
  border: 2px solid var(--v-secondary-base);
  border-radius: 4px;
}
</style>
