<template>
  <section class="qaitem-zone" v-if="item.questionid">
    <div class="qheader">
      <p class="type">单选题</p>
      <div v-html="item.title" class="qtitle"></div>
      <div v-if="item.link && item.link.length>0">
        <attach-file :addr="itemlink" v-for="(itemlink,index) in item.link" :key="index" :id="decorate('ques',item.questionid,0)"></attach-file>
      </div>
    </div>
     <ul>
       <li  v-for="(qustionitem,index) in item.choiceitemModels" class="optionitem">
         <label class="check-label">
          <input type="radio" :name="item.questionid" class="radio-check" :value="index|formatOptionIndex" v-model="answer" :disabled="type !== 1"><i class="iconfont radio-icon" :class="renderCorrectAnswer(index)"></i>
          <div  class="title-wrap">{{index|formatOptionIndex}}.<div v-html="qustionitem.title" class="title-zone" v-if="qustionitem.title.length>0"></div>
          </div>
         </label>
         <div v-if="qustionitem.link" class="questionlink" :class="{'questionlink-special' :qustionitem.title.length <= 0}"><attach-file :addr="qustionitem.link" :id="decorate('anay',item.questionid,index)"></attach-file></div>
       </li>
     </ul>
     <div class="anlysis-zone" v-if="type ===2">
        <p class="anlysis-answer">正确答案：{{item.correctAnswer}}</p>
        <p class="anlysis-answer">你的答案：{{item.stuAnswer|formatStuAns}}</p>
        <div class="anlysis-explain" v-if="item.correctReplay">解析：<div v-html="item.correctReplay" class="main-info"></div></div>
     </div>
  </section>
</template>
<script>
  import AttachFile from 'components/attachFile/attachFile'
  import Question from '@/model/question'
  import {formatOptionIndex} from '@/common/js/option'
  import Bus from '@/common/js/bus'
  export default {
    data () {
      return {
        answer: undefined,
        item: {}
      }
    },
    props: ['question', 'type'],
    watch: {
      answer: {
        handler: function (val) {
          this.item.setStuAnswer(val)
          Bus.$emit('answer', this.item)
        }
      }
    },
    filters: {
      formatOptionIndex (index) {
        return formatOptionIndex(index)
      },
      formatStuAns (userAnswer) {
        if (!userAnswer) {
          return '未作答'
        } else {
          return userAnswer
        }
      }
    },
    mounted () {
      this.item = new Question(this.question)
      if (this.item.stuAnswer) {
        this.answer = this.item.stuAnswer
      } else {
        this.answer = ''
      }
      this.changeOrderStatus()
    },
    methods: {
      decorate (identifying, id, pos) {
        return identifying + id + pos
      },
      renderAnswer (optionIndex, answer) {
        return formatOptionIndex(optionIndex) === answer
      },
      renderCorrectAnswer (index) {
        if (this.type === 2) {
          let curAnswer = formatOptionIndex(index)
          let stuAnswer = this.item.stuAnswer
          let correctAnswer = this.item.correctAnswer
          if (curAnswer === stuAnswer) {
            if (curAnswer === correctAnswer) {
              return 'check-right'
            } else {
              return 'check-error'
            }
          } else if (curAnswer === correctAnswer) {
            return 'check-forgot'
          }
          return ''
        }
        return false
      },
      changeOrderStatus () {
        if (this.type === 2) {
          if (this.item.stuAnswer === this.item.correctAnswer) {
            this.item.setIsRightAnswer(true)
          } else {
            this.item.setIsRightAnswer(false)
          }
          Bus.$emit('renderanswer', this.item)
        }
      }
    },
    components: {
      AttachFile
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .qaitem-zone
     background-color #fff
     .qheader
        padding 30px 16px
        position:relative
        border-bottom-1px($color-border-default)
        .type
          position:absolute
          top 0
          left 0
          padding 0 16px 0 8px
          height 20px
          font-size 12px
          line-height 20px
          background-color #ffefe2
          color #ff9c62
          border-bottom-right-radius 20px
        .qtitle
          font-size $font-size-medium-x
          word-wrap break-word
          line-height 1.25
     .questionlink
       margin: 0 46px
     .questionlink.questionlink-special
       margin -20px 46px 0 66px
     .optionitem
       min-height 26px
       padding 20px 0
       vertical-align middle
       border-bottom-1px($color-border-default)
       .check-label
         display:block
         padding 0 10px
         .radio-icon
           position relative
           float left
           width 26px
           height 26px
           margin-right 8px
           line-height 26px
           color $color-uncheck
           border 1px solid $color-uncheck
           border-radius 50%
           text-align center
           &:after
            content:'\e83d'
            font-family:"iconfont"
         .check-error
           &:after
            content:'\e83e'
            font-family:"iconfont"
         .radio-check
           display none
         .radio-check:checked+.radio-icon
           color $color-main
           border-color $color-main
         .check-right
           background-color $color-right
           color #fff
           border-color $color-right
         .radio-check:checked+.check-right
           background-color $color-right
           color #fff
           border-color $color-right
         .check-error
           background-color $color-error
           color #fff
           border-color $color-error
         .radio-check:checked+.check-error
           background-color $color-error
           color #fff
           border-color $color-error
         .check-forgot
           background-color #fff
           color $color-error
           border-color $color-error
         .radio-check:checked+.check-forgot
           background-color #fff
           color $color-error
           border-color $color-error
           &:after
            content:'\e83e'
            font-family:"iconfont"
         .title-wrap
           margin-left 34px
           line-height 1.25
         .title-zone
           display inline
    .anlysis-zone
       anlysis-zone()
       .anlysis-answer
          margin-bottom 4px
       .main-info
          display inline-block
          vertical-align top
</style>