/* eslint-disable */
demo.timerwait = null
demo.access('siteConfig', (() => {
  let params = demo.getUrl()
  let moreid = false
  let localname = ''
  let baseprefixapi = ''
  let isvalidateopen = +params.id === 7 || +params.id === 1
  if (params.id) {
    localname = 'youeryuanadmin' + params.id
    demo.$local.set('nid', params.id)
  } else {
    moreid = true
    localname = 'youeryuanadmin'
  }
  demo.storageName(localname)

  if (typeof VConsole === 'function') {
    let db = demo.$local.get('debug-page-status', '')
    if (+db === 1 || params.debug) {
      new VConsole()
    }
    // new VConsole()
  }

  let colouricon = demo.$local.get('colour-icon-status', '')
  let bytabsatus = demo.$local.get('by-tab-status-api', '')

  demo.options.ajaxUploadTimeout = 9e5 // 15分钟
  demo.options.ajaxTimeout = 12e4

  let _location = window.location
  let sourceURL = location.origin.indexOf('local') > -1 ? 'http://127.0.0.5/500/' : (_location.origin + '/500/')
  let isframe = _location.href.indexOf('/new/') >= 0 || !!params.frame
  let isdebug = _location.pathname.indexOf('ys') > 0
  let iseditor = true
  let isgetbytab = false // 是否收集用户访问api次数
  if (+bytabsatus === 1) {
    isgetbytab = true
  }

  let api = (() => {
    let prefix = _location.origin
    return {
      http: prefix + '/api/',
      h5: sourceURL + 'h5/',
      see: sourceURL + 'see/',
      chart: sourceURL + 'chart/',
      json: sourceURL + 'json/',
      hps: sourceURL + 'http/',
      url: prefix + _location.pathname,
      clockin: (data) => {
        let s = sourceURL + 'h5/clockin/?h5='
        let h5 = demo.es6().encrypt({ ...data }, 'clock', 'clock', 'CLOCKINTOIMAGE')
        return s + h5
      }
    }
  })()

  if (iseditor) {
    let js = sourceURL + 'tinymce/tinymce.js'
    demo.script(js, () => { })
  }

  let wxcode = (url, hash, page) => {
    let id = demo.$local.get('nid', params.id)
    let baseurl = [sourceURL, 'auth/index.html?type=admin&id=', id, '&url=', encodeURIComponent(url), '&local=', localname, '&hash=', hash || '']
    if (page) {
      baseurl = baseurl.concat(['&page=', encodeURIComponent(page)])
    }
    if (isdebug) {
      baseurl = baseurl.concat(['&event=ys&debug=1'])
    }
    return baseurl.join('')
  }

  let icon = (name, type, suffix = '.png', ntype) => {
    let path = 'image/'
    let stype = type
    if (ntype !== undefined && ntype > 0) {
      stype = 'o2'
      name = ntype
    }
    switch (stype) {
      case 'js':
        path = 'js/'
        break
      case 'bar':
        path = 'icon/_admin/bar/'
        break
      case 'index':
        path = 'icon/_admin/index/'
        break
      case 'finance':
        path = 'icon/_admin/finance/'
        break
      case 'work':
        path = 'icon/_admin/work/'
        break
      case 'private':
        path = 'icon/private/'
        break
      case 'emoji':
        path = 'emoji/'
        break
      case 'o2':
        path = 'icon/o2/'
        break
      case 'n':
        path = 'icon/o/'
        if (+colouricon === 1) {
          path = 'icon/n/'
        }
        break
      default:
        path = 'icon/' + type + '/'
    }
    return [sourceURL, path, name, suffix].join('')
  }

  let theme = {
    color: '#6943f2', // 主色系
    colors: ['#ab95f1', '#c7b5f3'], // 副色系
  }
  theme.linear = demo.$alg.gradients(180, theme.color, ...theme.colors, 'rgba(255,255,255,0)')
  theme.linear2 = demo.$alg.gradients(180, theme.color, ...theme.colors)
  theme.linear3 = demo.$alg.gradients(45, theme.color, ...theme.colors)

  let uploadPath = (name, suffix = '.png') => {
    return [sourceURL, 'icon/upload/', name, suffix].join('')
  }
  let uploadType = {
    video: {
      accept: { type: "other", accept: "video/*" },
      type: "video",
      src: uploadPath('video')
    },
    audio: {
      accept: { type: "other", accept: "audio/*" },
      type: "audio",
      src: uploadPath('audio')
    },
    img: {},
    pdf: {
      accept: { type: "other", accept: "application/pdf,.pdf" },
      type: "pdf",
      src: uploadPath('pdf')
    },
    word: {
      accept: {
        type: "other",
        accept:
          "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
      type: "pdf",
      src: uploadPath('word')
    },
    excel: {
      accept: {
        type: "other",
        accept:
          "application/msexcel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      type: "pdf",
      src: uploadPath('excel')
    },
    text: {
      accept: {
        type: "other",
        accept:
          "application/msexcel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,.pdf",
      },
      type: "pdf",
      src: uploadPath('text')
    }
  }
  uploadType.all = uploadType.text
  uploadType.all.accept.accept += ',image/*'
  uploadType.all.image = uploadPath('image', '.jpg')
  let uploadShow = (name) => {
    let s = ''
    switch (name) {
      case 'docx':
      case 'doc':
        s = uploadPath('word')
        break
      case 'pdf':
        s = uploadPath('pdf')
        break
      case 'xlsx':
      case 'xls':
        s = uploadPath('excel')
        break
      case 'mp4':
      case 'avi':
      case 'rmvb':
      case 'm3u8':
        s = uploadPath('video')
        break
      case 'mp3':
        s = uploadPath('audio')
        break
      default:
        s = uploadPath('text')
    }
    return s
  }

  let classification = ['', '幼小衔接班', '婴幼衔接班', '小班', '中班', '大班']


  let a = demo.$local.get("system-mode", {});
  let hide = {
    index: {
      approval: 0
    },
    write: {
      num: 5, // 最大签名数
      type: a.write ? 'big' : 'small'
    },
  }

  let text = {
    tag: (num, obj = {}) => {
      let arr = num.length ? num : []
      let n = [
        { text: '点赞', icon: 'like-o', type: 'like' },
        { text: '删除', icon: 'delete-o', type: 'del', col: 'danger' },
        { text: '取消点赞', icon: 'like', type: 'unlike' },
        { text: '下载', icon: 'down', type: 'down' },
        { text: '预览', icon: 'eye-o', type: 'view' },
        { text: '编辑', icon: 'edit', type: 'edit', col: 'warning' },
        { text: '屏蔽', icon: 'closed-eye', type: 'out' },
        { text: '解除屏蔽', icon: 'eye-o', type: 'in' },
        { text: '评论', icon: 'edit', type: 'comment' },
        { text: '审核通过', icon: 'success', type: 'check', col: 'primary' },
        { text: '反审核', icon: 'cross', type: 'nocheck', col: 'info' },
        { text: '更改账户', icon: 'card', type: 'card', col: 'warning' },
        { text: '解除绑定', icon: 'cross', type: 'crosscard', col: 'danger' },
        { text: '拨打电话', icon: 'phone-o', type: 'tel' },
        { text: '点击入学', icon: 'flower-o', type: 'flower' },
        { text: '备注', icon: 'label-o', type: 'label' },
        { text: '点击分班', icon: 'flower-o', type: 'classes' },
      ]
      let t = []

      arr.forEach(k => {
        let os = { ...n[k], ...obj }
        t.push(os)
        os = null
      });

      t = t.filter(r => {
        return !!r.text
      })

      return JSON.parse(JSON.stringify(t))
    },
    emoji: [{ name: "2", count: 59, suffix: ".png", text: "" }],
    moneytograde: 1, // 积分换算成金额比 即 100积分 = 100/moneytograde 元
    levelmenu: [
      '3000', '3001', '3002', '', '', '', '10201', '1001', '10000', '10001',
      '10002', '10003', '20100', '20101', '20102', '20103', '20104', '20105', '20106', '10004',
      '20200', '20201', '10005', '20300', '20301', '20302', '20303', '20304', '20305', '20306',
      '20307', '10006', '10007', '20400', '20401', '20402', '20403', '20404', '20405', '20406',
      '10008', '10100', '10101', '20500', '20501', '20502', '20503', '20504', '20505', '20506',
      '20507', '10102', '10103', '10104', '10200', '10202', '10203', '4000', '4001', '4002',
      '4003', '4006', '4007', '4008', '4009', '4010', '4011', '4012', '4013', '4014',
      '4015', '4016', '4018', '20308', '20309'
    ],
    geo: [104.00405, 30.636559],
    templocal: {
      class: 'temp-local-data-class',
      notify: 'temp-local-data-notify',
      info: 'temp-local-data-info',
      child: 'temp-local-data-child'
    }
  }

  let tel = (tel) => {
    let a = demo._div('a')
    a.setAttribute('href', 'tel:' + tel)
    a.click()
    setTimeout(() => {
      a = null
    }, 300)
  }

  let staticicon = (name, suffix = 'png') => {
    let dev = location.origin.indexOf('local') > -1 ? '/static/image/' : './' + (isframe ? 'new/' : '') + 'static/image/'
    return dev + name + '.' + suffix
  }

  let timefn = (fn) => {
    if (demo.timerwait) {
      demo.timerwait = null
      clearTimeout(demo.timerwait)
      return 0
    }
    demo.timerwait = setTimeout(() => {
      fn()
      demo.timerwait = null
      clearTimeout(demo.timerwait)
    }, 800)
  }

  let tojson = (name, fn) => {
    demo.ajax(api.json + name + '.json').get({}, r => {
      fn(r)
    })
  }

  let version = (page, limit, callback) => {
    let dev = location.origin.indexOf('local') > -1 ? '/static/js/' : './' + (isframe ? 'new/' : '') + 'static/js/'
    demo.script(dev + 'version.js', () => {
      demoversion(page, limit, (r) => {
        callback ? callback(r) : null
      })
    })
  }

  let citys = (fn) => {
    let dev = location.origin.indexOf('local') > -1 ? '/static/js/' : './' + (isframe ? 'new/' : '') + 'static/js/'
    demo.ajax(dev + 'e.json').get({}, r => {
      fn ? fn(r) : null
    })
  }

  let hps = (type, data = {}, fn) => {
    demo.ajax(api.hps + '?type=' + type).post({ ...data }, r => {
      fn(r, api.hps)
    })
  }

  let tktoggle = (tk = '') => {
    let cv = demo.$local
    let name = ['local_token', 'token', '$token', 'access_token']
    if (tk === '') {
      // console.log('执行获取');
      let v = cv.get(name[0]) || cv.get(name[1]) || cv.get(name[2]) || cv.get(name[3])
      return v
    } else if (tk === 'clear') {
      // console.log('执行清除');
      cv.clear(name[0]); cv.clear(name[1]); cv.clear(name[2]); cv.clear(name[3]);
    } else {
      // console.log('执行保存');
      cv.set(name[0], tk); cv.set(name[1], tk); cv.set(name[2], tk); cv.set(name[3], tk);
    }
    return tk
  }

  let menulevel = (arr) => {
    let k = {
      forward_courtesy: 1000, // 转发
      achievements: 1001, // 绩效积分
      // group: 1002, // 集团
      finance: 1003, // 财务
      // baby_photo_album: 1004, // 宝宝相册
      // baby_evaluation: 1005, // 宝宝测评
      // home_contact_book: 1006, // 家园联系册
      // baby_online: 1007, // 宝贝在线
      // home_education: 1008 // 家庭教育
    }
    let d = JSON.parse(JSON.stringify(arr)).filter(s => {
      return +s.switch === 0
    }).map(r => {
      return k[r.key]
    })
    let close = d.length > 0 ? Object.values(k).filter(r => {
      return d.indexOf(r) < 0
    }) : []

    return {
      open: d,
      close
    }
  }

  let matchurl = (s = '') => {
    var reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    var v = s.match(reg);
    return v
  }

  let downfiledata = (data, open, path, to = 'link') => {
    let o = {
      type: "admin",
      path,
      to,
      data,
    }
    let url = api.h5 + "down/?h5=" + demo.es6().encrypt(o, "down");
    if (open) {
      console.log(url);
      return 0
    }
    window.open(url)
  }

  let frametoh5page = (type, data = {}, type2 = '') => {
    let os = {
      type: 'admin',
      ext: { token: demo.$local.get('token'), ...data },
      id: demo.$local.get('nid'),
      page: type2 || type
    }
    let h5 = api.h5.indexOf('127.0.') >= 0 ? 'http://localhost:8506' : api.h5 + 'h5page'
    let url = h5 + '/?type=' + type + '&h5=' + demo.es6().encrypt(os, '', os.type)
    return url
  }

  let nettype = () => {
    var ua = navigator.userAgent;
    var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
    networkStr = networkStr.toLowerCase().replace('nettype/', '');
    var networkType;
    switch (networkStr) {
      case 'wifi': networkType = 'wifi';
        break;
      case '4g': networkType = '4g';
        break;
      case '3g': networkType = '3g';
        break;
      case '3gnet': networkType = '3g';
        break;
      case '2g': networkType = '2g';
        break;
      default: networkType = 'other';
    }
    return networkType;
  }

  let mapgeo = (obj = {}) => {
    let o = {
      ad: [0, 0], // 公司位置
      nd: [1, 1], // 打卡位置
      scale: 0, // 打卡半径
      time: 0, // 打卡时间戳
      pic: '', // 打卡图片
      ...obj
    }
    let str = demo.es6().encrypt(o, '', 'mapgeo')
    return [api.h5, 'mapgeo/', '?h5=', str].join('')
  }

  // 班级圈/资讯/通知/家园练习册 临时保存
  let tempdata = (name, data, isclear) => {
    let a = demo.$local.get("system-mode", {});
    let x = typeof a.tempdata === 'boolean'
    if (x && !a.tempdata) return 0
    let n = text.templocal[name]

    let retdata = (v, id = '') => {
      let x = v.$time || ''
      if (name === 'child') {
        if (x) {
          let a = v.data[0]
          let l = Object.keys(a)
          if (id) {
            return a[id] || {}
          } else if (l.length) {
            return a[l[0]] || {}
          }
          return {}
        } else {
          return {}
        }
      }
      return x ? v : { $time: false }
    }

    if (n) {
      if (isclear) {

        if (name === 'child') {
          if (!data) {
            return 0
          }
          let c = demo.$local.get(n)
          if (c.$time) {
            delete c.data[0][data]
          }
          demo.$local.set(n, c)
          return 0
        }

        demo.$local.clear(n)
        return 0
      }

      if (data === undefined || !data) {
        let v = demo.$local.get(n)
        return retdata(v)
      } else {
        if (name === 'child') {
          let c = demo.$local.get(n)
          if (typeof data === 'number') {
            return retdata(c, data)
          }
          if (!data) {
            return 0
          }
          if (c.$time) {
            if (typeof c.data[0] !== 'object') {
              c.data[0] = {}
            }
            if (data.$lid) {
              c.data[0][data.$lid] = data
            }
          } else {
            c = { $time: Date.now(), data: [{}] }
          }
          demo.$local.set(n, c)
        } else {
          demo.$local.set(n, { data, $time: Date.now() })
        }
      }
    } else {
      // arr other
      // n = text.templocal.$other
    }
  }

  return {
    api, params, theme, icon, uploadType, uploadShow,
    classification, hide, text, tel, wxcode, citys, hps,
    staticicon, isframe, timefn, tojson, moreid, version,
    tktoggle, isgetbytab, menulevel, baseprefixapi, matchurl,
    downfiledata, isvalidateopen, frametoh5page, nettype, mapgeo,
    tempdata
  }
})())

demo.access('siteApi', () => {
  // 检测访问 [集团/园所]
  let api = {}
  let loginApi = {}
  // type [0未登录，1已登录]
  let fn = (url, text, linktype = 1, type = 1) => {
    let temp = []
    let n = 'nursery'
    switch (+linktype) {
      case 2:
        temp = [n, 'financial']
        break
      case 3:
        temp = [n, 'index']
        break
      case 4:
        temp = [n, 'task']
        break
      case 5:
        temp = ['com', 'nursery_common']
        break
      case 6:
        temp = [n, 'lovable']
        break
      case 7:
        temp = [n, 'information']
        break
      case 8:
        temp = [n, 'class_show']
        break
      case 9:
        temp = [n, 'Maillist']
        break
      case 10:
        temp = [n, 'user']
        break
      case 11:
        temp = [n, 'Human']
        break
      case 12:
        temp = [n, 'adolesce']
        break
      case 13:
        temp = [n, 'banner']
        break
      case 14:
        temp = [n, 'work']
        break
      case 15:
        temp = [n, 'education']
        break
      case 16:
        temp = [n, 'Logistics']
        break
      case 17:
        temp = [n, 'register']
        break
      case 18:
        temp = [n, 'medication']
        break
      case 19:
        temp = [n, 'Education']
        break
      case 20:
        temp = [n, 'v2_food']
        break
      case 21:
        temp = [n, 'garden_record']
        break
      case 22:
        temp = [n, 'recipes']
        break
      case 23:
        temp = [n, 'binding']
        break
      case 24:
        temp = [n, 'enroll']
        break
      case 25:
        temp = [n, 'teacher']
        break
      case 26:
        temp = [n, 'director/repair']
        break
      case 27:
        temp = [n, 'statistics']
        break
      case 28:
        temp = [n, 'behavior_integral']
        break
      case 29:
        temp = [n, 'human']
        break
      case 30:
        temp = [n, 'yuansuo']
        break
      case 31:
        temp = [n, 'tool']
        break
      case 32:
        temp = [n, 'poster']
        break
      case 33:
        temp = [n, 'withdrawal']
        break
      case 34:
        temp = [n, 'leave']
        break
      case 35:
        temp = [n, 'equipment']
        break
      case 36:
        temp = [n, 'problem']
        break
      case 37:
        temp = [n, 'country_study']
        break
      case 38:
        temp = [n, 'attendance']
        break
      case 39:
        temp = [n, 'vote']
        break
      case 40:
        temp = [n, 'montessori']
        break
      case 41:
        temp = [n, 'baby_online']
        break
      case 42:
        temp = [n, 'v2_country_study']
        break
      default:
    }
    temp.push(url)
    return { api: temp.join('/'), type, text, isgroup: true }
  }
  // 202207 新增
  let a202207 = {
    config: fn('com/common/nursery_info', '园所基本信息', null, 0),
    wx: fn('com/common/get_share', '获取微信设置', null, 0),
    openid: fn('com/common/get_openid', '获取openid', null, 0),
    gettoken: fn('com/nursery_common/get_token', '获取token', null, 0),
    login: fn('login', '登录', 10, 0),
    agree: fn('Protocol', '用户协议', 10, 0),
    sms: fn('sendsms', '发送验证码', 10, 0),
    checkSms: fn('checkcode', '验证验证码', 10, 0),
    reg: fn('register', '注册', 10, 0),
    respwd: fn('forgetpassword', '重置密码', 10, 0),
    getys: fn('acquireThePark', '获取登录园所', 10, 0),
  }
  let b202207 = {
    upload: fn('uploadImage', '上传', 5),
    // 主页-通知
    notice: fn('notice', '通知列表', 3),
    noticeMy: fn('sentnotice', '我发的通知', 3),
    noticeSend: fn('sendnotice', '发送通知', 3),
    noticeDetail: fn('noticedetail', '通知详情', 3),
    noticeMyDetail: fn('sentnoticedetail', '我发的通知详情', 3),
    noticeUnread1: fn('UnReadNursery', '园所未读', 3),
    noticeUnread2: fn('UnReadParent', '家长未读', 3),
    noticeWrite: fn('notice_signature', '签名', 3),

    // 任务
    task1: fn('MissionToMe', '待我处理', 4),
    task2: fn('InformToMe', '知会我的', 4),
    task3: fn('Acceptable', '我发起的', 4),
    task1Detail: fn('MissionToMeDetail', '待我处理详情', 4),
    task2Detail: fn('InformToMeDetail', '知会我的详情', 4),
    task3Detail: fn('MissionDetail', '我发起的详情', 4),
    taskStatus: fn('ChangeMissionStatus', '更改任务状态', 4),
    taskDot: fn('UnProcessMission', '未处理任务数量', 4),
    task: fn('SendMission', '发任务', 4),

    // 审批
    approvalDot: fn('approvalcount', '未(审核/处理)数量/未读通知数量', 5),
    approvalMyDot: fn('little_red_dot', '我的审批未处理数量', 5),
    approvalMySend: fn('myapproval', '我的审批-我发起的', 3),
    approvalMyWait: fn('approvaltome', '我的审批-待我审批', 3),
    approvalMyNotice: fn('approvalinformme', '我的审批-知会我的', 3),
    approvalMySendDetail: fn('myapprovaldetail', '我的审批-我发起的详情', 3),
    approvalMyWaitDetail: fn('approvaltomedetail', '我的审批-待我审批详情', 3),
    approvalMyNoticeDetail: fn('approvalinformmedetail', '我的审批-知会我的详情', 3),
    approvalMyStatus: fn('changeapprovalstatus', '更改状态', 3),
    approvalMyAnswer: fn('explain', '审批说明回复', 3),
    approvalMySetnum: fn('modifyApproval', '修改领用物品数量', 3),
    approvalMyClose: fn('cancelTheCollectedItem', '撤销领用物品', 3),
    // 发起审批
    approvalSendGood: fn('sendapprovalgoods', '发起采购', 3),
    approvalSendUse: fn('sendapprovaluse', '发起领用', 3),
    approvalSendCost: fn('sendapprovalcost', '发起费用', 3),
    approvalSendReim: fn('sendapprovalreceipt', '发起报销', 3),
    approvalSendAtten: fn('sendapprovalattendance', '发起出勤', 3),
    setGoodsAdd: fn('nursery/logistics/addSupplies', '添加物资'),
    approvalcheck: fn('ModifyApprover', '替换审批人', 3),

    // 主页
    index: fn('index', '主页配置', 3),
    censusChild: fn('childAttendance', '幼儿考勤', 19),
    censusChilds: fn('class_attendance', '幼儿考勤率', 3),
    censusTeach: fn('nursery/teacher/schoolmaster', '老师考勤'),

    // 主页-精彩瞬间
    cute: fn('lovable', '精彩瞬间', 6),
    cutestatus: fn('likeCancelLike', '点赞', 6),
    cutedel: fn('lovable_delete', '删除', 6),
    cuteadd: fn('addLovable', '添加', 6),
    cutedet: fn('lovableDetails', '详情', 6),

    // 主页-园所资讯
    info: fn('information', '列表', 3),
    infodet: fn('details', '详情', 7),
    infoedit: fn('editor', '编辑', 7),
    infodel: fn('delete', '删除', 7),
    infoadd: fn('increase', '添加', 7),

    // 班级圈
    class: fn('index', '列表', 8),
    classlike: fn('like', '点赞', 8),
    classcomment: fn('comment', '评论', 8),
    classcomments: fn('moreComments', '更多评论', 8),
    classout: fn('shieldingClassCircle', '屏蔽', 8),
    classdeel: fn('del_class_show', '删除', 8),
    classadd: fn('publishclassshow', '发布', 8),
    classdet: fn('Detail', '详情', 8),
    search_class: fn('Index', '搜索',8 ),
    delComment: fn('delMyComment ', '删除我的评论',8 ),

    // 学期计划
    semester: fn('plan/termPlanDetails', '学期计划详情', 12),
    semesteradd: fn('plan/addEditTermPlan', '添加', 12),
    semesterfiles: fn('plan/termAttachmentList', '附件', 12),
    semesterfile: fn('plan/termAttachment', '附件详情', 12),
    semesterfileadd: fn('plan/addEditTermAttachment', '附件添加', 12),
    semesterfiledel: fn('plan/deleteTermAttachment', '附件删除', 12),
    // 周计划月计划
    monthplan: fn('plan/weeklyplan', '周计划月计划', 12),
    monthplanadd: fn('plan/addWeeklyPlan', '添加', 12),
    monthplandel: fn('plan/delweeklyplan', '删除', 12),
    monthplanedit: fn('plan/modifyPlan', '编辑', 12),

    // 轮播图
    banner: fn('index', '轮播图', 13),
    banneradd: fn('increase', '添加', 13),
    bannerdel: fn('delete', '删除', 13),
    bannerdet: fn('details', '详情', 13),
    banneredit: fn('editor', '编辑', 13),

    // 调研表
    feedback: fn('feedBack', '调研表', 14),
    feedbackdet: fn('onlineanswer', '答题详情', 14),
    feedbackadd: fn('submit', '提交调研', 14),
    feedbacklists: fn('survey_records', '调研记录', 14),
    feedbacklist: fn('surveyDetail', '调研详情', 15),
    feedbackanswer: fn('look_survey_pople', '答题人', 14),

    // 维修申报
    repair: fn('index', '维修列表', 26),
    repairhand: fn('autograph', '签名', 26),
    repairsend: fn('increase', '维修申请', 26),

    // 后勤-采购
    purchase: fn('purchase', '采购', 16),
    purchasedel: fn('confirm_revote', '撤销', 16),
    purchasesub: fn('confirmEntry', '确认入库', 16),
    // 后勤-领用
    receive: fn('receive', '领用', 16),
    receivesub: fn('confirmReceive', '领用确认', 16),
    receiveret: fn('confirmBack', '还库', 16),
    receiveunret: fn('noBack', '不还库', 16),
    // 后勤-物资
    supplies: fn('supplies', '物资', 16),
    suppliesdet: fn('suppliesDetails', '详情', 16),
    suppliesupload: fn('upload_pictures', '图片上传', 16),
    suppliesunit: fn('unitAndCate', '单位分类', 16),
    suppliesadd: fn('addSupplies', '添加', 16),
    suppliesedit: fn('editSupplies', '编辑', 16),
    suppliesdel: fn('delSupplies', '删除', 16),
    suppliessearch: fn('material_search', '搜索', 16),
    // 后勤-来访登记
    visit: fn('index', '来访登记', 17),
    // visitcode: fn('twentyfour', '来访二维码', 17),
    // 后勤-食材订单
    foodorder: fn('getFoodList', '食材订单', 20),
    foodorderdet: fn('getFoodOrderInfo', '订单详情', 20),
    foodordersub: fn('confirmFoodOrder', '确认订单', 20),
    // 保健-喂药
    medication: fn('index', '喂药列表', 18),
    medicationdet: fn('details', '详情', 18),
    medicationsend: fn('operation', '喂药状态', 18),
    medicationhand: fn('autograph', '签名', 18),
    // 保健-食谱
    recipes: fn('latest_recipe', '食谱详情', 22),
    recipeshistory: fn('historical_recipes', '历史食谱', 22),
    receiveid: fn('get_suppliers', '是否供应商食谱', 22),
    recipesold: fn('latestRecipe', '食谱-未供应商', 22),
    recipesoldhistory: fn('historicalCookbook', '历史食谱-未供应商', 22),
    recipesoldpic: fn('upload_recipe_picture', '食谱封面-未供应商', 22),
    // 班级-考勤
    atten: fn('childAttendance', '考勤列表', 19),
    attenleave: fn('setLeave', '请假', 15),
    attensend: fn('setArrived', '设为已到', 19),
    attenleaveout: fn('leaving', '离园', 19),
    attencancel: fn('cancelClockOut', '撤销', 15),
    // 班级-成长任务
    grow: fn('homeland/index', '成长任务', 12),
    growadd: fn('homeland/increase', '添加', 12),
    growquest: fn('homeland/questionsAnswered', '答题情况', 12),
    growtext: fn('homeland/jobList', '作业', 12),
    growdet: fn('homeland/details', '作业详情', 12),
    // 班级-学期相册
    classroster: fn('integral/index', '班级名单', 12),
    album: fn('term_album/index', '相册', 12),
    albumadd: fn('term_album/createAlbum', '添加', 12),
    albumedit: fn('term_album/edit', '编辑', 12),
    // 班级-宝贝奖分
    reward: fn('integral/bonusPoints', '奖分', 12),
    // 班级-班级课表
    timetable: fn('getClassPlan', '课表', 16),
    timetableadd: fn('addClassPlan', '添加', 16),
    timetabledel: fn('delClassPlan', '删除', 16),
    // 班级-宝宝奖分规则
    rewardrule: fn('integral/points_mall', '奖分规则', 12),
    rewardruleset: fn('integral/add_points_mall', '编辑奖分规则', 12),
    // 班级-家园联系册
    connection: fn('gardenList', '列表', 21),
    connectionbaby: fn('personalList', '宝宝列表', 21),
    connectiondet: fn('park_details', '详情', 21),
    connectiondot: fn('prompt_not_entered', '小红点', 21),
    connectionadd: fn('entry_record', '添加', 21),
    connectionday: fn('dateToBeSent', '待发送日期', 21),
    connectionsend: fn('unifiedSending', '批量发送', 21),
    // 班级-积分记录
    integral: fn('integral/awardScoreRecord', '积分记录', 12),
    // 班级-积分榜
    integralrank: fn('integral/classScoreboard', '积分榜', 12),
    // 班级-家长入驻
    parent: fn('audit_list', '家长入驻', 23),
    parentdet: fn('auditDetails', '详情', 23),
    parentsend: fn('examine', '审核', 23),
    // 招生-生源
    recruit: fn('source', '生源', 24),
    recruitcode: fn('qr_code', '招生二维码', 24),
    recruitdet: fn('source_detail', '详情', 24),
    recruitdel: fn('source_del', '删除', 24),
    recruitedit: fn('source_edit', '编辑', 24),
    recruitadd: fn('source_add', '添加', 24),
    recruitlabel: fn('get_remarks', '备注', 24),
    recruitlabeladd: fn('add_remarks', '备注添加', 24),
    recruitlabeldel: fn('deleted_remarks', '备注删除', 24),
    recruitschool: fn('enrollmentStudents', '生源入学/分班', 24),
    recruitlocate: fn('Position_re', '定位费', 24),
    recruitlocatestatus: fn('Position_pending', '定位费待审核', 24),
    recruitlocatecancel: fn('Position_canceled', '定位费已取消', 24),
    recruitlocatedetail: fn('Position_detail', '详情', 24),
    // 园务-园所风采
    kindergartenbrief: fn('organization', '简介', 11),
    kindergartenlist: fn('framework', '荣誉', 11),
    kindergartenadd: fn('honor_add', '添加/vr', 14),
    kindergartendel: fn('honor_del', '删除', 14),
    // 园务-老师入驻
    kindergartentach: fn('index', '老师入驻', 25),
    kindergartentachstatus: fn('examine', '审核', 25),
    kindergartentachdel: fn('teacherDel', '删除', 25),
    // 园务-编制
    kindergartenorgan: fn('getShiftStarted', '获取开班人数', 11),
    kindergartenorganset: fn('editShiftStarted', '设置开班人数', 11),
    kindergartenorgansetnum: fn('settingEditing', '设置在编人数', 5),
    kindergartenorganstaff: fn('staffManagement', '获取岗位员工', 11),
    // kindergartenorganstaffdel: fn('deleteEmployee', '删除岗位员工', 11),
    kindergartenorganstaffdels: fn('deleteEmployeeAll', '批量删除员工', 11),
    // 园务-招聘
    kindergartenrecruit: fn('recruitList', '招聘', 11),
    kindergartenrecruitdet: fn('resumeDetail', '简历信息', 11),
    kindergartenrecruitqr: fn('humanQrcode', '招聘二维码', 11),
    kindergartenrecruitdel: fn('deleteResume', '删除简历', 11),
    // 园务-热线地址
    kindergartenaddress: fn('nurseryExtDetails', '热线地址', 5),
    kindergartenaddressset: fn('nursery_ext', '更改', 5),

    // 管理 - 宝贝在线
    baby: fn('BabyOnline', '宝贝在线', 3),
    babydetail: fn('OnlineDetail', '宝贝在线详情', 3),
    babyisoff: fn('nursery/Work/babyIsOff', '宝贝在线是否开启'),

     // 管理 育儿教程
     edulist: fn('nursery/home_education/index'), // 课程列表
     edudet: fn('nursery/home_education/details '), // 课程详情
     eduify: fn('nursery/home_education/classification'), // 课程分类

    // 管理 - 班级
    classnonum: fn('NumberUnshiftedPersons', '未分班人数', 19),
    classnotlist: fn('dontDivision', '未分班', 19),
    classsplit: fn('division', '分班', 19),
    classshift: fn('shiftShift', '转班', 19),
    classgraduate: fn('graduate', '毕业', 19),
    classdropout: fn('dropOut', '退学', 19),
    classsplitlist: fn('inClass', '已分班列表', 19),
    classstudentdet: fn('studentDetails', '学生详情', 19),
    classstudentdetedit: fn('editStudentInfo', '编辑详情', 19),
    classstudentpay: fn('lookPay', '缴费明细', 19),
    classstudentrecord: fn('attendanceRecord', '出勤记录', 19),
    classstudentpunch: fn('timeTag', '打卡记录', 19),
    classstudentleave: fn('leaveRecord', '请假记录', 19),
    classstudentleavein: fn('agree_leave', '同意请假', 14),
    classstudentface: fn('attendanceBaseMap', '修改上传宝宝人脸', 19),
    classeslist: fn('classManagement', '所有班级', 19),
    classesadd: fn('create_class', '创建班级', 19),
    classesedit: fn('edit_class', '编辑班级', 19),
    classesstudent: fn('classStudents', '班级名单', 19),
    classesbatch: fn('batch_shift_transfer', '批量转班', 15),
    classesgraduation: fn('graduation_batches', '批量毕业', 15),
    classesarrearage: fn('arrearsRecord', '欠费记录', 19),
    classesarrearageget: fn('receiptMoney', '收款', 19),
    classesarrearageset: fn('reminders', '催款', 19),
    // 管理 - 园所数据
    recordread: fn('readingData', '在读人数', 27),
    recordreg: fn('registered', '在册人数', 27),
    recordatten: fn('attendance', '出勤率', 27),
    recordfood: fn('foodIngredients', '园所数据', 27), // 1食材 6费用 7退费
    recorddata: fn('getData', '园所数据', 27), // 2水、3电、4气、5幼儿伙食费、6员工伙食费、7工资、8社保
    recordadj: fn('adjunction', '详情', 27),
    recordadjadd: fn('add_data_statistics', '添加', 27),
    // recordwater: fn('access_water_electricity', '水电气', 27),
    // 管理 - 积分管理
    integrallevelm: fn('monthlyScoreboard', '积分榜-月度', 28),
    integrallevely: fn('SemesterScoreboard', '积分榜-学期学年', 28),
    integrallevela: fn('TotalScoreboard', '积分榜-总积分', 28),
    integralmym: fn('myMonthlyPoints', '月度积分', 28),
    integralmya: fn('SemesterPoints', '学期/年度积分', 28),
    integralmys: fn('myTotalPoints', '总积分', 28),
    integralmylist: fn('MyBehaviorList', '积分详细', 28),
    integralget: fn('getTheExaminee', '获取待考核人', 28),
    integralify: fn('behaviorTemplate', '奖分/扣分分类', 28),
    integraladds: fn('createAll', '批量设置奖分/扣分', 28),
    integraladd: fn('create', '设置奖分/扣分', 28),
    integralfile: fn('getManagementSystem', '管理制度', 28),
    integralfileset: fn('uploadManagementSystem', '管理制度上传', 28),
    achievementslist: fn('achievements', '待考核员工列表', 29),
    achievementsdet: fn('assessment_details', '员工考核详情', 29),
    achievementsdata: fn('get_index_database', '获取指标库', 29),
    achievementsedit: fn('assessment_edit', '设置员工考核表', 29),
    achievementswait: fn('myAssessmentStaffList', '待我考核列表', 11),
    achievementsmy: fn('Assessment', '我的考核表', 11),
    achievementsset: fn('selfAssessment', '考核评分', 11),
    achievementsmylist: fn('MyAssessmentForm', '我的考核表', 29),

    // 财务
    finlogin: fn('financial_login/login', '登录', 2),
    finlevel: fn('financial_login/obtainFinancialAuthority', '获取权限', 2),
    finreset: fn('financial_login/setAccessPassword', '重置密码', 2),
    fincode: fn('financial_login/sendSms', '验证码', 2),

    financeifyget: fn('classification/getClassification', '获取分类', 2),
    financeifysearch: fn('classification/searchClassification', '搜索分类', 2),
    financeifyedit: fn('classification/editClassification', '修改分类', 2),
    financeifyadd: fn('classification/addClassification', '添加分类', 2),
    financeifydel: fn('classification/delClassification', '删除分类', 2),

    financeaccount: fn('account/index', '账户列表', 2),
    financeaccountadd: fn('account/addAccount', '创建账户', 2),
    financeaccountedit: fn('account/editAccount', '修改账户', 2),
    financeaccountdel: fn('account/delAccount', '删除账户', 2),

    financecustomer: fn('customer/index', '客户供应商列表', 2),
    financecustomeradd: fn('customer/add', '创建', 2),
    financecustomeredit: fn('customer/editor', '编辑', 2),
    financecustomerdel: fn('customer/strike_out', '删除', 2),

    financestaff: fn('customer/staffList', '员工列表', 2),
    financestaffadd: fn('customer/addStaff', '添加员工', 2),
    financestaffedit: fn('customer/editorStaff', '编辑员工', 2),
    financestaffdel: fn('customer/deleteEmployee', '删除员工', 2),
    financestaffget: fn('customer/getallstaff', '获取员工', 2),

    financevoucher: fn('financial_affairs/voucher_word', '获取凭证号', 2),
    financevoucherset: fn('financial_affairs/enter_proof', '录入', 2),
    financevouchercheck: fn('financial_affairs/voucherToBeEntered', '检查待录入', 2),
    financevoucherdelcheck: fn('financial_affairs/deleteCertificate', '删除待录入', 2),
    financevoucherget: fn('financial_affairs/index', '查凭证', 2),
    financevoucheredit: fn('financial_affairs/evidence', '编辑', 2),
    financevoucherstatus: fn('financial_affairs/financialConfirmation', '审核', 2),
    financevoucherdel: fn('financial_affairs/deleteVoucher', '删除', 2),

    financecurrent: fn('financial_affairs/current_account', '收支账', 2),
    financeauxiliary: fn('financial_affairs/getAuxiliaryCategory', '辅助分类', 2),
    financedaily: fn('financial_statistics/cash_daily', '现金日报', 2),
    financemonthly: fn('financial_statistics/monthly_financial_report', '月度财报', 2),
    financesummary: fn('financial_statistics/reportForm', '经营汇总', 2),

    // 用户
    user: fn('getuser', '用户信息', 5),

    userphoneparent: fn('parentAddressBook', '家长通讯录', 9),
    userphoneteach: fn('teacherAddressBook', '老师通讯录', 9),
    userphonegovernment: fn('governmentAddressBook', '政务通讯录', 9),
    userphonegovernmentadd: fn('addGovernmentAddressBook', '添加政务通讯录', 9),
    userphonegovernmentedit: fn('editGovernmentAddressBook', '编辑政务通讯录', 9),
    userphonegovernmentdel: fn('deleteGovernmentAddressBook', '删除政务通讯录', 9),
    usermybrief: fn('getPersonalStyle', '我的风采', 10),
    usermybriefset: fn('personalStyle', '设置', 10),

    userdutys: fn('JobDescription', '岗位职责', 11),
    userduty: fn('jobDescriptionDetails', '岗位职责', 11),
    userdutyset: fn('editJobExplain', '编辑', 11),

    userorg: fn('framework', '组织架构', 11),

    userhelpmanual: fn('manualList', '员工手册', 11),
    // 用户-我的考勤
    usermyatten: fn('MyAttendance', '我的考勤', 10),
    usermyattenpunch: fn('attendanceRecord', '打卡记录', 10),
    usermyattenleave: fn('leaveRecord', '请假记录', 10),
    usermyattenpic: fn('getBaseMap', '获取考勤图', 10),
    usermyattenpicset: fn('attendanceBaseMap', '设置考勤图', 10),
    // 用户-我的签字
    usermysign: fn('sign', '签字', 10),
    usermysignadd: fn('add_signature', '添加', 10),
    usermysigndel: fn('delete_signature', '删除', 10),
    // 用户-我的工资
    usermywages: fn('myWage', '我的工资', 11),
    // 用户-用户手册/帮助
    userhelp: fn('index', '帮助', 36),
    userhelpdet: fn('details', '详情', 36),
    // 用户-我的信息
    userinfologo: fn('editAvatars', '修改头像', 5),
    userinfonick: fn('editNickname', '修改昵称', 5),
    userinfophone: fn('replacementPhone', '更换手机号', 10),
    // 用户-幼教学堂
    userschoolmenu: fn('tool/classification', '导航栏', 30),
    userschoollist: fn('schoolroom/index', '列表', 30),
    userschooldet: fn('schoolroom/course_details', '详情', 30),
    userschooldir: fn('schoolroom/catalog', '目录', 30),
    userschooldirdet: fn('schoolroom/details', '目录详情', 30),
    // 用户-环创集
    environmentify: fn('innovation/classifiy', '分类获取', 30),
    environmentlist: fn('innovation/index', '列表', 30),
    environmentmy: fn('innovation/myInnovation', '我的', 30),
    environmentadd: fn('innovation/increase', '发布', 30),
    environmentedit: fn('innovation/editor', '编辑', 30),
    environmentdel: fn('innovation/delete', '删除', 30),
    environmentdet: fn('innovation/details', '详情', 30),
    environmentlike: fn('innovation/likes', '点赞取消点赞', 30),
    // 用户-加入集团
    userjoingroup: fn('joinGroup', '加入集团', 10),
    // 申请老师
    userjointeach: fn('joinTheGarden', '申请老师', 10),
    // 绑定微信
    usersetopenid: fn('setOpenid', '绑定微信', 5),

    // 考勤
    attensetnum: fn('setAttendanceDays', '设置园所月考勤天数', 3),

    // 表单
    table0000: fn('nursery/profitability/analysis', '学习利润分析表-设置'),

    // 获取
    getAllStaff: fn('getallstaff', '获取全部员工', 5),
    getAllParent: fn('getallparents', '获取全部家长', 5),
    getAllParents: fn('getallparentss', '获取全部家长', 5),
    getAllGroup: fn('getDepartmentEmployees', '获取集团员工', 5),
    getGoodsIfy: fn('getsuppliescategory', '获取物资分类', 5),
    getGoods: fn('getsupplies', '获取物资', 5),
    getGoodsSearch: fn('searchSupplies', '获取部分物资', 5),
    getApproval: fn('getApprovalPerson', '获取历史审批人', 3),
    getClass: fn('getclass', '获取班级', 5),
    getGoodsAll: fn('nursery/logistics/unitAndCate', '获取物资分类与单位'),
    getwx: fn('common/testToken', 'wx'),
    getLevel: fn('nursery/work/getmenu', '获取权限'),
    getGroup: fn('getgroup', '获取部门', 5),
    getjob: fn('getJob', '获取职位', 11),
    getdot: fn('pendingAudit', '小红点', 5),
    getclassonce: fn('getGradeClass', '获取年级下的班级', 5),
    getcountry: fn('getCountry', '获取国籍', 19),
    getconfigonce: fn('get_config', '根据类型获取配置', 5),
    getgroups: fn('getGroup', '搜索集团', 10)
  }

  // 202302 新增
  let a202302 = {
    visitset: fn('create', '来访登记', 17),
    visitleave: fn('leaving', '离园', 17)
  }
  let b202302 = {
    albumdel: fn('term_album/delete_album', '删除学期相册', 12),
    albumadds: fn('term_album/add_album_pictures', '快速添加自动识别', 12),
    recipesadd: fn('addRecipe', '添加食谱', 22),
    recipesedit: fn('editRecipe', '修改食谱', 22),
    recipesdel: fn('DeleteRecipe', '删除食谱', 22),
    classmy: fn('my_class_circle', '我的班级圈', 8),
    getclassteach: fn('GetTeacherClass', '获取班级', 5),
    semesterpersonadd: fn('plan/AddTermPlan', '添加修改', 12),
    semesterpersonlist: fn('plan/TermPlanList', '列表', 12),
    semesterpersondet: fn('plan/SemesterPlanDetails', '详情', 12),
    // 生源分析
    analysisstudentadd: fn('studentSourceAnalysis', '保存', 31),
    analysisstudent: fn('StudentSourceAnalysisList', '列表', 31),
    analysisstudentdel: fn('DeleteSourceAnalysis', '删除', 31),
    // 园所竞争分析
    analysiskindergaradd: fn('AddCompetitionAnalysis', '保存', 31),
    analysiskindergar: fn('CompetitionAnalysisList', '列表', 31),
    analysiskindergardel: fn('DeleteCompetitionAnalysis', '删除', 31),
    // 海报
    poster: fn('index', '列表', 32),
    posteradd: fn('addPoster', '保存/编辑', 32),
    posterdet: fn('PosterDetails', '详情', 32),
    posterinfo: fn('MyRegistrationInformation', '报名信息', 32),
    posterrecommed: fn('recommend', '推荐', 32),
    posterdel: fn('DeletePoster', '删除', 32),
  }

  // 202303 新增
  let b202303 = {
    // 园务 - 变更园所数据状态
    recordsettype: fn('setParkData', '设置状态', 27),
    recordgettype: fn('getParkData', '获取状态', 27),
    getlevelmenu: fn('nursery/common/ServiceManagement', '新权限'),

    attenleavecancel: fn('CancelLeave', '撤销请假', 15),

    myintegrallist: fn('PointsDetails', '积分记录', 33),
    myintegralgetlist: fn('index', '提现记录', 33),
    myintegraldet: fn('details', '提现记录详情', 33),
    myintegralget: fn('withdrawal', '提现', 33),

    leave: fn('index', '请假', 34),
    leaveagree: fn('agreement', '同意请假', 34),
  }

  let b202304 = {
    // 设备管理
    device: fn('index', '设备列表', 35),
    deviceadd: fn('add', '添加', 35),
    deviceedit: fn('edit', '编辑', 35),
    devicedel: fn('delete', '删除', 35),
    devicesync: fn('synchronization', '同步更新', 35),
    devicetype: fn('setup', '类型', 35),
    // 用户手册/帮助
    userhelptype: fn('getClassify', '获取分类', 36),
    userhelplist: fn('tabulation', '列表/搜索', 36),
    // 新权限
    viewlevelmenu: fn('nursery/common/nursery_menu', '功能权限'),
    viewlevelmenuset: fn('nursery/common/SettingsMenu', '设置'),
    // 经典吟诵
    chantgetify: fn('getClassify', '获取分类', 42),
    chant: fn('index', '列表', 42),
    chantadd: fn('Publishing', '发布', 42),
    chantlist: fn('clockInList', '打卡列表', 42),
    chantlistdet: fn('ClockInDetails', '打卡详情', 42),
    chantlistcomment: fn('comment', '打卡评论', 42),
    chantlistcomments: fn('moreComments', '打卡更多评论', 42),
    chantlike: fn('CheckInAndLike', '点赞', 42),
    chantunlist: fn('UncheckedList', '未打卡列表', 42),
    chantunlistpush: fn('Push', '未打卡推送', 42),
    chantchildlist: fn('StudentList', '打卡列表', 42),
    chantchilddet: fn('ListClockingInTimes', '打卡列表', 42),

    chantdet: fn('details', '详情', 42),
    chantgetclsify: fn('ClassroomChineseStudies', '获取班级分类', 42),
    chantdet2: fn('DetailsNationalStudies', '详情', 42),
    chantcheck: fn('ClassifyAndChangeCourses', '换课', 42),
    chantchecks: fn('ChangingClasses', '换课[all]', 42),
    chantgetallify: fn('getStudiesClassify', '获取分类', 42),
    chantprevstatus: fn('GetLastSelectedCategory', '上次选中分类', 42),

    chantvideo: fn('presentationList', '示范课', 37),
    chantvideodet: fn('DemoDetails', '示范课详情', 37),
    chantvideoadd: fn('PublishDemo', '发布示范课', 37),
    chantvideostatus: fn('shelves', '示范课上下架', 37),
    chantvideodel: fn('DeleteVideo', '示范课删除', 37),
    chantvideopay: fn('PurchaseVideo', '示范课下单', 37),
    chantvideomy: fn('DemonstrationVideoOrder', '我的示范课', 37),
    chantvideomydet: fn('DemonstrationVideoOrder', '我的示范课详情', 37),
    chantvideomypay: fn('payment', '我的示范课待支付', 37),

  }

  let b202305 = {
    clockinfo: fn('getAttendance', '考勤信息', 38),
    clockin: fn('attendance', '打卡', 38),
    clockdet: fn('AttendanceInformation', '出勤记录', 38),
    clockset: fn('SetAttendance', '考勤设置', 38),
    // 投票
    vote: fn('index', '投票列表', 39),
    voteplus: fn('CreateActivity', '添加/修改', 39),
    votesend: fn('release', '发布', 39),
    votedel: fn('DeleteActivity', '删除', 39),
    votedet: fn('EventDetails', '投票详情', 39),
    voteinfo: fn('ActiveUsers', '投票用户', 39),
    voteadd: fn('AddActiveUser', '发布作品', 39),
    votedetail: fn('WorkDetails', '作品详情', 39),
    voteup: fn('ballot', '作品投票', 39),
    votedelonce: fn('DeleteWork', '删除作品', 39),
    votewrite: fn('comment', '评论', 39),
    votecomment: fn('getComments', '评论列表', 39),
    // 家园联系册 模板1
    contact40: fn('index', '班级列表', 40),
    contact40list: fn('ObservationRecords', '记录列表', 40),
    contact40temp: fn('LibraryTemplates', '模板库', 40),
    contact40type: fn('workSituation', '工作情况', 40),
    contact40add: fn('AddObservationRecord', '添加', 40),
    contact40del: fn('deleteRecord', '删除', 40),
    contact40share: fn('share', '分享', 40),
    contact40det: fn('details', '详情', 40),
    contact40like: fn('CheckInAndLike', '点赞', 40),
    contact40comment: fn('comment', '评论', 40),
    contact40comments: fn('moreComments', '获取评论', 40),
    contact40gettype: fn('getHomeContactBook', '获取类型', 40),
    contact40settype: fn('SetHomeContactBook', '设置类型', 40),
  }

  let b202306 = {
    approvalMyrevoke: fn('revoke', '撤销已完成', 3),
    voteprice: fn('ObtainVotingPrice', '价格', 39),
    voterule: fn('rules_and_instructions', '投票规则', 39),
    votebuys: fn('SinglePurchaseDetails', '购买详情', 39),
    votepay: fn('CardPurchase', '支付', 39),
    voteorder: fn('orderList', '订单', 39),
    voteorders: fn('OrderDetails', '订单详情', 39),
    voteisvip: fn('GardenPackage', '获取', 39)
  }

  let b202308 = {
    babymyis: fn('ObtainPermission', '权限', 41),
    babymy: fn('GetBabyOnlineAmount', '价格', 41),
    babymyin: fn('opened', '已支付', 41),
    babymyout: fn('NotOpened', '未支付', 41),
    classeschildpicget: fn('ParentFacialRecognition', '获取家长考勤图', 15),
    classeschildpicadd: fn('UploadParentMap', '添加家长考勤图', 15),
    classeschildpicdel: fn('DeleteParentMap', '删除家长考勤图', 15),
  }

  api = { ...a202207, ...a202302 }
  loginApi = { ...b202207, ...b202302, ...b202303, ...b202304, ...b202305, ...b202306, ...b202308 }

  let check = (apiname) => {
    let name = api[apiname] || loginApi[apiname]
    if (name && name.api) {
      return [name.text, name.api]
    }
    return ['错误', null]
  }
  let search = (path) => {
    let obj = { ...api, ...loginApi }
    let r = {}
    for (let i in obj) {
      if (obj[i].api.indexOf(path) >= 0) {
        r[i] = obj[i]
      }
    }
    return r
  }

  return { api, loginApi, check, search }
})

demo.access('es6', demo_es6)
demo.access('css', demo_css)
demo.access('month', demo_month)
demo.access('$vx', demo_vx())
demo.access('pwd', demo_pwd)
demo.access('$map', DemoAMap)
demo.access('$error', [])
demo.access('errorinfo', () => {
  demo.$ctrl.c('', JSON.stringify(demo.$error))
})
demo.access('$err', demo.es6().errorinfo({
  url: demo.siteConfig.api.hps + '?type=error',
  size: demo.siteConfig.isgetbytab ? 20 : 0.5
}))

// window.addEventListener('error', (reason) => {
//   const { filename, message, error } = reason;
//   demo.$err.setMsg({ filename, message, error })
// })

let $md5 = window.md5
window.md5 = (str) => {
  let d = str = str.replace(/^\s+|\s+$/g, '')
  return $md5(d)
}


