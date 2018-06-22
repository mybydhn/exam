// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Cube from 'cube-ui'
import VuePreview from 'vue-preview'
import BackEvent from '@/common/js/UBackEvent'
// import FastClick from 'fastclick'
import {
  exitApp
} from '@/common/js/mobilePlugin'
import store from './store'
import '@/assets/icon/iconfont.css'

Vue.config.productionTip = false
Vue.use(Cube)
/* eslint-disable no-new */
Vue.use(VuePreview, {
  mainClass: 'pswp--minimal--dark',
  barsSize: {
    top: 0,
    bottom: 0
  },
  captionEl: false,
  fullscreenEl: false,
  shareEl: false,
  bgOpacity: 0.85,
  tapToClose: true,
  tapToToggleControls: false
})

// FastClick.attach(document.body)

function onDeviceReady () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
      App
    }
  })
  // console.log(getUser())
  document.addEventListener('backbutton', onBackKeyDown, false)

  function onBackKeyDown () {
    window.testrouter = router.currentRoute
    if (BackEvent.isBindBackEvent(router.currentRoute)) {
      BackEvent.handBackEvent(router.currentRoute)
    } else {
      window.history.length > 1 ? router.back() : exitApp()
    }
  }
}
document.addEventListener('deviceready', onDeviceReady, false)
