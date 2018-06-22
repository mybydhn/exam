export function getUser (success) {
  if (window.ULplugin && window.ULplugin.User) {
    window.ULplugin.User.getUser(function (user) {
      success && success(user)
    })
  }
}

/*
* 退出App
* */
export function exitApp () {
  window.ULplugin.UApp.finish()
}
