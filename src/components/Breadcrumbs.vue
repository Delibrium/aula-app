<template>
   <v-flex xs12 text-xs-left mt-1 pa-0 hidden-sm-and-down class="breadcrumbs">
     <v-breadcrumbs>
       <v-breadcrumbs-item :exact="true" :to="item.to" :key="index" v-for="(item,index) in items">{{ item.title }}</v-breadcrumbs-item>
       <v-icon color="primary" slot="divider">arrow_forward</v-icon>
     </v-breadcrumbs>
   </v-flex>
</template>

<script>

export default {
  name: 'Breadcrumbs',
  props: {
    items: Array
  },
  data: function () {
    return {
    }
  }
}
</script>

<style lang="scss">

.breadcrumbs {
  font-family: "visionbold", Helvetica, Arial, sans-serif;
  background-color: white;
  border-bottom: 1px solid #bdbdbd;

  .v-breadcrumbs {
    padding: 14px 12px 12px;
  }

  li a.v-breadcrumbs__item {
    color: #222;
  }

  li:last-child a.v-breadcrumbs__item {
    color: var(--v-secondary-base) !important;
  }
}

</style>
