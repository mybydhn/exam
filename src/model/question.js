export default class Question {
  constructor ({
    questionid,
    title,
    type,
    score,
    blackOrder,
    link,
    item,
    subQuestionModels,
    partname,
    isanswer,
    qorder,
    qswiperIndex,
    partIndex,
    p4qindex,
    userAnswer,
    grade,
    correctAnswer,
    correctReplay
  }) {
    this.questionid = questionid
    this.title = title
    this.type = type
    this.score = score
    this.blankOrder = blackOrder
    this.link = link
    this.choiceitemModels = item
    this.subQuestionModels = subQuestionModels
    this.stuAnswer = userAnswer
    this.partname = partname
    this.qorder = qorder
    this.qswiperIndex = qswiperIndex
    this.correctAnswer = correctAnswer
    this.correctReplay = correctReplay
    this.grade = grade
    this.isorderAnswer = ''
    this.partIndex = partIndex // 部分的顺序
    this.p4qindex = p4qindex // 部分题的顺序
    this.setStuAnswer(userAnswer)
  }
  setStuAnswer (stuAnswer) {
    this.stuAnswer = stuAnswer
    if (Array.isArray(stuAnswer)) {
      let stuansstr = stuAnswer.join(';')
      if (stuansstr) {
        this.isanswer = true
      } else {
        this.isanswer = false
      }
    } else if (stuAnswer) {
      this.isanswer = true
    } else {
      this.isanswer = false
    }
  }
  setCorrectAnswer (correctAnswer) {
    this.correctAnswer = correctAnswer
  }
  setIsRightAnswer (isright) {
    this.isorderAnswer = isright
  }
}
