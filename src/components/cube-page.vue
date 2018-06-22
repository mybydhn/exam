<template>
  <div class="cube-page" :class="[platform]">
    <header class="header">
    <slot name="headerback"><span class="iconfont" @click="back()">&#xe907;</span></slot>
    <div class="header-main">
      <slot name="headermain">{{title}}</slot>
    </div>
  </header>
    <div class="wrapper">
      <main class="content">
        <slot name="content">{{content}}</slot>
      </main>
    </div>
  </div>
</template>
<script>
  import { getPlatform } from '@/common/js/platform'
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
      },
      content: {
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

<style lang="stylus" rel="stylesheet/stylus">
  @import "../stylus/variable.styl"
  .cube-page
    position: absolute
    z-index: 10
    top: 0
    left: 0
    width: 100%
    height: 100%
    background url('/static/img/list_bj.png')
    background-size cover
    >.wrapper
      height calc(100% - 50px)
      height calc(100vh - 50px)
      overflow: auto
      -webkit-overflow-scrolling: touch
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
  .ios .header
    padding-top 20px
    box-sizing content-box
</style>
