var exec = window.cordova.require('cordova/exec')

function BasePlugin (pluginName) {
  //插件名称对应原生配置插件名称  config plugin=name
  this.pluginName = pluginName
  //methodName原生方法名
  this.execNativeMethod = function (methodName, args, success, fail) {

    exec(success, fail, this.pluginName, methodName, args)
  }
}
function UApp () {

  this.method = BasePlugin
  this.method('UApp')
  delete  this.method
  this.finish = function () {
    this.execNativeMethod('finish', [], null, null)
  }
  this.back = function () {
    this.execNativeMethod('back', [], null, null)
  }
  // 打开新的窗口
  this.openNewWindow = function (url) {
    this.execNativeMethod('openNewWindow', [{'url': url}], null, null)

  }
  this.openUrl = function (url) {
    this.execNativeMethod('openUrl', [url], null, null)
  }
  // 检查网络状态  -1未知网络链接    0无网络  1 wifi   2 移动网络
  this.networkState = function (success) {
    this.execNativeMethod('networkState', [], success, null)
  }

}


function User () {
  this.method = BasePlugin
  this.method('User')
  delete  this.method
  this.getUser = function (success) {
    this.execNativeMethod('getUser', [], success, null)
  }
}

if (!window.ULplugin) {

  window.ULplugin = {}

  function ULpluginReady () {
  }
}
window.ULplugin.UApp = new UApp()
window.ULplugin.User = new User()

if (window.pluginReady) {
  window.pluginReady()
}
