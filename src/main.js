// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vueRouter from 'vue-router'
import router from './router'
import Title from 'vue-wechat-title'
import store from './store/index'

import {
  Icon, Tabbar, TabbarItem, Image, Badge, Circle, Field, Button, Radio, Checkbox, Tab, Tabs, PullRefresh, List,
  Empty, CheckboxGroup, ImagePreview, RadioGroup, Search, Divider, Lazyload, Tag, Popup, DatetimePicker, Collapse,
  CollapseItem, Cell, CellGroup, Step, Steps, Dialog, Picker, Calendar, NoticeBar, Popover, Swipe, SwipeItem, Stepper,
  ActionSheet,
  Rate,
  Switch,
  Progress,
  Loading
} from 'vant'

import 'amfe-flexible';
import '@vant/touch-emulator';

// import vToolScroll from 'com/scroll/better_scroll.vue'
import vView from './views/public/view.vue'
import vUpload from './views/public/upload.vue'
import vUploads from './views/public/uploads.vue'
import vUpload2 from './views/public/upload_once.vue'
import vPage from './views/public/page.vue'
import vMore from './views/public/moremodel.vue'
import vFinance from './views/public/finance.vue'
import vFixed from './views/newpublic/fixed.vue'

import xj from 'com/demo/index.js'
import $api from 'public/api/api.js'
import $js from 'public/js/const.js'
import $vx from 'public/js/vx.js'
// import $model from 'public/js/model.js'

Vue.config.productionTip = false
Vue.use(Title).use(xj)
// vant
Vue.use(Icon).use(Tabbar).use(TabbarItem).use(Image).use(Badge).use(Circle).use(Field).use(Button).use(Radio)
  .use(Checkbox).use(Tab).use(Tabs).use(PullRefresh).use(List).use(Empty).use(CheckboxGroup).use(ImagePreview)
  .use(RadioGroup).use(Search).use(Divider).use(Lazyload).use(Tag).use(Popup).use(DatetimePicker).use(Collapse)
  .use(CollapseItem).use(CellGroup).use(Cell).use(Step).use(Steps).use(Dialog).use(Picker).use(Calendar).use(NoticeBar)
  .use(Popover).use(Swipe).use(SwipeItem).use(Stepper).use(ActionSheet).use(Rate).use(Switch).use(Progress)
  .use(Loading)

Vue.prototype.$api = $api
// Vue.prototype.$model = $model
Vue.prototype.$js = $js
// eslint-disable-next-line
Vue.prototype.$frameview = demo.siteConfig.isframe
// eslint-disable-next-line
Vue.prototype.$timefn = demo.siteConfig.timefn
Vue.prototype.$vx = $vx

// Vue.component('vToolScroll', vToolScroll)
Vue.component('vView', vView)
Vue.component('vUpload', vUpload)
Vue.component('vUploads', vUploads)
Vue.component('vUploadOnce', vUpload2)
Vue.component('vPage', vPage)
Vue.component('vMore', vMore)
Vue.component('vFinance', vFinance)
Vue.component('vFixed', vFixed)

const originalPush = vueRouter.prototype.push
vueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
const originalReplace = vueRouter.prototype.replace
vueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

// Vue.config.errorHandler = (error, instance, info) => {
//   // eslint-disable-next-line
//   demo.$err.setMsg(JSON.stringify({ error, instance, info }))
// }
