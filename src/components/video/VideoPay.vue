<template>
  <div>
    <video ref="videoRef"
           class="video-js vjs-default-skin"
           id="my-video"
           controls
           preload="auto"
           width="340"
           height="264"
           :src="src"></video>
    <div v-if="errorMsg">{{ errorMsg }}</div>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      videoPlayer: null,
      errorMsg: ''
    };
  },
  mounted() {
    this.initVideo()
  },
  beforeDestroy() {
    if (this.videoPlayer) {
      this.videoPlayer.dispose()
    }
  },
  watch: {
    src(newSrc) {
      if (!newSrc) {
        this.stopVideo()
      } else {
        this.playVideo(newSrc)
      }
    }
  },
  methods: {
    initVideo() {
      if (this.src && !this.videoPlayer) {
        this.playVideo(this.src)
      }
    },
    playVideo(src) {
      const options = {
        language: 'zh-CN',
        controls: true,
        preload: 'auto',
        autoplay: true,
        fluid: false,
        sources: [
          {
            src,
          }
        ],
        errorDisplay: {
          showSpinner: false
        },
        error: this.onError()
      }
      if (this.videoPlayer) {
        this.videoPlayer.src({ src: this.props.src, type: 'video/mp4' })
      } else {
        this.videoPlayer = videojs(this.$refs.videoRef, options, function onPlayerReady() {
          // console.log('Player ready')
        })
      }
    },
    stopVideo() {
      if (this.videoPlayer && !this.videoPlayer.paused()) {
        this.videoPlayer.pause()
      }
    },
    onError(error) {
      console.log('Video error:', error)
      // if (error.type === 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
      //   this.errorMsg = '视频格式不支持'
      //   this.videoPlayer.src('')
      // } else {
      //   this.errorMsg = '播放错误，请稍后再试'
      //   this.videoPlayer.pause()
      // }
    }
  }
}
</script>

<style scoped>
/* Add any custom styles here */
.vjs-error .vjs-error-display:before {
  display: none;
}
</style>
