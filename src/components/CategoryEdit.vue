<template>
  <v-card class='card'>
    <form>
      <v-card-title v-if="editingId == null">
        <h3>{{ $vuetify.t('$vuetify.AdminCategories.titleAdd') }}</h3>
      </v-card-title>
      <v-card-title v-else>
        <h3>{{ $vuetify.t('$vuetify.AdminCategories.titleEdit', name) }}</h3>
      </v-card-title>
      <v-card-text>
        <v-text-field
          name='name'
          v-model='name'
          v-validate="'required'"
          :error-messages="errors.collect('name')"
          :label="this.$vuetify.t('$vuetify.AdminCategories.formName')"
          required
          >
        </v-text-field>
        <v-text-field
          name='description'
          v-model='description'
          v-validate="'required'"
          :error-messages="errors.collect('description')"
          :label="this.$vuetify.t('$vuetify.AdminCategories.formDescription')"
          required
          >
        </v-text-field>
        <!-- <v-avatar class='inlineinput' size='36'><img :src="formIconUrl" /></v-avatar> -->
        <vue-base64-file-upload
          accept="image/png,image/jpeg,image/svg"
          image-class="upload-image-preview"
          input-class="upload-image-input"
          @file="onFile"
          @load="onLoad" />

        <!-- <upload-btn
          class='inlineinput'
          :title="this.$vuetify.t('$vuetify.AdminCategories.formPickIcon')"
          flat
          color="white"
          accept="image/*"
          :fileChangedCallback="handleIconSelected">
        </upload-btn> -->
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="this.submit" v-if="this.editingId == null">
          {{ $vuetify.t('$vuetify.AdminCategories.formCreate', name) }}
        </v-btn>
        <v-btn color="primary" @click="this.submit" v-else>
          {{ $vuetify.t('$vuetify.AdminCategories.formSave', name) }}
        </v-btn>
        <v-btn flat @click="this.cancel" v-if="this.editingId == null">
          {{ $vuetify.t('$vuetify.AdminCategories.formReset', name) }}
        </v-btn>
        <v-btn flat @click="this.cancel" v-else>
          {{ $vuetify.t('$vuetify.AdminCategories.formCancel', name) }}
        </v-btn>
      </v-card-actions>
    </form>
    <v-snackbar
      v-model="showSnackbar"
      :bottom="true"
    >
      {{ snackbarMsg }}
      <v-btn
        color="accent"
        flat
        @click="showSnackbar = false"
      >
        {{ $vuetify.t('$vuetify.Snackbar.close') }}
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import api from '@/api'
import { isUserMemberOf } from '../utils/permissions'
// import UploadButton from 'vuetify-upload-button'
import VueBase64FileUpload from 'vue-base64-file-upload'

export default {
  $_veeValidate: { validator: 'new' },

  name: 'CreateCategoryForm',
  data: function () {
    return {
      name: '',
      description: '',
      editingId: null,
      showSnackbar: false,
      snackbarMsg: '',
      iconFile: '',
      iconUrl: '',
      iconChanged: false
    }
  },

  computed: {
    formIconUrl: function () {
      return (this.iconUrl == null || this.iconUrl.length === 0)
        ? '/static/img/placeholder_icon.png'
        : this.iconUrl
    }
  },

  components: {
    VueBase64FileUpload
  },

  props: ['handleSuccess', 'handleCancel', 'category'],

  watch: {
    category: function (next, prev) {
      if (next === false) {
        // Reset form when deselecting
        this.cancel()
      } else {
        // Fill input elems with selected category data
        this.name = next.name
        this.description = next.description
        this.editingId = next.id
        this.iconUrl = next.icon
      }
    }
  },

  methods: {
    onFile: function (file) {
      console.log(file) // file object
    },

    onLoad: function (dataUri) {
      this.iconFile = dataUri
    },

    cancel: function () {
      this.editingId = null
      this.name = ''
      this.description = ''
      this.iconFile = ''
      this.iconUrl = ''
      this.iconChanged = false
      this.$nextTick(() => this.$validator.reset())
    },
    handleIconSelected: function (icon) {
      if (icon !== undefined) {
        const fr = new FileReader()
        fr.readAsDataURL(icon)
        fr.addEventListener('load', () => {
          this.iconUrl = fr.result
          this.iconFile = icon
          this.iconChanged = true
        })
      } else {
        this.iconFile = ''
        this.iconUrl = ''
      }
    },
    submit: function () {
      this.$validator.validate()
        .then(isFormValid => {
          // Do nothing if validation fails -  errors are displayed in UI
          if (!isFormValid) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.formError')
            return
          }

          if (!isUserMemberOf(['admin'])) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.rightsError')
            return
          }

          const category = {
            school_id: this.$store.getters.selected_school,
            name: this.name,
            description: this.description,
            image: this.iconFile
          }

          if (this.iconChanged === true) {
            category.icon = this.iconUrl
          }

          // Select the appripriate api depending on whether
          // a category is being added or edited. Also fill
          // in the category id when editing.
          let fn
          if (this.editingId == null) {
            fn = api.category.create
          } else {
            category.id = this.editingId
            fn = api.category.update
          }

          fn(category)
            .then((res) => {
              if (res.status < 400) {
                this.showSnackbar = true
                this.snackbarMsg = this.editingId == null
                  ? this.$vuetify.t('$vuetify.AdminCategories.snackbarCreated')
                  : this.$vuetify.t('$vuetify.AdminCategories.snackbarSaved')
                this.handleSuccess(res.data)
              } else {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t(
                  '$vuetify.Snackbar.serverError')
              }
            })
        })
    }
  }
}
</script>

<style lang="scss">
  .card {
    padding: 10px;
  }
  .inlineinput {
    display: inline-block;
  }
  .upload-image-input {
     text-align: left;
  }
  .upload-image-preview {
     max-width: 90px;
  }
</style>
