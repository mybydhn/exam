<template>
  <div>
    <preview-audio :addr="addr" v-if="recognitionType(addr) == 'audio'" :id="id"></preview-audio>
    <preview-image :addr="addr" v-else-if="recognitionType(addr) == 'image'" :id="id"></preview-image>
    <preview-video :addr="addr" v-else-if="recognitionType(addr) == 'video'" :id="id"></preview-video>
  </div>
</template>
<script type="text/ecmascript-6">
  import PreviewAudio from 'components/attachFile/previewAudio'
  import PreviewImage from 'components/attachFile/previewImage'
  import PreviewVideo from 'components/attachFile/previewVideo'
  import * as FileUtils from '@/common/js/fileUtils'
  export default {
    props: ['addr', 'id'],
    methods: {
      recognitionType (suffix) {
        if (!suffix) {
          return ''
        }
        return FileUtils.formatLimit(suffix)
      },
      doThis (event) {
        console.log('ddd')
      }
    },
    components: {
      PreviewAudio,
      PreviewImage,
      PreviewVideo
    }
  }
</script>