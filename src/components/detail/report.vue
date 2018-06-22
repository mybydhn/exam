<template>
  <cube-page type="scroll-view" :title="examInfo.title" class="u-page">
    <template slot="content">
      <div class="content-scroll-wrapper">
        <div class="content-scroll-list-wrap">
          <cube-scroll
            ref="scroll"  v-if="examInfo.examID">
               <div class="detail-wrap">
                 <div class="start-bg" :class="{'absent-bg':showExamType ===8}"></div>
                 <div class="record-zone record-completezone" v-if="showExamType ===7 || showExamType===3">
                   <div class="recordmain-zone">
                      <div class="userinfo-wrap"><div class="userinfo-zone"><div class="avator"><img :src="userinfo.avator|formatPath">
                       </div>
                       <div class="main-info"><span class="name">{{userinfo.name}}</span></div></div></div>
                       <span class="score">{{examInfo.score}}<em>分</em></span>
                     </div>
                     <div class="record-btnzone">
                        <p class="record-noanswertip">本次考试不显示答题记录</p>
                    </div>
                 </div>
                 <div class="record-zone record-lateZone" v-else-if="showExamType ===6">
                   <p class="info-tip">恭喜完成本次考试</p>
                   <p class="info-time">{{examInfo.showTime}}公布考试成绩</p>
                 </div>
                 <div class="record-zone record-lateZone" v-else-if="showExamType ===5">
                   <p class="info-tip">恭喜完成本次考试</p>
                   <p class="info-time">本次考试不公布考试成绩</p>
                 </div>
                 <div class="record-zone record-lateZone" v-else-if="showExamType ===8">
                   <p class="info-tip">考试已结束</p>
                   <p class="info-time">你未参与本次考试,没有考试成绩</p>
                 </div>
                 <div class="record-zone record-completezone" v-else>
                   <div class="recordmain-zone">
                       <div class="userinfo-wrap"><div class="userinfo-zone"><div class="avator"><img :src="userinfo.avator|formatPath">
                       </div>
                       <div class="main-info"><span class="name">{{userinfo.name}}</span></div></div></div>
                       <span class="score">{{examInfo.score}}<em>分</em></span>
                     </div>
                     <div class="record-btnzone">
                        <p class="record-btn" @click="getRecord()">答题记录<span v-if="examInfo.recordArr.length>1"><em>|</em>{{examInfo.recordArr.length}}</span></p>
                    </div>
                 </div>
                 <detail-part :examInfo="examInfo"></detail-part>
                 <span v-if="showExamType!== 8" class="startExam-btn" @click="startInfo()" :class="{enable: examInfo.status === 0}">重考</span>
               </div>
          </cube-scroll>
          <cube-extend-popup ref="extendPopup" :center=false>
            <div class="answerrecord-itemszone">
              <p class="answerrecord-title">答题记录</p>
               <div v-for="(recordItem,index) in examInfo.recordArr" @click="getRecordMutli(recordItem.paperID,recordItem.examUserID)" class="answerrecord-item">
                {{recordItem.endtime}}
                <span v-if="recordItem.isHigh" class="high">最高分</span>
                <span class="info">{{recordItem.score}}分<i class="iconfont">&#xe90b;</i></span>
              </div>
            </div>
          </cube-extend-popup>
          <cube-extend-popup ref="requestextendPopup" :center=true>
            <instructions :examid="examInfo.examID" :userid="userID"></instructions>
          </cube-extend-popup>
        </div>
      </div>
    </template>
  </cube-page>
