<template>
 <div class="timer" :class="{specialTime:isSpecialTime}"><i class="iconfont">&#xe85d;</i>{{surplusTime}}</div> 
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        isSpecialTime: false
      }
    },
    watch: {
      surplusTime: {
        handler: function (val) {
          if (val <= '05:00') {
            this.isSpecialTime = true
          }
        }
      }
    },
    props: {
      surplusTime: {
        type: String,
        default: ''
      }
    },
    methods: {
      getSurplusTime () {
        return this.surplusTime
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .timer
    height 30px
    padding 0 8px
    margin-top 10px
    font-size $font-size-medium
    line-height 30px
    color $color-intro
    border 1px solid $color-border-default
    border-radius 20px
    i
     margin-right 5px
     font-size $font-size-medium-x
  .specialTime
    color #ea5947
</style>