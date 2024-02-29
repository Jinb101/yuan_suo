/* eslint-disable */
import def from './default'
import { Toast, Dialog } from 'vant'
let prefix = window.location.origin
let htmlprefix = prefix + window.location.pathname + 'static/html/'
let api = {
  http: prefix + '/api/', // 请求地址
  pdf: prefix + '/pdf/web/viewer.html?file=',
  wxValidate: htmlprefix + '/wxbind.html',
  share: prefix + window.location.pathname
}
let env = process.env.NODE_ENV === 'development'

if (env) {
  api.http = '/api/'
}

if (window.LINKTOAPIWWW) {
  api.http = window.LINKTOAPIWWW
}

let btnColor = ''
let color = ''
let config = demo.siteConfig

if (config.baseprefixapi) {
  api.http = config.baseprefixapi
}

try {
  let theme = config.theme
  btnColor = theme.linear3
  color = theme.color
} catch (e) { }

let timeout = (time, flag) => {
  if (flag) {
    let t = demo.es6().timeoutDiff(time)
    return t.replace(/\//g, '-')
  }
  return demo.timeout(time, 'all', '-')
}

let wxcode = (hash, page = '') => {
  let url = config.wxcode(api.http, hash, page)
  if (env) {
    console.log(url);
    return url
  }
  window.location.href = url
}

let wxshare = (opt = {}, type = 'share', callback, hid = '0') => {
  let e = demo.$local.get('app_wx', {})
  let a = demo.$local.get('app_config', {})
  console.log(hid);
  console.log(hid && hid === '1');
  if (!e.appId) return 0
  demo.$vx.start(e, res => {
    if (res.code) {
      let obj = {
        title: hid === '1' ? a.name : '您的好友向你分享了' + a.name + '园所',
        link: hid === '1' ? opt.link : window.location.href,
        desc: hid === '1' ? opt.desc : a.name + '欢迎您的加入',
        logo: hid === '1' ? opt.logo : a.logo,
        imgUrl: hid === '1' ? opt.logo : a.logo,
      }



      try {
        if (obj.link.indexOf('&code') > 0) {
          let l = demo.getUrl(obj.link)
          let s = obj.link.split('?')[0] + '?'
          delete l.code
          for (iv in l) {
            s += iv + '=' + l[iv] + '&'
          }
          obj.link = s
        }

        if (obj.link.indexOf('/info/') >= 0 || obj.link.indexOf('/article_detail') >= 0) {
          console.log('分享链接改为家长端')
          obj.link = obj.link.replace('/yuansuo/', '/parent/').replace('/article_detail', '/info_detail').replace('/info', '/info_detail')
          obj.link = obj.link.replace('info_detail_detail', 'info_detail')
        }
      } catch (e) { }

      // console.log(obj);

      switch (type) {
        case 'share':
          demo.$vx.share(obj, () => {
            console.log('回调成功');
          })
          demo.$vx.share(obj, () => {
            console.log('回调成功');
          }, true)
          console.log(obj);
          break
        case 'qr':
          demo.$vx.qr((r) => {
            if (callback) {
              callback(r)
            }
          }, true)
          break
        case 'geo':
          demo.$vx.geo(e => {
            if (callback) {
              callback(e)
            }
          })
          break
        default:
      }
      // console.log(obj);
    } else {
      console.warn(res.err, res);
    }
  })
}

let wxshareh5 = (type, obj = {}, desc = '', flag, nametologo = {}) => {
  let os = {
    type: "admin",
    nid: demo.$local.get("nid", ""),
    time: Date.now(),
    ...obj
  };
  let a = demo.es6().encrypt(os, "", "poster");
  let url = [
    demo.siteConfig.api.h5,
    "poster/?type=", type, "&h5=",
    a,
  ].join("");
  if (flag) return url
  if (env) {
    console.log(url);
    return 0
  }
  if (!demo.es6().isWx()) {
    console.log(url);
    return 0
  }
  if (nametologo.title) {
    wxshare({ link: url, desc, ...nametologo })
    return 0
  }

  wxshare({ link: url, desc })
}

let uploadShow = config.uploadShow

let message = (err) => {
  Toast({ message: err, duration: 5e3 })
}

let model = (title, message, fn) => {
  Dialog.confirm({
    title,
    message,
  })
    .then(() => {
      fn(!0)
      // on confirm
    })
    .catch(() => {
      fn(!1)
      // on cancel
    });
}
let modeldel = (fn, text = '') => {
  model('删除提示！', '是否删除' + text + '?', r => {
    if (r) {
      fn()
    }
  })
}
let modelalert = (msg, fn) => {
  Dialog.alert({
    message: msg,
  }).then(() => {
    fn ? fn() : null
  });
}
let modelmenuclose = () => {
  modelalert('无法进入！该功能未开通，请联系园长开通权限')
}

let strToHtml = (str) => {
  return (str + '').replace(/\s/g, '<br/>');
}

let islevel = (level, levels) => {
  let status = !levels || !levels.length
  if (Array.isArray(level)) {
    return [...level].map(s => {
      if (status) return false
      return levels.filter(r => {
        return +r.id === +s
      }).length > 0
    })
  }
  if (status) return false
  return levels.filter(r => {
    return +r.id === +level
  }).length > 0
}

// export
const _const = {
  api, env, def, btnColor, color, timeout, uploadShow, message, config, strToHtml, model,
  islevel, modeldel, wxcode, wxshare, modelalert, modelmenuclose, wxshareh5
}
export default _const
