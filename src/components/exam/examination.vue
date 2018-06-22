<template>
  <div v-if="isDis">
    <m-header>
      <span class="iconfont" @click="back()" slot="headerback">&#xe907;</span>
      <div slot="headermain" class="header-examinfo">
         <answer-sheet-num :totalNum="totalNum" :curNum="curNum" class="answercard" @showAnswerCard="showAnswerCard" ref="answersheet"></answer-sheet-num>
         <m-timer class="time" :surplusTime="surplusTime" ref="mtimer"></m-timer>
      </div>
    </m-header>
    <parts @getCurNums="getCurNums" ref="slide" :type="1"></parts>
    <div class="answer-sheetpopup" :class="{popup_shown:isShowAnswerCard}" v-if="isShowAnswerCard" @click="answersheetShrink">
      <answer-order></answer-order>
      <span @click="submitPaper()" class="submitcard-paper">交卷</span>
    </div>
    <cube-extend-popup ref="extendPopup" :center=true class="backexam-Popup">
      <div class="backtip-zone">
        <div class="backtip-bg"><p></p></div>
        <p class="backtip-info">你还未交卷,确定离开？</p>
        <span class="backtip-continuebtn" @click="continueAnswer()">继续答题</span>
        <span class="backtip-leavebtn" @click="leavePage()">保存草稿并离开</span>
      </div>
    </cube-extend-popup>
  </div>
  <loading v-else></loading>
