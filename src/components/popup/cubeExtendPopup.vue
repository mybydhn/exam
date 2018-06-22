<template>
  <cube-popup type="extend-popup" ref="popup" :center="center"  :mask-closable=true>
    <div class="cube-extend-popup-content" @click="hide">
      <slot>{{content}}</slot>
    </div>
 </cube-popup>
</template>
<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'cube-extend-popup'
  export default {
    name: COMPONENT_NAME,
    props: {
      content: {
        type: String
      },
      center: {
        type: Boolean,
        deafult: true
      }
    },
    methods: {
      show () {
        this.$refs.popup.show()
      },
      hide () {
        this.$refs.popup.hide()
        this.$emit('hide')
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cube-popup-center 
    .cube-popup-content
      padding 0 30px
</style>