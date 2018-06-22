window.require = window.cordova.require;

cordova.define('cordova/plugin_list', function(require, exports, module) {

  module.exports = [
    {
      "file": "./static/3rdlib/cordova/CordovaPlugin.js",
      "id": "cordova-plugin-common.device",
      "clobbers": [
        "share"
      ]
    },
  ];
  module.exports.metadata =
    {}
});
