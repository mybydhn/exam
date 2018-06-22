<template>
  <div>
    <span @click="stetch()" v-if="!isvisible&&curNum>0" class="tinum-bg"><i class="iconfont ticard-icon">&#xe996;</i>{{curNum}}/{{totalNum}}<i class="iconfont ti-arrowicon">&#xe629;</i></span>
    <span @click="stetch()" v-if="isvisible" class="tinum-bg"><i class="iconfont ticard-icon">&#xe996;</i>{{curNum}}/{{totalNum}}<i class="iconfont ti-arrowicon">&#xe738;</i></span>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        isvisible: false
      }
    },
    props: {
      totalNum: {
        type: Number,
        default: 0
      },
      curNum: {
        type: Number,
        default: 0
      }
    },
    methods: {
      stetch () {
        this.isvisible = !this.isvisible
        this.$emit('showAnswerCard', this.isvisible)
      },
      changeSataus () {
        this.isvisible = false
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .tinum-bg
    display inline-block
    height 30px
    font-size $font-size-medium
    line-height 30px
    padding 0 8px
    border-radius 20px
    background url('/static/img/tinum_bj.png')
    color #fff
    .ticard-icon
      margin-right 5px
      font-size $font-size-medium
    .ti-arrowicon
      margin-left 5px
      font-size $font-size-small
</style>