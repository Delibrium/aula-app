<template>
  <v-container fluid grid-list-md>
      <v-layout row wrap justify-center align-center>
        <v-flex md10>
          <v-layout row wrap justify-center align-center>
            <!-- Default Idea Space -->
            <v-flex d-flex xs12 sm4 pa-2 class="idea-space">
              <router-link :to="{ name: 'Ideas', params: { spaceSlug: 'school' } }">
              <v-card>
                  <v-img
                    :src="schoolImage"
                    :contain="imagecontain"
                    height="162"
                    ></v-img>
                <v-card-title primary-title>
                  <v-layout>
                    <v-flex>
                    <h3 class="headline mb-0 space-name">{{ $store.getters.schoolConfig.mainSpaceName }}</h3>
                    </v-flex>
                    <v-flex text-align-right>
                    <v-icon color="primary" class="arrow">
                      arrow_forward
                    </v-icon>
                    </v-flex>
                  </v-layout>

                </v-card-title>
              </v-card>
              </router-link>
            </v-flex>

            <v-flex d-flex xs12 sm4 pa-2 v-for="space in idea_space" :key="space.id" class="idea-space">
              <v-card >
                  <router-link :to="getSpaceStartingPage(space)">
                    <v-img
                      :src="space.image ? space.image : '/static/img/svg/door3.svg'"
                      :contain="space.imagecontain"
                      height="162"
                      ></v-img>
                  </router-link>
                <v-card-title primary-title>
                  <v-layout>
                    <v-icon v-if="canEditSettings" class="idea-space-settings" @click="changeSpaceConfig(space)">settings</v-icon>
                    <v-flex>
                    <router-link :to="getSpaceStartingPage(space)">
                    <h3 class="headline mb-0 space-name">{{ space.title }}</h3>
                    </router-link>
                    </v-flex>
                    <v-flex text-align-right>
                    <v-icon color="primary" class="arrow">
                      arrow_forward
                    </v-icon>
                    </v-flex>
                  </v-layout>
                </v-card-title>
              </v-card>
            </v-flex>

          <v-dialog v-model="spaceSettingsDialog" width="500">
            <v-card>
              <v-card-text>
                <v-radio-group v-model="spaceConfig.config.startPage">
                  <v-radio
                    default
                    value="ideas"
                    label="Ideas"/>
                  <v-radio
                    value="topics"
                    label="Topics"/>
                </v-radio-group>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  @click="saveSpaceConfig"
                >
                {{ $vuetify.t('$vuetify.Form.save') }}
                </v-btn>
                <v-btn
                  @click="spaceSettingsDialog = false"
                >
                {{ $vuetify.t('$vuetify.Form.cancel') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          </v-layout>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>

import * as api from '@/api/ideaSpace'
import apiSchool from '@/api/school'
/* eslint-disable no-unused-vars */
import { isUserMemberOf } from '../utils/permissions'

export default {
  name: 'IdeaSpaces',
  data: function () {
    return {
      idea_space: [],
      spaceSettingsDialog: false,
      schoolImage: './static/img/svg/Schule.svg',
      imagecontain: false,
      user: {},
      defaultSpaceConfig: {
        startPage: 'ideas'
      },
      spaceConfig: {}
    }
  },

  props: {
  },

  beforeMount: function () {
    this.spaceConfig.config = this.defaultSpaceConfig
    apiSchool.getImage(this.$store.getters.selected_school).then(res => {
      if (res.data[0]['image'] !== '') {
        this.schoolImage = res.data[0]['image']
        this.imagecontain = res.data[0]['imagecontain']
      }
      api.getIdeaSpaces(this.$store.getters.selected_school).then((res) => {
        var isStudent = this.$store.getters.user.profile.roles.filter(r => r[0] === 'student').length > 0
        if (isStudent) {
          let studentSpaces = this.$store.getters.user.profile.roles.filter(r => r[0] === 'student').map(r => r[1])
          this.idea_space = res.data.filter(s => studentSpaces.indexOf(s.id) >= 0)
        } else {
          this.idea_space = res.data
        }
      })
    })
  },

  computed: {
    canEditSettings: function () {
      return isUserMemberOf(['admin', 'school_admin'])
    }
  },

  methods: {
    getSpaceStartingPage: function (space) {
      if (space.config && space.config.startPage === 'topics') {
        return { name: 'Topics', params: { spaceSlug: space.slug, spaceId: space.id } }
      }

      return { name: 'Ideas', params: { spaceSlug: space.slug, spaceId: space.id } }
    },
    changeSpaceConfig: function (space) {
      this.spaceConfig = {
        id: space.id,
        config: { ...this.defaultSpaceConfig, ...space.config }
      }
      this.spaceSettingsDialog = true
    },
    saveSpaceConfig: function () {
      api.updateIdeaSpace(this.spaceConfig).then(res => {
        this.spaceSettingsDialog = false
        var updatedSpace = this.idea_space.find(s => s.id === this.spaceConfig.id)
        updatedSpace.config = this.spaceConfig.config
      })
    }
  }
}
</script>

<style scoped lang="scss">
.idea-space-teaser {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #ededed;
  margin: auto;
  max-width: 450px;
}

.space-name {
   text-transform: uppercase;
   text-decoration: none;
}

.arrow {
   float: right;
}

.idea-space-settings {
}

.idea-space {
  a {
    text-decoration: none;
  }
}

</style>
