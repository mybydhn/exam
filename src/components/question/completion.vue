<template>
  <section class="qaitem-zone"  v-if="item.questionid">
    <div class="qheader">
      <p class="type">填空题</p>
      <div v-html="formatTitle(item.title)" ref="blankAnswerwrap" tabindex="0" @change="changeStr($event)" class="blank-wrap"></div>
      <div v-if="item.link && item.link.length>0">
        <attach-file :addr="itemlink" v-for="(itemlink,index) in item.link" :key="index" :id="decorate('ques',item.questionid,0)"></attach-file>
      </div>
    </div>
    <div class="anlysis-zone" v-if="type ===2">
        <p class="anlysis-answer">正确答案：{{item.correctAnswer}}</p>
        <p class="anlysis-answer">你的答案：{{item.stuAnswer|formatStuAnswer}}</p>
        <div class="anlysis-explain" v-if="item.correctReplay">解析：<div v-html="item.correctReplay" class="main-info"></div></div>
     </div>
  </section>
</template>
<script>
  import AttachFile from 'components/attachFile/attachFile'
  import Question from '@/model/question'
  import Bus from '@/common/js/bus'
  import { addClass, hasClass } from '@/common/js/dom'
  const CHECKRIGHT = 'check-completion-right'
  const CHECKFALSE = 'check-completion-false'
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
          if (this.type === 1) {
            console.log('handler..handler..handler...')
            this.item.setStuAnswer(val)
            Bus.$emit('answer', this.item)
          }
        }
      }
    },
    filters: {
      formatStuAnswer (userAnswer) {
        if (!userAnswer || userAnswer.length <= 0) {
          return '未作答'
        } else {
          return userAnswer
        }
      }
    },

    mounted () {
      const _this = this
      _this.item = new Question(_this.question)
      if (_this.item.stuAnswer) {
        _this.answer = _this.item.stuAnswer
      } else {
        _this.answer = ['']
      }
      if (_this.type === 1) {
        this.$nextTick(() => {
          _this.renderStuAnswer()
        })
      } else if (_this.type === 2) {
        this.$nextTick(() => {
          _this.renderCorrectAnswer()
        })
      } else if (_this.type === 4) {
        this.$nextTick(() => {
          _this.renderStuAnswerNoCorrect()
        })
      }
    },
    methods: {
      decorate (identifying, id, pos) {
        return identifying + id + pos
      },
      formatTitle (title) {
        let blankRegx = /[(（](\s|&nbsp;)*[)）]|_{5,}/gi
        if (this.type === 1) {
          title = title.replace(blankRegx, '<span class="input-wrapper"><input type="text" class="blank-input needsclick"/></span>')
        } else {
          title = title.replace(blankRegx, '<span><span class="blank-input"/></span></span>')
        }
  
        return title
      },
      changeStr ($event) {
        let _this = this
        if (_this.type === 1) {
          let tempanswer = []
          if (hasClass($event.target, 'blank-input')) {
            let blankArr = this.$refs.blankAnswerwrap.getElementsByClassName('blank-input')
            for (let i = 0; i < blankArr.length; i++) {
              let blankanswer = blankArr[i].value
              tempanswer[i] = blankanswer
            }
            _this.answer = Object.assign([], tempanswer)
          }
        }
      },
      renderStuAnswer () {
        if (this.item.stuAnswer === undefined) {
          return false
        }
        let oldAnswer
        if (typeof (this.item.stuAnswer) === 'string') {
          oldAnswer = this.item.stuAnswer.split(';')
        } else if (Array.isArray(this.item.stuAnswer)) {
          oldAnswer = this.item.stuAnswer
        }
        this.answer = Object.assign([], oldAnswer)
        let blankArr = this.$refs.blankAnswerwrap.getElementsByClassName('blank-input')
        for (let i = 0; i < blankArr.length; i++) {
          if (Array.isArray(oldAnswer)) {
            blankArr[i].value = oldAnswer[i] || ''
          }
        }
      },
      renderStuAnswerNoCorrect () {
        if (this.item.stuAnswer === undefined) {
          return false
        }
        let oldAnswer
        if (this.item.stuAnswer === undefined) {
          oldAnswer = []
        } else if (typeof (this.item.stuAnswer) === 'string') {
          oldAnswer = this.item.stuAnswer.split(';')
        } else if (Array.isArray(this.item.stuAnswer)) {
          oldAnswer = this.item.stuAnswer
        }
        this.answer = Object.assign([], oldAnswer)
        let blankArr = this.$refs.blankAnswerwrap.getElementsByClassName('blank-input')
        for (let i = 0; i < blankArr.length; i++) {
          if (Array.isArray(oldAnswer)) {
            blankArr[i].innerHTML = oldAnswer[i] || ''
            addClass(blankArr[i], 'blank-echo')
          }
        }
      },
      renderCorrectAnswer () {
        const _this = this
        let oldAnswer
        if (this.item.stuAnswer === undefined) {
          oldAnswer = []
        } else if (typeof (this.item.stuAnswer) === 'string') {
          oldAnswer = this.item.stuAnswer.split(';')
        } else if (Array.isArray(this.item.stuAnswer)) {
          oldAnswer = this.item.stuAnswer
        }
        let useranswer
        if (Array.isArray(oldAnswer)) {
          useranswer = Object.assign([], oldAnswer)
        }
        let correntAnswer = this.item.correctAnswer.split(';')
        let isCorrect = []
        correntAnswer.map((correntAns, index) => {
          correntAns = _this.trim(correntAns)
          useranswer[index] = _this.trim(useranswer[index] || '')
          isCorrect.push(CHECKFALSE)
        })
        if (this.item.blankOrder === 0) {
          // 不可以互换
          correntAnswer.map((correntAns, index) => {
            let curcorrentAns = correntAns.split('//')
            let resUserAnswer = useranswer[index] || ''
            // 如果没有值则为没有作答
            let isequal = false
            resUserAnswer = _this.trim(resUserAnswer)
            curcorrentAns.map((inneritem, innerindex) => {
              let resCorrect = _this.trim(inneritem)
              if (resUserAnswer === resCorrect) {
                isCorrect[index] = CHECKRIGHT
                isequal = true
                return false
              }
            })
            if (!isequal) {
              isCorrect[index] = CHECKFALSE
            }
          })
        } else {
          correntAnswer.map((correntAns, index) => {
            let curcorrentAns = correntAns.split('//')
            for (let innerindex = 0; innerindex < curcorrentAns.length; innerindex++) {
              let inneritem = curcorrentAns[innerindex]
              let resCorrect = _this.trim(inneritem)
              let isCorrectIndex = useranswer.indexOf(resCorrect)
              if (isCorrectIndex >= 0) {
                isCorrect[isCorrectIndex] = CHECKRIGHT
                correntAns = null
                return false
              }
            }
          })
        }
        if (!this.$refs.blankAnswerwrap) {
          return false
        }
        let blankArr = this.$refs.blankAnswerwrap.getElementsByClassName('blank-input')
        for (let i = 0; i < blankArr.length; i++) {
          if (Array.isArray(oldAnswer)) {
            if (isCorrect[i] === CHECKFALSE) {
              let str = oldAnswer[i] || '未作答'
              blankArr[i].innerHTML = '<span class="error">' + str + '</span><span class="right">(' + correntAnswer[i] + ')</span>'
            } else if (isCorrect[i] === CHECKRIGHT) {
              blankArr[i].innerHTML = '<span class="right">' + oldAnswer[i] + '</span>'
            }
          } else {
            blankArr[i].innerHTML = '<span class="empty">未作答</span>' + '<span class="right">(' + correntAnswer[i] + ')</span>'
          }
          addClass(blankArr[i], isCorrect[i])
          let isordEqual = false
          isordEqual = isCorrect.every((correctitem) => {
            return correctitem === CHECKRIGHT
          })
          this.item.setIsRightAnswer(isordEqual)
          Bus.$emit('renderanswer', this.item)
        }
      },
      trim (str) {
        str = str.replace(/^(\s|\u00A0)+/, '')
        for (var i = str.length - 1; i >= 0; i--) {
          if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1)
            break
          }
        }
        str = str.replace(/\s+/g, ' ')
        return str
      }
    },
    components: {
      AttachFile
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../stylus/variable.styl"
  .blank-input
    word-wrap break-word
  .qaitem-zone
    background-color #fff
    .input-wrapper
       display inline-block
       min-width 60px
       padding 0 20px
       height 40px
       line-height 40px
       border 1px solid $color-border-default
       box-sizing border-box
       border-radius 4px
       .blank-input
         display block
         height 100%
         background-color transparent
         outline none
    .check-completion-right
      color $color-right
    .check-completion-false
      color $color-error
      .error
        text-decoration line-through
      .empty
        text-decoration line-through
      .right
        color $color-right
    .blank-echo
      display inline-block
      height 40px
      min-width 60px
      line-height 40px
      border 1px solid $color-border-default
      background-color #fff
      vertical-align middle
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .blank-wrap
    line-height 40px
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
    .anlysis-zone
      anlysis-zone()
      .anlysis-answer
        margin-bottom 4px
      .main-info
        display inline-block
        vertical-align top
</style>