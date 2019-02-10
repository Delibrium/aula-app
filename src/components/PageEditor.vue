<template>
  <v-layout class="page-editor" fill-height>
    <v-flex>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="$emit('close-page-editor')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $vuetify.t('$vuetify.Form.edit') }}: {{ pageName  }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="updatePage">{{ $vuetify.t('$vuetify.Form.save') }}</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
         <quill-editor class="editor-example bubble"
                ref="myTextEditor"
                :content="pageContent"
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
  name: 'PageEditor',
  data: function () {
    return {
      pageContent: '',
      editorOptions: {
        placeholder: this.$vuetify.t('$vuetify.AdminCommunity.PageEdit'),
        modules: {
          toolbar: '#toolbar'
        }
      }
    }
  },

  props: {
    pageName: String
  },

  beforeMount: function () {
    api.school.getPage(this.$store.getters.selected_school, this.pageName).then(res => {
      this.pageContent = res.data[0]['content']
    })
  },

  computed: {
  },

  methods: {
    updatePage: function () {
      console.log(this.pageName)
      api.school.updatePage(this.$store.getters.school_id, this.pageName, this.pageContent).then(res => {
        this.$emit('close-page-editor')
      })
    },

    onEditorChange: function ({ quill, html, text }) {
      this.pageContent = html
    }

  },

  watch: {
    pageName: function (pageName) {
      api.school.getPage(this.$store.getters.selected_school, this.pageName).then(res => {
        this.pageContent = res.data[0]['content']
      })
    }
  }
}
</script>

<style  lang="scss">

.page-editor {
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
