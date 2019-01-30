<template>
  <v-layout class="impressum-editor" fill-height>
    <v-flex>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="$emit('close-impressum-editor')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $vuetify.t('$vuetify.AdminCommunity.impressumEdit') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="updateImpressum">{{ $vuetify.t('$vuetify.Form.save') }}</v-btn>
          </v-toolbar-items>
			</v-toolbar>
      <v-card-text>
       <quill-editor class="editor-example bubble"
              ref="myTextEditor"
              :content="impressum"
              :options="editorOptions"
              @change="onEditorChange($event)"
              >
          <div id="toolbar" slot="toolbar">
            <!-- Add a bold button -->
            <button class="ql-bold">Bold</button>
            <button class="ql-italic">Italic</button>
            <!-- Add font size dropdown -->
            <select class="ql-size">
              <option value="small"></option>
              <!-- Note a missing, thus falsy value, is used to reset to default -->
              <option selected></option>
              <option value="large"></option>
              <option value="huge"></option>
            </select>
            <select class="ql-font">
              <option selected="selected"></option>
              <option value="serif"></option>
              <option value="monospace"></option>
            </select>
					</div>
        </quill-editor>
        </v-card-text>
      </v-card>
     </v-flex>
  </v-layout>
</template>

<script>

import api from '@/api'

export default {
  name: 'ImpressumEditor',
  data: function () {
    return {
      impressum: '',
      editorOptions: {
        placeholder: this.$vuetify.t('$vuetify.AdminCommunity.impressumEdit'),
        modules: {
          toolbar: '#toolbar'
        }
      }
    }
  },

  beforeMount: function () {
    api.school.getPage(this.$store.getters.school_id, 'impressum').then(res => {
      this.impressum = res.data
    })
  },

  computed: {
  },

  props: {
  },

  methods: {
    updateImpressum: function () {
      api.school.updatePage(this.$store.getters.school_id, 'impressum', this.impressum).then(res => {
        this.$emit('close-impressum-editor')
      })
    },

    onEditorChange: function ({ quill, html, text }) {
      this.impressum = html
    }

  }
}
</script>

<style  lang="scss">

.impressum-editor {
  background-color: white;
}

.quill-editor {
}

.ql-editor {
  max-height: 600px;
}

.v-card__text {
	position: relative;
	bottom: 0;
	top: 0;
}
</style>
