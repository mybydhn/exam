<template>
  <cube-page type="scroll-view" title="手机考试" class="u-page">
    <template slot="content">
      <div class="content-scroll-wrapper">
        <div class="content-scroll-list-wrap">
          <cube-scroll
            ref="scroll"
            :data="examList"
            :options="options"
            @pulling-down="onPullingDown"
            @pulling-up="onPullingUp" class="examlist-scollwrap">
              <div class="list-zone" :class="{'list-loading-zone':examloading}">
                <ul class="list-wrap" v-if="!examloading && examList.length>0">
                  <li @click="handleExam(item)" v-for="item in examList">
                      <span class="device" v-if="item.examType ===2"><i class="iconfont">&#xe904;</i>手机考试</span>
                      <span class="device device-pc" v-else-if="item.examType ===1"><i class="iconfont">&#xe976;</i>电脑考试</span>
                      <span class="device" v-else><i class="iconfont">&#xe976;</i>手机/电脑</span>
                      <div class="title-zone">
                        <p class="title">
                         <span class="status status-going" v-if="item.status ===2 ||item.status ===5">进行中</span>
                         <span class="status status-start" v-if="item.status ===1">未开始</span>
                         <span class="status status-end" v-if="item.status ===3||item.status ===4">已结束</span>
                         {{ item.title }}
                       </p>
                      </div>
                      <div class="info">
                        <div class="time">
                          <p v-for="relation in item.relationArr">
                            <i class="iconfont">&#xe7ef;</i>{{relation.startDate|formatDate}} 至 {{relation.endDate|formatEndDate}}
                          </p>
                        </div>
                        <div class="remark">
                          {{item.grade}}
                          <span class="status status-going" v-if="item.status ===4">缺考</span>
                        </div>
                      </div>
                      
                  </li>
                </ul>
                <p class="empty-exam" v-if="!examloading && examList.length <= 0">教师还没有发布考试</p>
            </div>
          </cube-scroll>
        </div>
      </div>
    </template>
  </cube-page>
