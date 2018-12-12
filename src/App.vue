<template>
  <v-app light>
    <AppBar />
    <v-content>
      <div v-if="$auth.ready()">
        <router-view></router-view>
      </div>
      <div v-if="!$auth.ready()">
        Loading ...
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import AppBar from './components/AppBar'

  export default {
    components: { AppBar },
    data () {
      return {
        cordova: Vue.cordova,
        clipped: false,
        drawer: true,
        title: 'Aula'
      }
    },
    created () {
      var self = this
      this.cordova.on('deviceready', () => {
        self.onDeviceReady()
      })
    },
    methods: {
      onDeviceReady: function () {
        // Handle the device ready event.
        this.cordova.on('pause', this.onPause, false)
        this.cordova.on('resume', this.onResume, false)
        if (this.cordova.device.platform === 'Android') {
          document.addEventListener('backbutton', this.onBackKeyDown, false)
        }
      },
      onPause () {
        // Handle the pause lifecycle event.
        console.log('pause')
      },
      onResume () {
        // Handle the resume lifecycle event.
        // SetTimeout required for iOS.
        setTimeout(function () {
          console.log('resume')
        }, 0)
      },
      onBackKeyDown () {
        // Handle the back-button event on Android. By default it will exit the app.
        navigator.app.exitApp()
      }
    }
  }
</script>

<style>
	body {
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
	}
  .theme--light.application {
    background-color: #eee;
  }
  .footer{ /* Apply this to v-bottom-nav if necessary. */
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
  }

  .header_logo {
     width: 100px;
  }
</style>
