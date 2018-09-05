import Vue from '@/main'

function t (text) {
  return Vue.$vuetify.t('$vuetify.' + text)
}

export { t }
