export default class Paper {
  constructor ({
    paperID,
    score,
    time,
    title,
    part
  }) {
    this.paperID = paperID
    this.score = score
    this.time = time
    this.title = title
    this.part = part
    this.stuAnswerRecords = {}
    this.partTotlalNum = 0
    this.partQuestionList = []
  }
  setPartQueNum () {
    let part = this.part
    if (Array.isArray(part) && part.length > 0) {
      let qnum = 1
      let qswiperIndex = 0
      part.map((item, index) => {
        qswiperIndex++
        item['parttype'] = 1
        item['partindex'] = index - 0 + 1
        item.children.map((qitem, qindex) => {
          qitem['qswiperIndex'] = qswiperIndex
          qitem['qorder'] = qnum
          qitem['partname'] = item.partname
          qitem['parttype'] = 0
          qitem['isorderAnswer'] = ''
          qitem['partIndex'] = index
          qitem['p4qindex'] = qindex
          qnum++
          qswiperIndex++
        })
      })
      this.partTotlalNum = qnum - 1
    }
  }
  setStuAnswer (data) {
    let stuAnswerRecords = {}
    if (Array.isArray(data) && data.length > 0) {
      data.map((item) => {
        stuAnswerRecords[item.ID] = item.answer
      })
    }
    this.stuAnswerRecords = stuAnswerRecords
  }
  setReportUserAnswer (data) {
    let part = this.part
    let stuAnswerRecords = {}
    if (Array.isArray(data) && data.length > 0) {
      data.map((item) => {
        stuAnswerRecords[item.questionID] = item
      })
    }
    if (Array.isArray(part) && part.length > 0) {
      part.map((item) => {
        item.children.map((qitem) => {
          let questionid = qitem.questionid
          if (stuAnswerRecords[questionid]) {
            qitem['userAnswer'] = stuAnswerRecords[questionid].answer
          }
        })
      })
      this.part = Object.assign([], part)
    }
  }
  setPartQuesisAnswer () {
    let part = this.part
    let stuAnswerRecords = this.stuAnswerRecords
    if (Array.isArray(part) && part.length > 0) {
      part.map((item) => {
        item.children.map((qitem) => {
          let questionid = qitem.questionid
          let stuAnswer = stuAnswerRecords[questionid]
          qitem['userAnswer'] = stuAnswer
        })
      })
    }
  }
  setPaperQuestionAnswer (paperAnswer) {
    let part = this.part
    if (Array.isArray(part) && part.length > 0) {
      part.map((item) => {
        item.children.map((qitem) => {
          let questionid = qitem.questionid
          if (paperAnswer[questionid]) {
            qitem['correctAnswer'] = paperAnswer[questionid].correctAnswer
            qitem['correctReplay'] = paperAnswer[questionid].correctReplay
          }
        })
      })
      this.part = Object.assign([], part)
    }
  }
  setPartsQUestions () {
    let part = this.part
    let partQuestion = []
    let partlen = 0
    if (Array.isArray(part) && part.length > 0) {
      partlen = part.length
      part.map((item) => {
        partQuestion.push(item)
        partQuestion = partQuestion.concat(item.children)
      })
    }
    this.partTotlalNum = partQuestion.length - 0 - partlen
    this.partQuestionList = Object.assign([], partQuestion)
  }
  getPartsQUestions () {
    return this.partQuestionList
  }
  getTotalNum () {
    return this.partTotlalNum
  }
}