</template>
<script>
  import CubePage from 'components/cube-page'
  import DetailPart from 'components/detail/detailpart'
  import Instructions from 'components/detail/instructions'
  import {getExamReport} from 'api/exam.js'
  import CubeExtendPopup from 'components/popup/cubeExtendPopup'
  import { getUser } from '@/common/js/mobilePlugin'
  import { commonParams } from '@/config/config'
  export default {
    data () {
      return {
        examInfo: {},
        userID: this.$route.params.userid,
        examID: this.$route.params.examid,
        status: this.$route.query.status - 0,
        userinfo: {name: '', avator: '', sex: 0},
        showExamType: -1
      }
    },
    created () {
      const _this = this
      _this.setUserInfo()
      getExamReport(this.userID, _this.examID, function (data) {
        _this.examInfo = data
        // 只显示 成绩、
        let showExamRecord = data.showExamRecord
        let examFinshType = data.examFinish
        if (data.status === 3 && data.recordArr.length <= 0) {
          _this.showExamType = 8 // 已结束,缺考
          return false
        }
        if (showExamRecord === 1) {
          if (examFinshType.indexOf('3') >= 0 && examFinshType.indexOf('2') >= 0) {
            _this.showExamType = 2 // 成绩、记录、正确答案
          } else if (examFinshType.indexOf('3') >= 0) {
            _this.showExamType = 3  // 成绩、正确答案
          } else if (examFinshType.indexOf('2') >= 0) {
            _this.showExamType = 4  // 成绩、记录
          } else {
            _this.showExamType = 7
          }
        } else if (showExamRecord === 3) {
          if (data.showTime) {
            _this.showExamType = 6 // 几天后公布
          } else {
            _this.showExamType = 5  // 不公布
          }
        }
      }, function () {

      })
    },
    filters: {
      formatPath (path) {
        if (path === undefined) {
          return ''
        }
        var httpReg = /^(http|https)/
        if (!httpReg.test(path)) {
          return commonParams.QINIU_RESOURCE_URL + path
        } else {
          return path
        }
      }
    },
    methods: {
      setUserInfo () {
        const _this = this
        getUser(function (user) {
          let avator = user.avatar
          let name = user.name
          let sex = user.sex
          if (!avator) {
            if (sex) {
              avator = 'resource/123/123/208f765e-a992-4e93-ab55-29de6a88fede.png'
            } else {
              avator = 'resource/123/123/146d03d4-787e-4587-a4d0-8f56f67a4eb9.png'
            }
          }
          _this.userinfo = {name: name, avator: avator, sex: sex}
        })
      },
      startInfo () {
        const _this = this
        let status = _this.examInfo.status
        let currentState = _this.examInfo.currentState
        if (status === 0) {
          _this.startExam()
        } else if (status === 3 || status === 1) {
          _this.startToast('当前时间不能参加考试')
        } else if (status === 4) {
          let message = `你已迟到超过${_this.examInfo.lateTime} 分钟，无法参加考试`
          if (currentState === 3) {
            message = '当前时间不能参加考试'
          }
          _this.startToast(message)
        } else if (status === 2) {
          _this.startToast('超过限制次数')
        }
      },
      startExam () {
        this.$refs.requestextendPopup.show()
      },
      startToast (message) {
        const toast = this.$createToast({
          type: '',
          time: 2000,
          txt: message
        })
        toast.$el.getElementsByClassName('cube-toast-icon')[0].style.display = 'none'
        toast.show()
      },
      getRecord (index) {
        let recordArr = this.examInfo.recordArr
        if (recordArr.length === 1) {
          this.getRecordAnswer(recordArr[0].paperID, recordArr[0].examUserID)
        } else {
          this.$refs.extendPopup.show()
        }
      },
      getRecordMutli (paperID, examUserID) {
        this.getRecordAnswer(paperID, examUserID)
      },
      getRecordAnswer (paperID, examUserID) {
        this.$router.push({path: `/examreport/${this.userID}/${this.examID}/${paperID}/${examUserID}`, query: {type: this.showExamType}})
      }
    },
    components: {
      CubePage,
      DetailPart,
      Instructions,
      CubeExtendPopup
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../stylus/variable.styl"
  .answerrecord-itemszone
    max-height 70%
    overflow auto
    background-color #fff
  .answerrecord-title
    height 44px
    font-size $font-size-medium
    line-height 44px
    color $color-default
    text-align center
  .answerrecord-item
    height 60px
    padding 0 16px
    line-height 60px
    font-size $font-size-medium
    color $color-default
    overflow hidden
    cursor pointer
    border-top 1px solid $color-border-default
    .high
      padding 2px
      font-size $font-size-small
      color #fff
      background-color $color-main
      border-radius 2px
      margin-left 6px
    .info
      float right
      color $color-main
      font-size $font-size-medium
      i
       margin-left 8px
       color $color-intro
       font-size $font-size-medium
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .detail-wrap
    bgwrap()
    padding 0 16px 30px
    .record-zone
      background url('/static/img/score_bj.png')
      margin-bottom 20px
      background-size cover
      border-radius 4px
      &.record-completezone
        padding-top 30px
      .recordmain-zone
        display flex
        padding:0 30px 30px
        .userinfo-wrap
          flex 1
        .userinfo-zone
          display table
          .main-info
            display table-cell
            width 100%
            vertical-align middle
            .name
              font-size $font-size-medium
              color #fff
        .score
          float right
          font-size 45px
          color #fff
          em
            font-style normal
            font-size $font-size-medium
      &.record-lateZone
         padding 30px 0
         color #fff
         text-align center
         .info-tip
           margin-bottom 8px
           font-size $font-size-large-m
         .info-time
           font-size $font-size-medium
        .record-btnzone
          border-top 2px dashed #feafb8
          margin 0 16px
          padding 20px 0
          font-size 0
          .record-btn
            width 130px
            height 50px
            margin 0 auto
            font-size $font-size-medium-x
            line-height 50px
            text-align center
            background-color #fff
            border-radius 25px
            color $color-main
            cursor pointer
            em
             margin 0 4px
             font-style normal
             color $color-border-default
          .record-noanswertip
             font-size $font-size-medium
             color #fff
             text-align center
      .avator
        float left
        height 60px
        width 60px
        margin-right 16px
        overflow hidden
        border-radius 50%
        background-color #fff
        img
          width 100%
          min-height 60px
          height auto
    .start-bg
      width 265px
      height 160px
      margin 0 auto
      background url('/static/img/info_finish.png')
      background-size contain
    .absent-bg
      background-image url('/static/img/info_quekao.png')
    .startExam-btn
      display block 
      height 60px
      font-size $font-size-medium-x
      line-height 60px
      text-align center
      border-radius 4px
      background-color #fff
      color #ccc
      &.enable
        cursor pointer
        background-color $color-main
        color #fff
</style>