// 注册返回事件
class UBackEvent {
  constructor () {
    this.events = {}
  }

  addBackEvent (route, hand = function () {}) {
    if (!this._checkInput(route)) return false
    let self = this
    route.matched.forEach((item) => {
      let key = self._formatPath(item.path)
      self.events[key] = hand
    })
  }

  removeBackEvent (route) {
    if (!this._checkInput(route)) return false
    let self = this
    route.matched.forEach((item) => {
      let key = self._formatPath(item.path)
      if (self.events[key]) {
        delete self.events[item.path]
      }
    })
  }

  isBindBackEvent (route) {
    if (!this._checkInput(route)) return false
    let isMathch = false
    let self = this
    route.matched.forEach((item) => {
      let key = self._formatPath(item.path)
      if (self.events[key]) {
        isMathch = true
      }
    })
    return isMathch
  }

  _checkInput (route) {
    if (!route || !route.matched) {
      return false
    }
    return true
  }

  _formatPath (path) {
    return path.replace(':', '').replace('/', '')
  }

  handBackEvent (route) {
    if (!this._checkInput(route)) return false
    let self = this
    route.matched.forEach((item) => {
      let key = self._formatPath(item.path)
      console.log(key)
      if (self.events[key]) {
        self.events[key]()
      }
    })
  }
}

export default new UBackEvent()
