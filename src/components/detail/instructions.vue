<template>
  <div class="exam-request-wrap">
    <p class="exam-request-title">考试须知</p>
    <div class="exam-request-main">
      <p><em>1.</em>考试过程中请不要退出应用或离开考试，每次离开都会被记录。</p>
      <p><em>2.</em>如果考试允许重考，你的成绩将会以得分最高的一次为准。</p>
      <p><em>3.</em>考试开始后，考生需认真答题，请勿在未作答的情况下直接点击“提交答卷”。</p>
      <p><em>4.</em>试卷可能分为多个部分，请认真检查试卷，提交试卷前检查一下答题卡，以免漏题。</p>
      <p><em>5.</em>试卷顶部会显示交卷的剩余时间，当剩余时间为0时，系统将自动提交答卷。</p>
    </div>
    <div class="exam-request-btns">
      <span class="exam-requestbtn cancel-btn">取消</span>
      <router-link :to="'/askAnswer/'+userid+'/'+examid" class="exam-requestbtn exam-btn">立即考试</router-link>
    </div>
  </div>
</template>
</template>
<script type="text/ecmascript-6">
  export default {
    props: ['userid', 'examid']
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../stylus/variable.styl"
  .exam-request-wrap
    background-color #fff
    padding 0 16px 30px
    border-radius 4px
  .exam-request-title
    height 50px
    font-size $font-size-medium-x
    line-height 50px
    color $color-default
    font-weight bold
    text-align center
  .exam-request-main
    padding 16px 0
    border-top-1px($color-border-default)
    p
     margin-bottom 4px
     font-size $font-size-medium
     line-height 1.4285
     color $color-default
     &:first-child
       color #ff0000
    em
     font-style normal
     color $color-main
  .exam-request-btns
    display flex
    margin-top 20px
    .exam-requestbtn
      flex 1
      height 50px
      font-size 16px
      line-height 50px
      text-align center
      color #444
      border-radius 50px
      cursor pointer
    .cancel-btn
      margin-right 10px
      border 1px solid #e3e3e9
      background-color #fff
    .exam-btn
      background-color #ea5947
      border 1px solid #ea5947
      color #fff
</style>