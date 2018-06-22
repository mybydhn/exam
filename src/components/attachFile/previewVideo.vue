<template>
  <video :id="id" width="100%" style="max-width: 100%" playsinline webkit-playsinline  class="custom-video">
    <source type="video/mp4" :src="addr" />
  </video>
</template>
<script>
  import 'mediaelement'
  import 'mediaelement/build/mediaelementplayer.min.css'
  export default {
    props: ['addr', 'id'],
    mounted () {
      new MediaElementPlayer(this.id, {
        success: function (mediaElement, originalNode, instance) {
        }
      })
    }
  }
</script>