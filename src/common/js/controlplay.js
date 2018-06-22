export function stopAllMedia () {
  var plyraudioMedias = document.getElementsByTagName('audio')
  var plyrvideoMedias = document.getElementsByTagName('video')
  for (let i = 0; i < plyraudioMedias.length; i++) {
    var audioInstance = plyraudioMedias[i]
    audioInstance.pause()
  }
  for (let i = 0; i < plyrvideoMedias.length; i++) {
    var videoInstance = plyrvideoMedias[i]
    videoInstance.pause()
  }
}
