// 获取外部的数据
import axios from 'axios'
/* axios.defaults.withCredentials = true
let cookieJSON = {
  'Cookie': 'lms_user_org=5333'
} */
export function fetchData () {
  return {
    get: function (url) {
      return new Promise(function (resolve, reject) {
        axios.get(url).then(function (response) {
          resolve && resolve(response.data)
        }).catch(function (response) {
          reject && reject(response)
        })
      })
    },
    post: function (url, data) {
      return new Promise(function (resolve, reject) {
        axios.post(url, data).then(function (response) {
          resolve && resolve()
        }).catch(function (response) {
          reject && reject(response)
        })
      })
    }
  }
}
