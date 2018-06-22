<template>
  <div>
    <answer-order islast=true></answer-order>
    <span @click="submitPaper()" class="submit-paper" v-if="type==1">交卷</span>
  </div>
</template>
<script>
  import AnswerOrder from 'components/answersheet/answerorder'
  import Bus from '@/common/js/bus'
  export default {
    props: {
      type: {
        type: Number,
        default: 1
      }
    },
    components: {
      AnswerOrder
    },
    methods: {
      submitPaper () {
        Bus.$emit('submitPaper')
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .submit-paper
    position absolute
    bottom 0
    width 100%
    height 50px
    left 0
    font-size $font-size-medium-x
    line-height 50px
    text-align center
    background-color $color-main
    color #fff
    cursor pointer
</style>