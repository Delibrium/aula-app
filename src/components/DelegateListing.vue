<template>
  <v-layout row wrap grid-list-md justify-center>
    <v-flex sm12 mb-0 pa-0>
      <v-layout column>
        <v-flex sm12 mb-0 pa-2 v-if="Object.keys(delegates).length === 0">
          <v-card>
            <v-card-text>
              {{ $vuetify.t('$vuetify.Delegation.noDelegation') }}
              <router-link :to="{ name: 'Delegate', param: {
                                             spaceSlug: spaceSlug,
                                             spaceId: spaceId,
                                             topicId: topic.id,
                                            }}">
                {{ $vuetify.t('$vuetify.Delegation.delegateYourVote') }}
              </router-link>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex sm12 mb-0 pa-2 v-for="(delegate, id, index) in delegates" :key="id">
          <v-card>
            <v-card-text>
              <v-img v-if="delegate['picture']" :src="delegate['picture']" width="60" height="60"/>
              <v-img v-else src="./static/img/svg/Aula_Logo_Kopf.svg" width="60"/>
                <h3>{{ delegate.first_name }} {{ delegate.last_name }}</h3>
                (<span v-for="(user, index) in delegate['users']" :key="index">
                  {{user.first_name}} {{user.last_name}}{{(Object.keys(delegates).length - 1 > index) ? ',' : ''}}
                 </span>)
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'DelegateListing',

  props: { delegates: Object, topic: Object, spaceSlug: String, spaceId: Number },

  data: function () {
    return {
    }
  },

  mounted: function () {
  },

  computed: {
  },

  beforeMount: function () {
  },

  methods: {
  }
}
</script>

<style scoped lang="scss">
</style>
