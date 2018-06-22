<template>
  <div class="answer-orderwrap">
    <dl v-for="part in paperPartQuesInfo.part">
      <dt>{{part.partname}}</dt>
      <dd class="circle-zone">
        <div class="circle-item" v-for="partchildren in part.children"><span class="circle" :class="classObject(partchildren.qorder,partchildren.isanswer,partchildren.isorderAnswer)" @click="getQaNum(partchildren.qorder,partchildren.qswiperIndex,islast)">{{partchildren.qorder}}</span></div>
      </dd>
    </dl>
  </div>
</template>
<script>
  import Bus from '@/common/js/bus'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        orderPaperInfo: []
      }
    },
    props: {
      islast: true
    },
    computed: {
      ...mapGetters([
        'paperPartQuesInfo'
      ])
    },
    mounted () {
      this.timestamp = new Date()
      this.orderPaperInfo = this.paperPartQuesInfo.part
    },
    methods: {
      getQaNum (qorder, qswiperIndex, islast) {
        Bus.$emit('turnQaNum', qorder, qswiperIndex, islast)
      },
      classObject (qorder, isanswer, isorderAnswer) {
        return {
          'check-right': isanswer && isorderAnswer,
          'check-error': isorderAnswer === false,
          'isanswer': isanswer
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .answer-temporary
    display none
  .partitem-slide .answer-orderwrap
    max-height:calc(100% - 120px)
    max-height calc(100vh - 120px)
  .answer-orderwrap
    max-height 70%
    padding 20px
    background-color #fff
    overflow auto
    .circle-zone
      margin-bottom -5px
    dl
     margin-bottom 40px
     dt
       margin-bottom 20px
    .circle-item
      display inline-block
      width 20%
      text-align center
      margin-bottom 5px
    .circle
      display inline-block
      width 44px
      height 44px
      margin-right 10px
      line-height 44px
      text-align center
      font-size $font-size-medium
      border 1px solid $color-border-default
      border-radius 50%
      cursor pointer
      color $color-default
      &:last-child
        margin-right 0
      &.isanswer
        border-color $color-main
        color $color-main
      &.check-error
        background-color #ffeeee
        color #ff0000
        border-color #ff0000
      &.check-right
        background-color #efffe8
        color #41c80a
        border-color #41c80a
</style>