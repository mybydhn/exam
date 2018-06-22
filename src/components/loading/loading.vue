<template>
  <div class="loading">
    <div class="loadingwrap">
      <div class="loading_bg"></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .loading
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    z-index 2
    color $color-default
    background url('/static/img/list_bj.png')
    .loadingwrap
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      padding-bottom 10px
      z-index 3
      .loading_bg
        width 120px
        height 120px
        background  url('/static/img/loading.gif') no-repeat center
        background-size contain
</style>
