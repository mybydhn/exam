<template>
  <div class="detail-main">
    <p class="title">考试时间</p>
    <p v-for="relation in examInfo.relationArr" class="time">
      <i class="iconfont">&#xe942;</i>{{relation.startDate|formatDate}} 至 {{relation.endDate|formatEndDate}}
    </p>
    <ul class="items">
      <li><i class="iconfont">&#xe833;</i><p>及格分{{examInfo.passScore}}</p></li>
      <li><i class="iconfont">&#xe85d;</i><p>{{examInfo.examTime}}分钟</p></li>
      <li v-if="examInfo.isLimitTimes==='0' && !examInfo.joinNum"><i class="iconfont">&#xe89f;</i><p>不限次数</p></li>
      <li v-else-if="examInfo.isLimitTimes==='1'&& !examInfo.joinNum"><i class="iconfont">&#xe89f;</i><p>可考{{examInfo.limitTimes}}次</p></li>
      <li v-else-if="examInfo.isLimitTimes==='0' && examInfo.joinNum>0"><i class="iconfont">&#xe89f;</i><p>已考{{examInfo.joinNum}}/N次</p></li>
      <li v-else-if="examInfo.isLimitTimes==='1' && examInfo.joinNum>0"><i class="iconfont">&#xe89f;</i><p>已考{{examInfo.joinNum}}/{{examInfo.limitTimes}}次</p></li>
      <li v-if="examInfo.isLate ==='0'"><i class="iconfont">&#xe977;</i><p>不限制</p></li>
      <li v-else-if="examInfo.isLate ==='1'"><i class="iconfont">&#xe977;</i><p>&lt;{{examInfo.lateTime}}分钟</p></li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  import {formatDate} from '@/common/js/date'
  export default {
    props: {
      examInfo: {}
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
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../stylus/variable.styl"
  .detail-main
    padding 20px 16px 40px
    margin-bottom 16px
    border-radius 4px
    background-color #fff
    .title
       margin-bottom 10px
       text-align center
       font-size $font-size-medium-x
       color $color-default
    .time
      margin-bottom 10px
      font-size $font-size-medium-x
      color $color-default
      &:last-child
        margin-bottom 30px
      i
        margin-right 4px
        color $color-intro
    .items
      display flex
      margin-top 30px
      li
        flex 1
        text-align center
        border-right 1px solid $color-border-default
        &:last-child
          border-right none
        i
         font-size 25px
         color $color-main
        p
         margin-top 8px
         font-size $font-size-small
         color $color-default
</style>