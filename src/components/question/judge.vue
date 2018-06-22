<template>
  <section class="qaitem-zone"  v-if="item.questionid">
    <div class="qheader">
      <p class="type">判断题</p>
      <div v-html="item.title" class="qtitle"></div>
      <div v-if="item.link && item.link.length>0">
        <attach-file :addr="itemlink" v-for="(itemlink,index) in item.link" :key="index" :id="decorate('ques',item.questionid,0)"></attach-file>
      </div>
    </div>
     <ul class="judgeoptionitem-zone">
       <li class="optionitem">
         <label class="check-label"><input type="radio" :name="item.questionid" class="radio-check" value="true" v-model="answer" :disabled="type !== 1"><i class="iconfont radio-icon">&#xe83d;<span :class="renderCorrectAnswer('true')"></span></i></label>
       </li>
       <li class="optionitem">
         <label class="check-label"><input type="radio" :name="item.questionid" class="radio-check" value="false" v-model="answer":disabled="type !== 1"><i class="iconfont radio-icon">&#xe83e;<span :class="renderCorrectAnswer('false')"></span></i></label>
       </li>
     </ul>
     <div class="anlysis-zone" v-if="type ===2">
        <p class="anlysis-answer">正确答案：<i class="iconfont" v-html="formatcorrAnswer(item.correctAnswer)"></i></p>
        <p class="anlysis-answer">你的答案：<i class="iconfont" v-html="formatStuAnswer(item.stuAnswer)"></i></p>
        <div class="anlysis-explain" v-if="item.correctReplay">解析：<div v-html="item.correctReplay" class="main-info"></div></div>
     </div>
  </section>
</template>
<script>
  import AttachFile from 'components/attachFile/attachFile'
  import Question from '@/model/question'
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
      formatcorrAnswer (correctAnswer) {
        correctAnswer = correctAnswer.toLowerCase()
        if (correctAnswer === 'true') {
          return '&#xe83d;'
        } else {
          return '&#xe83e;'
        }
      },
      formatStuAnswer (userAnswer) {
        if (!userAnswer) {
          return '未作答'
        } else {
          if (userAnswer === 'true') {
            return '&#xe83d;'
          } else {
            return '&#xe83e;'
          }
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
      renderAnswer (val, answer) {
        return val === answer
      },
      renderCorrectAnswer (curAnswer) {
        if (this.type === 2) {
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
        return ''
      },
      formatcorrAnswer (correctAnswer) {
        correctAnswer = correctAnswer.toLowerCase()
        if (correctAnswer === 'true') {
          return '&#xe83d;'
        } else {
          return '&#xe83e;'
        }
      },
      formatStuAnswer (userAnswer) {
        if (!userAnswer) {
          return '未作答'
        } else {
          userAnswer = userAnswer.toLowerCase()
          if (userAnswer === 'true') {
            return '&#xe83d;'
          } else {
            return '&#xe83e;'
          }
        }
      },
      changeOrderStatus () {
        if (this.type === 2) {
          let userAnswer = this.item.stuAnswer.toLowerCase()
          let correctAnswer = this.item.correctAnswer.toLowerCase()
          if (userAnswer === correctAnswer) {
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
     .judgeoptionitem-zone
        text-align center
     .optionitem
       display inline-block
       &:first-child
         margin-right 60px
       .check-label
         display:block
         text-align center
         .radio-icon
           position relative
           display block
           width 60px
           height 60px
           border 1px solid $color-uncheck
           border-radius 50%
           line-height 60px
           color $color-uncheck
           text-align center
         .radio-check
           display none
         .radio-check:checked+.radio-icon
           color $color-main
           border-color $color-main
         .check-right
           position absolute
           width 30px
           height 30px
           border-radius 50%
           right -10px
           top -10px
           background-color $color-right
           color #fff
           border-color $color-right
           &:after
            position absolute
            left 50%
            top 50%
            transform translate(-50%,-50%)
            content:'\e83d'
            font-family:"iconfont"
         .check-error
           position absolute
           width 30px
           height 30px
           border-radius 50%
           right -10px
           top -10px
           background-color $color-error
           color #fff
           border-color $color-error
           &:after
            position absolute
            left 50%
            top 50%
            transform translate(-50%,-50%)
            content:'\e83e'
            font-family:"iconfont"
    .anlysis-zone
       anlysis-zone()
       .anlysis-answer
          margin-bottom 4px
          color $color-default
       .main-info
          display inline-block
          vertical-align top
</style>