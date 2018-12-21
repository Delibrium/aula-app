<template>
  <v-flex xs12 mb-0 pa-0 color="primary" class="tab-nav">
    <v-card flat :color="active == 0 ? 'white' : '#eee'" width="50%" style="float: left" height="100%">
      <router-link
        :to="{ name: 'Ideas', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}"
      >
        <v-card-text
          class="text-md-center text-xs-center"
        >{{ $vuetify.t('$vuetify.Space.wildIdeas') }}</v-card-text>
      </router-link>
    </v-card>
    <v-card flat :color="active == 1 ? 'white' : '#eee'" width="50%" style="float: left" height="100%">
      <router-link
        :to="{ name: 'Topics', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}"
      >
        <v-card-text
          class="text-md-center text-xs-center"
        >{{ $vuetify.t('$vuetify.Space.ideaTopics') }}</v-card-text>
      </router-link>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'NavigationTabs',
  props: [ 'spaceId', 'active' ]
}
</script>

<style scoped lang="scss">
  .tab-nav a {
    font-size: 1.2em;
    color: gray;
    text-decoration: none;
    text-transform: uppercase;
    font-family: 'visionbold', Helvetica, Arial, sans-serif;
  }

  .v-card__text {
    border-bottom: 2px solid #eee;
    padding: 8px 16px;
  }

  .router-link-active .v-card__text {
    color: #222;
    border-bottom: 2px solid #222;
  }
</style>
