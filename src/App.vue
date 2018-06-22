<template>
  <div id="app" :class="[platform]">
    <router-view/>
  </div>
</template>
<script>
import { getPlatform } from '@/common/js/platform'
export default {
  name: 'App',
  created () {
    this.platform = 'wrap' + getPlatform().platform
    try {
      document.body.removeChild(document.getElementById('appLoading'))
      setTimeout(function () {
        document.getElementById('app').style.display = 'block'
      }, 500)
    } catch (e) {

    }
  }
}
</script>

<style>
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header,
menu, nav, output, ruby, section, summary,
time, mark, audio, video, input{
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font-weight: normal;
  vertical-align: baseline;
  box-sizing: border-box;
}
body, html{
  line-height: 1;
  font-family: 'Microsoft YaHei', 'Arial', 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', 'sans-serif', 'Droid Sans Fallback';
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}
a {
  color: #42b983;
}
img{
  max-width:100%;
  height:auto;
}
.cube-toast-tip{
  max-width: 18em !important
}
.cube-popup-container{
  -webkit-transform: translate(100%, 100%)
}
.cube-popup-content{
  -webkit-transform: translate(-100%,-100%)
}
.cube-popup-center .cube-popup-content{
  -webkit-transform: translate(-50%,-50%)
}
.wrapios .swiper-container{
  background-color: #fff;
  height:calc(100% - 70px);
  height:calc(100vh - 70px);
}
.wrapandroid .swiper-container{
  background-color: #fff;
  height:calc(100% - 50px);
  height:calc(100vh - 50px)
}
label > * { pointer-events: none; }
.custom-audio {
  /*自定义音频*/
  position: relative;
  width: 240px !important;
  border-radius: 4px;
  overflow: hidden;
  background: transparent !important;
}

.custom-audio .mejs__controls {
  background: #dee5ef !important;
}

.custom-audio .mejs__button>button {
  margin: 12px 8px;
  width: 16px;
  height: 16px;
  background: transparent url('/static/img/audio_images.png');
  background-repeat: no-repeat;
  background-size: 100%;
}

.custom-audio .mejs__play>button {
  background-position: 0px -49px;
}

.custom-audio .mejs__pause>button {
  background-position: 0px -69px;
}

.custom-audio .mejs__replay>button {
  background-position: 0px -25px;
}

.custom-audio .mejs__loading>button {
  background-position: 0px -25px;
}

.custom-audio .mejs__error>button {
  background-position: 0px 0;
}

.custom-audio .mejs__currenttime-container {
  display: none;
}

.custom-audio .mejs__time-rail {
  padding-top: 0;
}

.custom-audio .mejs__time-total {
  margin: 18px 0 0;
  height: 4px;
  border-radius: 2px;
  background: #cdd3e2 !important;
  outline: none;
}

.custom-audio .mejs__time-total>* {
  height: 100%;
}

.custom-audio .mejs__time-buffering {
  display: none;
}

.custom-audio .mejs__time-loaded {
  background: transparent !important;
}

.custom-audio .mejs__time-current {
  background: #95a5bd;
}

.custom-audio .mejs__time-handle {
  top: -4px;
}

.custom-audio .mejs__time-handle-content {
  width: 12px;
  height: 12px;
  border: 1px solid #d3d9e7;
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
}

.custom-audio .mejs__time-float {
  display: none !important;
}

.custom-audio .mejs__duration-container:before {
  content: "- ";
}

.custom-audio .mejs__duration-container {
  font-weight: normal;
  color: #314767;
}

.custom-audio .mejs__volume-button,
.custom-audio .mejs__horizontal-volume-slider {
  display: none;
}
.custom-video{
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.custom-video .mejs__poster {
  max-width: 100%;
}
</style>
<style lang="stylus" rel="stylesheet/stylus">
.u-page
  .content
    margin: 0 !important
    height: 100%
    display: flex
    flex-flow: column
  .nav-scroll-list-wrap
    transform: rotate(0deg) // fix 子元素超出边框圆角部分不隐藏的问题
    position: relative
    background-color: white
    border-bottom : 1px solid rgba(0, 0, 0, 0.1)
    padding-right: 30px
    .cube-scroll-content
      display: inline-block
  .content-scroll-wrapper
    flex: 1
    position: relative
    .content-scroll-list-wrap
      height: 100%
      width: 100%
      transform: rotate(0deg) // fix 子元素超出边框圆角部分不隐藏的问题
      position: absolute
      left:0
      right:0
      top: 0
      bottom: 0
      overflow: hidden
</style>