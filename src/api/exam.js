import {
  fetchData
} from 'api/examapi'
// let url = 'http://111.231.133.247:8087'
let url = 'https://apps.tongshike.cn'
if (window.location.href.indexOf('.ulearning.cn') !== -1) {
  url = 'https://apps.ulearning.cn'
}
let fetchTool = fetchData()

export function getExamList (userid, intPage, success, failure) {
  try {
    fetchTool.get(`${url}/exam/getExamList?userID=${userid}&intPage=${intPage}`).then(function (res) {
      success && success(res)
    }, function (e) {
      failure && failure(e)
    })
  } catch (e) {
    console.log(e)
  }
}
export function getExamInfo (userid, examID, success, failure) {
  fetchTool.get(`${url}/exam/getExamInfo?userID=${userid}&examID=${examID}`).then(function (res) {
    success && success(res)
  }, function (e) {
    failure && failure(e)
  })
}
export function startExam (userid, examID, success, failure) {
  fetchTool.get(`${url}/exam/startExam?userID=${userid}&examID=${examID}`).then(function (res) {
    success && success(res)
  }, function (e) {
    failure && failure(e)
  })
}
export function getPaper (paperID, success, failure) {
  fetchTool.get(`${url}/exam/getPaper?paperID=${paperID}`).then(function (res) {
    success && success(res)
  }, function (e) {
    failure && failure(e)
  })
}
export function getPaperAnswer (paperID, success, failure) {
  fetchTool.get(`${url}/exam/getPaperAnswer?paperID=${paperID}`).then(function (res) {
    success && success(res)
  }, function (e) {
    failure && failure(e)
  })
}
export function getTheLastAnswer (autoSavedKey, success, failure) {
  fetchTool.get(`${url}/exam/getTheLastAnswer?autoSavedKey=${autoSavedKey}`).then(function (res) {
    success && success(res)
  }, function (e) {
    failure && failure(e)
  })
}
export function getExamReport (userid, examID, success, failure) {
  // report.json
  fetchTool.get(`${url}/exam/getExamReport?userID=${userid}&examID=${examID}`).then(function (res) {
    success && success(res)
  }, function (e) {
    failure && failure(e)
  })
}
export function getMyRecord (examUserID, success, failure) {
  fetchTool.get(`${url}/exam/getMyRecord?examUserID=${examUserID}`).then(function (res) {
    success && success(res)
  }, function (e) {
    failure && failure(e)
  })
}
export function savePaperAnswerToMemcache (data, success, failure) {
  fetchTool.post(`${url}/exam/savePaperAnswerToMemcache`, data).then(function (res) {
    success && success(res)
  }, function (e) {
    failure && failure(e)
  })
}
export function savePaperAnswer (data, success, failure) {
  fetchTool.post(`${url}/exam/savePaperAnswer`, data).then(function (res) {
    success && success(res)
  }, function (e) {
    failure && failure(e)
  })
}
export function repayExam (examUserID, success, failure) {
  fetchTool.get(`${url}/exam/repayExam?examUserID=${examUserID}`).then(function (res) {
    success && success(res)
  }, function (e) {
    failure && failure(e)
  })
}
