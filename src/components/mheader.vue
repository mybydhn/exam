<template>
  <header class="header"  :class="[platform]">
    <slot name="headerback"><span class="iconfont" @click="back()">&#xe907;</span></slot>
    <div class="header-main">
      <slot name="headermain">{{title}}</slot>
    </div>
  </header>
</template>
<script>
  import { getPlatform } from '@/common/js/platform'
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    created () {
      this.platform = getPlatform().platform
    },
    methods: {
      back () {
        if (this.$router.currentRoute.matched[0].path === '/index') {
          // 回客户端
          window.ULplugin.UApp.finish()
        } else {
          this.$router.back()
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../stylus/variable.styl"
  .header
    display flex
    padding-right 10px
    height 50px
    line-height 50px
    background-color #fff
    font-size 0
    border-bottom-1px($color-border-default)
    .iconfont
      display inline-block
      width 50px
      padding-left 8px
      text-align left
      color $color-intro
      cursor pointer
    .header-main
       flex 1
       text-align center
       font-size $font-size-medium-x
       color $color-default
  .ios.header
    padding-top 20px
    box-sizing content-box
</style>