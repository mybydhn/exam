<template>
  <div class="swiper-container questionwrapper" ref="questionWrapper" v-if="paperPartQuesInfo.partQuestionList.length>0">
      <div class="swiper-wrapper">
        <div v-for="(partqitem,index) in paperPartQuesInfo.partQuestionList" class="swiper-slide">
             <div v-if="partqitem.parttype && partqitem.parttype === 1" class="partitem-slide partitem-zone">
               <div class="title-zone">
                 <span class="index"><i>{{partqitem.orderindex}}</i></span>
                 <span class="name">{{partqitem.partname}}</span>
               </div>
                <p class="info">
                  <span><i class="iconfont">&#xe857;</i><em>共{{computeNum(partqitem)}}题</em></span>
                  <span><i class="iconfont">&#xe833;</i><em>{{computeScore(partqitem)}}分</em></span>
                </p>
                <p class="desc">{{partqitem.partDesc}}</p>
                <p class="firt-part__specialinfo" v-if="index===0"></p>
             </div>
             <div v-else class="partitem-slide">
              <p class="q-partinfo">{{partqitem.partname}}</p>
              <single v-if="partqitem.type ===1" :question="partqitem" :type="type"></single>
              <mutli v-else-if="partqitem.type ===2" :question="partqitem" :type="type"></mutli>
              <completion v-else-if="partqitem.type ===3" :question="partqitem" ref="completionwrap" :type="type"></completion>
              <judge v-else-if="partqitem.type ===4" :question="partqitem" :type="type"></judge>
               </div>
        </div>
        <div class="swiper-slide">
          <examination-card :type="type" class="partitem-slide"></examination-card>
        </div>
      </div>
  </div>
</template>
<script>
  import Single from 'components/question/single'
  import Mutli from 'components/question/mutli'
  import Judge from 'components/question/judge'
  import Completion from 'components/question/completion'
  import ExaminationCard from 'components/exam/examinationcard'
  import Bus from '@/common/js/bus'
  import {mapGetters} from 'vuex'
  import {stopAllMedia} from '@/common/js/controlplay'
  export default {
    data () {
      return {
        partsQuestionList: [],
        questionAnswer: new Map(),
        paperQuesInfo: {},
        partSwipe: ''
      }
    },
    props: {
      type: {
        type: Number,
        default: 1
      }
    },
    computed: {
      ...mapGetters([
        'paperPartQuesInfo'
      ])
    },
    mounted () {
      let _this = this
      this.paperQuesInfo = this.paperPartQuesInfo
      this.partsQuestionList = this.paperPartQuesInfo.partQuestionList
      this.$nextTick(() => {
        _this.changeSlide()
      })
      Bus.$on('answer', (val) => {
        let valkey = val.questionid
        _this.questionAnswer.set(valkey, val)
      })
    },
    destroyed () {
      Bus.$off('answer')
    },
    methods: {
      changeSlide () {
        const _this = this
        _this.partSwipe = new Swiper('.swiper-container', {
          autoplay: false, // 可选选项，自动滑动
          preventClicks: true,
          preventLinksPropagation: true,
          noSwipingClass: 'mejs__container',
          on: {
            slideChange: function () {
              stopAllMedia()
              document.documentElement.scrollTop = 0
              // 填空题光标移除 --不好（没有想到好方法）
              let blankInputArr = this.$el.find('input.blank-input')
              if (blankInputArr.length > 0) {
                blankInputArr.each(function (index) {
                  blankInputArr[index].blur()
                })
              }
              if (_this.partsQuestionList[this.activeIndex]) {
                if (!_this.partsQuestionList[this.activeIndex].parttype) {
                  _this.$emit('getCurNums', _this.partsQuestionList[this.activeIndex].qorder)
                }
              }
            }
          }
        })
      },
      computeScore (part) {
        let partsScore = 0
        partsScore = part.children.reduce((score, current) => {
          return score + current.score
        }, 0)
        return partsScore
      },
      computeNum (part) {
        return part.children.length
      },
      turnQaNum (qanum, index) {
        this.goToPage(index)
      },
      goToPage (index) {
        this.partSwipe.slideTo(index, 0, false) // 切换到第一个slide，速度为1秒
      },
      getQuestionsAnswer () {
        let decorateAnswer = []
        for (var value of this.questionAnswer.values()) {
          let stuAnswer
          stuAnswer = {type: value.type, ID: value.questionid, score: value.score, answer: value.stuAnswer}
          decorateAnswer.push(stuAnswer)
        }
        return decorateAnswer
      }
    },
    components: {
      ExaminationCard,
      Single,
      Mutli,
      Judge,
      Completion
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .partitem-slide
    position relative
    height calc(100% - 50px)
    height calc(100vh - 50px)
    overflow-y auto
  .wrapios .partitem-slide 
    height calc(100% - 70px)
    height:calc(100vh - 70px)
  .partitem-zone
    padding 60px 30px 70px
    .title-zone
      display flex
      align-items center
      margin-bottom 16px
    .index
      position relative
      float left
      width 70px
      height 60px
      margin-right 10px 
      background url('/static/img/partnum.png')
      background-size contain
      i
       position absolute
       left 18px
       top 12px
       transform rotate(-15deg)
       font-size $font-size-medium-x
       font-style normal
       color $color-main
    .name
      display: -webkit-box
      flex 1
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical
      font-size $font-size-large-m
      line-height 1.2
      font-weight bold
      word-wrap break-word
      overflow: hidden
      text-overflow: ellipsis
    .info
      display flex
      padding 25px 30px
      margin-bottom 20px
      align-items center
      background url('/static/img/tinum_bj.png') no-repeat center
      background-size cover
      text-align center
      border-radius 4px
      span
        flex 1
        font-size $font-size-medium-x
        color #fff
        &:first-child
          margin-right 30px
        i
         margin-right 8px
         font-size $font-size-icon
         vertical-align middle
        em
         font-style normal
         vertical-align middle
    .desc
      font-size $font-size-medium-x
      line-height 1.875
      color $color-default
    .firt-part__specialinfo
       max-width 300px
       height 160px
       margin 20px auto 0
       background url('/static/img/switch.png') no-repeat center
       background-size contain
  .q-partinfo
    height 44px
    padding 0 16px
    font-size $font-size-medium
    line-height 44px
    color $color-default
    background-color #f1f3f7
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
</style>