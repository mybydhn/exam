<template>
  <audio :id="id" class="custom-audio">
    <source :src="addr" type="audio/mpeg">
  </audio>
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
