<template>
  <div v-if="isDis">
    <m-header>
      <div slot="headermain" class="header-examinfo">
         <answer-sheet-num :totalNum="totalNum" :curNum="curNum" class="answercard" @showAnswerCard="showAnswerCard" ref="answersheet"></answer-sheet-num>
      </div>
    </m-header>
    <parts  @getCurNums="getCurNums" ref="slide" :type="type"></parts>
    <div class="answer-sheetpopup" :class="{popup_shown:isShowAnswerCard}" v-if="isShowAnswerCard" @click="answersheetShrink">
      <answer-order></answer-order>
    </div>
  </div>
  <loading v-else></loading>
</template>
<script>
  import MHeader from 'components/mheader'
  import AnswerSheetNum from 'components/answersheet/answersheetNum'
  import AnswerOrder from 'components/answersheet/answerorder'
  import CubeExtendPopup from 'components/popup/cubeExtendPopup'
  import Parts from 'components/parts/parts'
  import Paper from '@/model/paper'
  import {getPaper, getMyRecord, getPaperAnswer} from 'api/exam.js'
  import Bus from '@/common/js/bus'
  import Loading from 'components/loading/loading'
  import {mapActions} from 'vuex'
  export default {
    data () {
      return {
        totalNum: 0,
        curNum: 0,
        autoSavedKey: '',
        paperTestInfo: {},
        stuAnswerRecord: {},
        isShowAnswerCard: false,
        userid: this.$route.params.userid,
        examID: this.$route.params.examID,
        paperID: this.$route.params.paperID,
        examUserID: this.$route.params.examUserID,
        type: this.$route.query.type - 0,
        isDis: false
      }
    },
    created () {
      let _this = this
      getPaper(_this.paperID, function (paperdata) {
        _this.handlePaperQa(paperdata)
      }, function () {

      })
    },
    mounted () {
      const _this = this
      Bus.$on('turnQaNum', (qorder, qswiperIndex, islast) => {
        _this.turnQaNum(qorder, qswiperIndex, islast)
      })
      Bus.$on('renderanswer', (val) => {
        let info = Object.assign({}, _this.paperTestInfo)
        info.part[val.partIndex].children[val.p4qindex].isanswer = val.isanswer
        info.part[val.partIndex].children[val.p4qindex].isorderAnswer = val.isorderAnswer
        _this.modifyPaperQuesInfo(info)
      })
    },
    destroyed () {
      Bus.$off('turnQaNum')
    },
    methods: {
      getCurNums (num) {
        this.curNum = num
      },
      handlePaperQa (paperdata) {
        let _this = this
        this.paperTestInfo = new Paper(paperdata)
        this.paperTestInfo.setPartQueNum()
        _this.paperTestInfo.setPartsQUestions()
        this.totalNum = this.paperTestInfo.getTotalNum()
        // 获取学生的答题记录
        getMyRecord(this.examUserID, function (data) {
          _this.handlePaperstuAnswer(data)
          if (_this.type === 4) {
            _this.changeData()
            _this.isDis = true
          }
        }, function () {

        })
        if (_this.type === 2) {
          getPaperAnswer(_this.paperID, function (paperAnswer) {
            _this.paperTestInfo.setPaperQuestionAnswer(paperAnswer)
            _this.changeData()
            _this.isDis = true
          }, function () {

          })
        }
      },
      changeData () {
        let info = Object.assign({}, this.paperTestInfo)
        console.log('_this.paperTestInfo-------------', info)
        this.modifyPaperQuesInfo(info)
      },
      handlePaperstuAnswer (data) {
        let tabAnswer = data.answerJson
        this.paperTestInfo.setReportUserAnswer(tabAnswer)
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
      answersheetShrink () {
        this.isShowAnswerCard = false
      },
      ...mapActions([
        'modifyPaperQuesInfo'
      ])
    },
    components: {
      MHeader,
      AnswerSheetNum,
      AnswerOrder,
      CubeExtendPopup,
      Parts,
      Loading
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
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
  .wrapios .answer-sheetpopup
    top 70px
</style>