import Vue from 'vue'
import Router from 'vue-router'
import List from 'components/list/list.vue'
import Detail from 'components/detail/detail.vue'
import Report from 'components/detail/report.vue'
import Examination from 'components/exam/examination.vue'
import ExamReport from 'components/exam/examreport.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/index',
    component: List
  }, {
    path: '/detail/:userid/:examid',
    component: Detail,
    meta: {
      title: '详情'
    }
  }, {
    path: '/report/:userid/:examid',
    component: Report,
    meta: {
      title: '详情'
    }
  }, {
    path: '/askAnswer/:userid/:examid',
    component: Examination,
    meta: {
      title: '答题'
    }
  }, {
    path: '/examreport/:userid/:examID/:paperID/:examUserID',
    component: ExamReport,
    meta: {
      title: '答题'
    }
  }, {
    path: '/',
    redirect: '/index'
  }]
})