</template>
<script>
  import MHeader from 'components/mheader'
  import AnswerSheetNum from 'components/answersheet/answersheetNum'
  import AnswerOrder from 'components/answersheet/answerorder'
  import MTimer from 'components/mtimer/mtimer'
  import Parts from 'components/parts/parts'
  import CubeExtendPopup from 'components/popup/cubeExtendPopup'
  import BackEvent from '@/common/js/UBackEvent'
  import Paper from '@/model/paper'
  import {startExam, getPaper, getTheLastAnswer, savePaperAnswerToMemcache, savePaperAnswer} from 'api/exam.js'
  import Bus from '@/common/js/bus'
  import Loading from 'components/loading/loading'
  import {mapActions} from 'vuex'

  export default {
    data () {
      return {
        autoSavedKey: '',
        totalNum: 0,
        curNum: 0,
        surplusTime: '',
        isShowAnswerCard: false,
        paperTestInfo: {},
        examID: this.$route.params.examid,
        userID: this.$route.params.userid,
        examUserID: 0,
        questionAnswer: new Set(),
        examCount: '',
        currentTime: 0,
        endTime: 0,
        isDis: false
      }
    },
    created () {
      let _this = this
      BackEvent.addBackEvent(this.$route, function () {
        _this.back()
      })
      startExam(this.userID, this.examID, function (data) {
        let status = data.status
        _this.currentTime = data.currentTime
        _this.endTime = data.endTime
        if (status === 0) {
          _this.handleStartExam(data)
        } else if (status === 1) {
          let message = '当前时间不能参加考试'
          const toast = _this.$createToast({
            type: '',
            time: 2000,
            txt: message,
            onTimeout: () => {
              _this.$router.push({path: '/index/', query: { userid: _this.userID }})
            }
          })
          toast.$el.getElementsByClassName('cube-toast-icon')[0].style.display = 'none'
          toast.show()
        } else if (status === 2) {
          let message = '超过答题次数'
          const toast = this.$createToast({
            type: '',
            time: 2000,
            txt: message,
            onTimeout: () => {
              _this.$router.push({path: '/index/', query: { userid: _this.userID }})
            }
          })
          toast.$el.getElementsByClassName('cube-toast-icon')[0].style.display = 'none'
          toast.show()
        }
      }, function () {

      })
    },
    mounted () {
      let _this = this
      setInterval(function () {
        _this.saveAnswer4Auto()
      }, 300000)
      Bus.$on('answer', (val) => {
        _this.questionAnswer.add(val)
        let info = Object.assign({}, _this.paperTestInfo)
        info.part[val.partIndex].children[val.p4qindex].isanswer = val.isanswer
        _this.modifyPaperQuesInfo(info)
      })
      Bus.$on('turnQaNum', (qorder, qswiperIndex, islast) => {
        _this.turnQaNum(qorder, qswiperIndex, islast)
      })
      Bus.$on('submitPaper', () => {
        _this.submitPaper()
      })
    },
    destroyed () {
      Bus.$off('answer')
      Bus.$off('turnQaNum')
      Bus.$off('submitPaper')
      Bus.$off('answerOrder')
      clearInterval(this.examCount)
    },
    methods: {
      back () {
        if (!this.isShowAnswerCard) {
          this.backSaveAnswerTip()
        } else {
          this.isShowAnswerCard = !this.isShowAnswerCard
          this.$refs.answersheet.changeSataus()
        }
      },
      getCurNums (num) {
        this.curNum = num
      },
      handleStartExam (data) {
        const _this = this
        _this.examUserID = data.examUserID
        getPaper(data.paperID, function (paperdata) {
          _this.handlePaperQa(data, paperdata)
        }, function () {

        })
      },
      handlePaperQa (examdata, paperdata) {
        let _this = this
        let parts = []
        paperdata.part.sort(_this._comparePart('orderindex'))
        parts = paperdata.part.map((item) => {
          if (item.type - 0 === 1) {
            _this._shuffle(item.children)
          }
          return item
        })
        paperdata.part = Object.assign([], parts)
        this.paperTestInfo = new Paper(paperdata)
        this.paperTestInfo.setPartQueNum()
        this.totalNum = this.paperTestInfo.getTotalNum()
        this.autoSavedKey = examdata.autoSavedKey
        let surplusTime = examdata.examTime + ':00'
        if (!examdata.isNew) {
          // 获取学生的答题记录
          getTheLastAnswer(_this.autoSavedKey, function (studata) {
            if (studata.surplus && _this._validateTime(studata.surplus)) {
              surplusTime = studata.surplus
            }
            _this.surplusTime = surplusTime
            _this.handlePaperstuAnswer(studata)
            _this.paperTestInfo.setPartsQUestions()
            _this.isDis = true
            _this._countDown()
          }, function () {

          })
        } else {
          _this.paperTestInfo.setPartsQUestions()
          _this.surplusTime = surplusTime
          _this.isDis = true
          _this._countDown()
        }
      },
      handlePaperstuAnswer (data) {
        let tabAnswer = data.tabs
        this.paperTestInfo.setStuAnswer(tabAnswer)
        this.paperTestInfo.setPartQuesisAnswer()
      },
      _comparePart (property) {
        return function (obj1, obj2) {
          let value1 = obj1[property]
          let value2 = obj2[property]
          return value1 > value2
        }
      },
      _shuffle (data) {
        let len = data.length
        for (let i = 0; i < len - 1; i++) {
          let index = parseInt(Math.random() * (len - i))
          let temp = data[index]
          data[index] = data[len - i - 1]
          data[len - i - 1] = temp
        }
      },
      showAnswerCard (data) {
        this.isShowAnswerCard = data
      },
      turnQaNum (qanum, index, islast) {
        if (!islast) {
          this.isShowAnswerCard = false
          if (this.$refs.answersheet) {
            this.$refs.answersheet.changeSataus()
          }
        }
        if (this.$refs.slide) {
          this.$refs.slide.goToPage(index)
        }
        this.curNum = qanum
      },
      _validateTime (surplusTime) {
        if (typeof (surplusTime) === 'string') {
          let timeArr = surplusTime.split(':')
          if (isNaN(timeArr[0])) {
            return false
          }
        }
        return true
      },
      _countDown () {
        let _this = this
        let info = Object.assign({}, _this.paperTestInfo)
        _this.modifyPaperQuesInfo(info)
        let desttime = 0
        let disminutes = 0
        if (_this.endTime > _this.currentTime) {
          disminutes = Math.round((_this.endTime - _this.currentTime) / 1000)
        }
        let surplusTime = this.surplusTime
        let seconds, minutes
        if (typeof (surplusTime) === 'string') {
          let timeArr = surplusTime.split(':')
          seconds = Number(timeArr[1], 10) >= 0 ? Number(timeArr[1], 10) : 0
          minutes = Number(timeArr[0], 10) >= 0 ? Number(timeArr[0], 10) : 0
          desttime = minutes * 60 + seconds
        } else {
          minutes = surplusTime - 0
          seconds = 0
          desttime = minutes * 60 + seconds
        }
        if (desttime > disminutes) {
          desttime = disminutes
          minutes = parseInt(desttime / 60)
          seconds = parseInt(desttime % 60)
        }
        _this.examCount = setInterval(() => {
          if (seconds > 0) {
            seconds--
          } else {
            if (minutes > 0) {
              seconds = 59
              minutes--
            }
          }
          _this._countTime(seconds, minutes)
        }, 1000)
      },
      _countTime (seconds, minutes) {
        let _this = this
        let second = (seconds >= 10) ? seconds : ('0' + seconds)
        let minute = (minutes >= 10) ? minutes : ('0' + minutes)
        this.surplusTime = minute + ':' + second
        if (minutes <= 0 && seconds <= 0) {
          clearInterval(_this.examCount)
          _this.submitPaper4TimeOut()
        }
      },
      continueAnswer () {
        this.$refs.extendPopup.hide()
      },
      leavePage () {
        const _this = this
        let answerjson = this.decorateAnswer()
        let toast = _this.$createToast({
          type: 'loading',
          time: 0,
          mask: true,
          txt: '保存答案中'
        })
        toast.show()
        this.saveAnswerFinal(1, answerjson, function () {
          toast.hide()
          _this.$router.push({path: '/index/', query: { userid: _this.userID }})
        }, function () {
          _this.$createToast({
            time: 5000,
            mask: true,
            txt: '自动保存答案失败，检查网络'
          })
        })
      },
      saveAnswer4Auto () {
        // 自动提交答案
        const _this = this
        if (this.$refs.slide) {
          let answerjson = this.decorateAnswer()
          this.saveAnswerFinal(1, answerjson, function () {
          }, function () {
            _this.$createToast({
              time: 5000,
              mask: true,
              txt: '自动保存答案失败，检查网络'
            }).show()
          })
        }
      },
      submitPaper () {
        // 判断是否已未答的题
        this.saveAnswer4Manual()
      },
      saveAnswer4Manual () {
        // 手动提交答案
        const _this = this
        if (this.$refs.slide) {
          let answerjson = this.decorateAnswer()
          let unanswerlen = 0
          answerjson.tabs.map((item) => {
            let strans
            if (Array.isArray(item.answer)) {
              strans = item.answer.join(',')
            } else {
              strans = item.answer
            }
            if (!strans) {
              unanswerlen++
            }
          })
          answerjson['examUserID'] = this.examUserID
          if (unanswerlen > 0) {
            _this.subAnsDia(answerjson, `<p class="subanstip">你有${unanswerlen}道题未作答,确定提交？</p>`, '交卷', '继续答题')
          } else {
            _this.subAnsDia(answerjson, '<p class="subanstip">确定提交</p>', '确定', '取消')
          }
        }
      },
      submitPaper4TimeOut () {
        const _this = this
        const toast = this.$createToast({
          time: 0,
          mask: true,
          txt: '考试时间结束，正在交卷'
        })
        toast.show()
        let answerjson = this.decorateAnswer()
        answerjson['examUserID'] = _this.examUserID
        _this.saveAnswerFinal(2, answerjson, function () {
          toast.hide()
          _this.$router.push({path: '/index/', query: { userid: _this.userID }})
        }, function () {
          toast.hide()
          _this.$router.push({path: '/index/', query: { userid: _this.userID }})
        })
      },
      subAnsDia (answerjson, content, confirmBtnTxt, cancelBtntxt) {
        const _this = this
        this.$createDialog({
          type: 'confirm',
          content: content,
          confirmBtn: {
            text: confirmBtnTxt,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: cancelBtntxt
          },
          onConfirm: () => {
            const toast = this.$createToast({
              time: 0,
              mask: true,
              txt: '正在交卷'
            })
            toast.show()
            _this.saveAnswerFinal(2, answerjson, function () {
              toast.hide()
              _this.$router.push({path: '/index/', query: { userid: _this.userID }})
            }, function () {
              toast.hide()
              _this.$createToast({
                time: 5000,
                mask: true,
                txt: '交卷失败'
              }).show()
            })
          }
        }).show()
      },
      decorateAnswer () {
        if (this.$refs.slide) {
          let questAns = this.$refs.slide.getQuestionsAnswer()
          let mtimer = this.$refs.mtimer.getSurplusTime()
          var json = {'surplus': mtimer, 'tabs': questAns}
          return json
        }
        return {}
      },
      backSaveAnswerTip () {
        this.$refs.extendPopup.show()
      },
      saveAnswerFinal (type, data, success, failure) {
        data['autoSavedKey'] = this.autoSavedKey
        if (type === 1) {
          savePaperAnswerToMemcache(data, success, failure)
        } else {
          savePaperAnswer(data, success, failure)
        }
      },
      answersheetShrink () {
        this.isShowAnswerCard = false
        if (this.$refs.answersheet) {
          this.$refs.answersheet.changeSataus()
        }
      },
      ...mapActions([
        'modifyPaperQuesInfo'
      ])
    },
    components: {
      MHeader,
      AnswerSheetNum,
      AnswerOrder,
      MTimer,
      CubeExtendPopup,
      Parts,
      Loading
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../stylus/variable.styl"
  .subanstip
    padding 10px 20px
  .backexam-Popup .cube-popup-content
    width calc(100vw) !important
  .backtip-zone
    padding-bottom 40px
    background-color #fff
    background-size cover
    border-radius 16px
    overflow hidden
    .backtip-bg
      padding-top 50%
      position relative
      p
       position absolute
       top 0
       left 0
       right 0
       bottom 0
       background url('/static/img/tc_practice_time.png') no-repeat
       background-size cover
    .backtip-info
      text-align center
      padding 20px 30px 40px
    .backtip-continuebtn
      display block
      width 190px
      height 44px
      margin 0 auto 19px
      font-size $font-size-medium-x
      line-height 44px
      text-align center
      background-color $color-main
      color #fff
      border-radius 20px
      cursor pointer
    .backtip-leavebtn
      display block
      width 190px
      height 44px
      margin 0 auto
      font-size $font-size-medium-x
      color $color-default
      line-height 44px
      text-align center
      border 1px solid $color-border-default
      border-radius 20px
      cursor pointer
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .header-examinfo
    display flex
    .answercard
      flex 1
  .answer-sheetpopup
    position fixed
    display none
    top 50px
    bottom 0
    left 0
    right 0
    background-color rgba(0,0,0,.8)
    z-index 20
    &.popup_shown
      display block
  .submitcard-paper
    display block
    height 50px
    font-size $font-size-medium-x
    line-height 50px
    color $color-main
    border-top 1px solid $color-border-default
    text-align center
    background-color #fff
    cursor pointer
  .wrapios .answer-sheetpopup
    top 70px
</style>