<template>
  <cube-page type="scroll-view" :title="examInfo.title" class="u-page">
    <template slot="content">
      <div class="content-scroll-wrapper">
        <div class="content-scroll-list-wrap">
          <cube-scroll
            ref="scroll">
              <div v-if="examInfo.examID">
             <div class="detail-wrap">
               <div class="start-bg"></div>
               <detail-part :examInfo="examInfo"></detail-part>
               <span class="startExam-btn" @click="startInfo()" :class="{enable: examInfo.status === 0}">开始考试</span>
             </div>
          </div>
          </cube-scroll>
          <cube-extend-popup ref="requestextendPopup" :center=true>
              <instructions :examid="examInfo.examID" :userid="userid"></instructions>
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
  import {getExamInfo} from 'api/exam.js'
  import CubeExtendPopup from 'components/popup/cubeExtendPopup'
  export default {
    data () {
      return {
        examInfo: {},
        examID: this.$route.params.examid,
        userid: this.$route.params.userid
      }
    },
    created () {
      const _this = this
      getExamInfo(_this.userid, _this.examID, function (data) {
        _this.examInfo = data
      }, function () {

      })
    },
    methods: {
      startExam () {
        this.$refs.requestextendPopup.show()
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
          let message = `你已迟到超过${_this.examInfo.lateTime}分钟，无法参加考试`
          if (currentState === 3) {
            message = '当前时间不能参加考试'
          }
          _this.startToast(message)
        } else if (status === 2) {
          _this.startToast('超过限制次数')
        }
      },
      startToast (message) {
        const toast = this.$createToast({
          type: '',
          time: 2000,
          txt: message
        })
        toast.$el.getElementsByClassName('cube-toast-icon')[0].style.display = 'none'
        toast.show()
      }
    },
    components: {
      CubePage,
      Instructions,
      CubeExtendPopup,
      DetailPart
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .detail-wrap
    bgwrap()
    padding 0 16px
    .start-bg
      width 265px
      height 160px
      margin 0 auto
      background url('/static/img/info_start_bj.png')
      background-size contain
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