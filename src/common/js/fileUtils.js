// 根据文件的扩展名或文件名 给出文件的类型
export function formatLimit (suffix) {
  suffix = suffix.substring(suffix.lastIndexOf('.') + 1)
  var fileLimit = {
    video: {
      format: 'mp4, mpg, mpeg, avi, rmvb, rm, wmv, mov, video',
      size: 1024,
      transcoding: '自动转码(H.264编码的mp4格式)，切片(流媒体播放)，压缩(128~1024kbps)',
      type: 'video'
    },
    audio: {
      format: 'mp3, aac, wav, wma, ogg, m4a, audio',
      size: 50,
      transcoding: '自动转码(AAC编码的mp3格式)，切片(流媒体播放)，压缩',
      type: 'audio'
    },
    image: {
      format: 'png, jpg, jpeg, gif, bmp, image', // 加image是为了兼容客户端传回来的内容
      size: 2,
      transcoding: '--',
      type: 'image'
    },
    doc: {
      format: 'doc, docx',
      size: 50,
      transcoding: '转图片',
      type: 'doc'
    },
    xls: {
      format: 'xls, xlsx',
      size: 50,
      transcoding: '转图片',
      type: 'xls'
    },
    pdf: {
      format: 'pdf',
      size: 50,
      transcoding: '转图片',
      type: 'pdf'
    },
    ppt: {
      format: 'ppt, pptx',
      size: 50,
      transcoding: '转图片',
      type: 'ppt'
    },
    zip: {
      format: 'zip, rar, 7z',
      size: 50,
      transcoding: '压缩',
      type: 'zip'
    },
    txt: {
      format: 'txt',
      size: 50,
      transcoding: '文本',
      type: 'txt'
    }
  }
  suffix = suffix.toLowerCase()
  let type = 'other'
  let fileType
  for (fileType in fileLimit) {
    var limit = fileLimit[fileType].format
    if (limit.indexOf(suffix) >= 0) {
      type = fileLimit[fileType].type
      return type
    }
  }
  return type
}
// 根据给定的大小B转换成MB等单位
export function formatSize (size) {
  if (size === undefined || /\D/.test(size)) {
    return 'invalid data'
  }
  function round (num, precision) {
    return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
  }
  var boundary = Math.pow(1024, 4)
  // TB
  if (size > boundary) {
    return round(size / boundary, 1) + 'TB'
  }
  // GB
  if (size > (boundary /= 1024)) {
    return round(size / boundary, 1) + 'GB'
  }
  // MB
  if (size > (boundary /= 1024)) {
    return round(size / boundary, 1) + 'MB'
  }
  // KB
  if (size > 1024) {
    return Math.round(size / 1024) + 'KB'
  }
  if (size === '') {
    return ''
  }
  return size + 'b'
}