</template>
<script>
  import {getExamList, repayExam} from 'api/exam.js'
  import {formatDate} from '@/common/js/date'
  import BackEvent from '@/common/js/UBackEvent'
  import * as app from '@/common/js/mobilePlugin'
  import CubePage from 'components/cube-page'
  export default {
    data () {
      return {
        examloading: true,
        examList: [],
        userid: this.$route.query.userid,
        pagenum: 1,
        pullupFlag: true,
        options: {
          pullDownRefresh: {
            threshold: 90,
            stop: 40,
            txt: '刷新成功'
          },
          pullUpLoad: true
        }
      }
    },
    created () {
      const _this = this
      BackEvent.addBackEvent(this.$route, function () {
        app.exitApp()
      })
      _this.getExamItems()
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      formatEndDate (time) {
        let date = new Date(time)
        return formatDate(date, 'MM-dd hh:mm')
      }
    },
    components: {
      CubePage
    },
    methods: {
      getExamItems () {
        const _this = this
        getExamList(_this.userid, _this.pagenum, function (data) {
          _this.examloading = false
          if (_this.pagenum === 1) {
            _this.examList = data.examArr || []
          } else {
            _this.examList = _this.examList.concat(data.examArr || [])
          }
          if (Array.isArray(data.examArr) && data.examArr.length >= 10) {
            _this.pagenum++
          } else {
            _this.pullupFlag = false
          }
        }, function () {
          _this.examloading = false
          const toast = _this.$createToast({
            time: 200,
            mask: true,
            txt: '哎呦，出错了'
          })
          toast.show()
        })
      },
      onPullingDown () {
      // Mock async load.
        this.pagenum = 1
        this.pullupFlag = true
        this.getExamItems()
      },
      onPullingUp () {
        if (!this.pullupFlag) {
          this.$refs.scroll.forceUpdate()
          return false
        }
        this.getExamItems()
      },
      resubmitAnswer (data) {
        repayExam(data.examUserID, function (response) {
          if (response.status === 1) {
            // 成功
          } else if (response.status === 2) {
            // 没有答题记录
          } else if (response.status === 0) {
            // 评分失败
          }
          data.hasRecord = false
        }, function (error) {
          const toast = this.$createToast({
            time: 200,
            mask: true,
            txt: '交卷失败' + error
          })
          toast.show()
        })
      },
      handleExam (item) {
        const _this = this
        if (item.examType === 1) {
          this.$createDialog({
            type: 'alert',
            maskClosable: true,
            content: '<p class="exam-pctip">请在电脑上考试和查看考试成绩</p>'
          }).show()
        } else if (item.hasRecord) {
          if (item.status === 3 || item.status === 1) {
            this.$createDialog({
              type: 'alert',
              maskClosable: true,
              content: '<p class="exam-recordtip">检测到您有未提交的考试，目前考试已经结束，请提交考试记录。</p>',
              confirmBtn: {
                text: '交卷'
              },
              onConfirm: () => {
                // 交卷
                _this.resubmitAnswer(item)
              }
            }).show()
          } else if (item.status === 2) {
            this.$createDialog({
              type: 'alert',
              maskClosable: true,
              content: '<p class="exam-recordtip">检测到您有未提交的考试，您可以继续参加考试并交卷。</p>',
              confirmBtn: {
                text: '进入考试'
              },
              onConfirm: () => {
                // 交卷
                _this.$router.push({path: `/detail/${_this.userid}/${item.examID}`})
              }
            }).show()
          }
        } else if (item.status === 3 || item.status === 5) {
          this.$router.push({path: `/report/${_this.userid}/${item.examID}`})
        } else if (item.status === 4) {
          this.$router.push({path: `/report/${_this.userid}/${item.examID}`})
        } else {
          this.$router.push({path: `/detail/${_this.userid}/${item.examID}`})
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cube-dialog-btn_highlight
    color #444!important
  .cube-dialog-main
    border-radius 5px
    .exam-pctip
      padding 30px 10px
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .content-scroll-wrapper
    flex: 1
    position: relative
    .content-scroll-list-wrap
      height: 100%
      transform: rotate(0deg) 
      position: absolute
      top: 0
      bottom: 0
      overflow: hidden
  .examlist-scollwrap
    background url('/static/img/list_pic.png') no-repeat center bottom
    background-size contain
  .list-zone
    .empty-exam
      position absolute
      top 50%
      left 50%
      transform translate(-50%,-50%)
      font-size $font-size-medium
      color $color-default
  .list-loading-zone
    position absolute
    width 120px
    height 120px
    top 50%
    left 50%
    margin-top -60px
    margin-left -60px
    background url('/static/img/loading.gif')
    background-size contain
  .list-wrap
    padding 20px 20px 55px 20px
    li
      position relative
      margin-bottom 8px
      padding 20px 16px 10px
      background-color #fff
      border-radius 8px
      cursor pointer
      &:last-child
        margin-bottom 0
      .title-zone
        padding-bottom 10px
        border-bottom 2px dashed $color-border-default
      .title
        font-size $font-size-medium-x
        line-height 1.375
        word-wrap break-word
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        .status
          display inline-block
          height 18px
          padding 0 2px
          margin-right 8px
          font-size 12px
          border-radius 2px
          line-height 18px
          background-color #fff
          &.status-going
            background-color #ff0000
            color #fff
          &.status-start
            background-color #ffcc00
            color #fff
          &.status-end
            border 1px solid $color-border-default
            color $color-intro
      .device
         display block
         position absolute
         right 0
         top 0
         width 80px
         height 16px
         background-color #fe6d9f
         border-bottom-left-radius 8px
         border-top-right-radius 4px
         font-size 12px
         line-height 16px
         color #fff
         text-align center
         &.device-pc
            background-color #e4e4f4
         i
          margin-right 6px
          font-size 12px
      .info
        display flex
        align-items center
        padding-top 10px
        .time
           flex 1
           p
            font-size $font-size-small
            color $color-intro
            margin-bottom 4px
            &:last-child
              margin-bottom 0
           .iconfont
              margin-right 4px
              font-size 12px
              color #e4e4f4
        .remark
          font-size $font-size-medium
          color $color-intro
</style>