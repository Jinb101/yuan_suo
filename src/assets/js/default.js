let env = process.env.NODE_ENV === 'development'
let fn = (arr) => {
  let a = arr.map(s => {
    let obj = s[4] || {}
    let o = {
      path: s[0] === '' ? '' : ('/' + s[0]),
      text: s[1] || '',
      icon: s[2] || '',
      level: s[3] || 0,
      num: 0,
      theme: s[5] || '1', // ['','紫','蓝','绿','浅绿']
      id: s[6] || '',
      ...obj
    }
    return o
  })
  return JSON.parse(JSON.stringify(a))
}
// eslint-disable-next-line
let config = demo.siteConfig

let icons = (num, type, cnum) => {
  return config.icon(num, type, '.png', cnum)
}

let levelmenu = (name, levels = [], newmenulevel = [], noopen = []) => {
  let u = name.filter(r => {
    return !!r.text
  })
  if (u.length) {
    let level = []
    if (Array.isArray(levels)) {
      level = levels.map(s => { return s.id })
    }
    let v = u.filter(s => {
      return s.level < 1 || level.indexOf(s.level) >= 0
    })
    if (newmenulevel.length > 0) {
      v = v.filter(r => {
        if (r.menulevel) {
          return newmenulevel.indexOf(r.menulevel) < 1
        }
        return true
      })
    }
    let ns = JSON.parse(JSON.stringify(v.map((k, v) => {
      k.$index = v
      return k
    })))
    if (noopen.length) {
      ns = ns.filter(r => {
        return noopen.indexOf(r.id + '') < 0
      })
    }
    // eslint-disable-next-line
    // if (!demo.siteConfig.isvalidateopen) { }
    return ns
  }
  return []
}

let menuindex = (arr, level, index = 0) => {
  let v = arr.filter(r => {
    return r.level === +level
  })
  if (v.length && v[index]) {
    return v[index].$index
  }
  return -1
}
// id 3000
let index = {
  // 主页-bar
  bar: fn([
    ['notify', '通知', 102, 0, { color: ["#b6aaf6", "#8487e9"], id: 3000 }],
    ['task', '任务', 100, 0, { color: ["tomato"], id: 3001 }],
    ['approval', '审批', 101, 0, { color: ["#9ed5fe", "#6e95ea"], id: 3002 }],
  ]),
  approval: [
    fn([
      ['', '发起采购', 301, 0, { type: 1, id: 2000 }],
      ['', '发起领用', 302, 0, { type: 2, id: 2001 }],
      ['', '发起借款', 303, 0, { type: 4, id: 2002 }],
      ['', '发起报销', 304, 0, { type: 3, id: 2003 }],
      ['', '发起请假', 305, 0, { type: 5, id: 2004 }],
      // ['', '决议审核', 0, 0, { type: 6, id: 2010 }]
    ]),
    fn([
      ['', '采购', 306, 0, { id: 2005 }],
      ['', '领用', 307, 0, { id: 2006 }],
      ['', '报销', 308, 0, { id: 2007 }],
      ['', '借款', 309, 0, { id: 2008 }],
      ['', '出勤审批', 310, 0, { id: 2009 }],
    ])
  ]
}
// 底部 menu
let menu = fn([
  ['index', '主页', 11, 0, { icons: 1, id: 1000 }],
  ['class', '班级圈', 51, 0, { icons: 5, id: 1001 }],
  ['work', '工作', 41, 0, { icons: 4, id: 1002 }],
  ['user', '我的', 31, 0, { icons: 3, id: 1003 }],
])

// 用户
let userdef = fn([
  ['tel_parent', '家长通讯录', icons(1, 'n', 501), 0, { id: 4000 }],
  ['tel_index', '老师通讯录', icons(2, 'n', 502), 0, { id: 4001 }],
  ['tel_government', '政务通讯录', icons(3, 'n', 503), 0, { id: 4002 }],
  ['my_brief', '个人风采', icons(4, 'n', 504), 0, { id: 4003 }],
  ['my_duty', '岗位职责', icons(5, 'n', 505), 0, { id: 10104 }],
  ['event_repair', '维修申请', icons(6, 'n', 506), 0, { id: 10203 }],
  // ['my_attendance', '我的考勤', icons(7, 'n', 507), 0, { id: 4006 }],
  ['environment', '环创集', icons(8, 'n', 518), 0, { id: 4007 }],
  ['my_wages', '我的工资', icons(10, 'n', 508), 0, { id: 4008 }],
  ['help_manual', '员工手册', icons(12, 'n', 509), 0, { id: 4009 }],
  ['school', '幼教学堂', icons(12, 'n', 510), 0, { id: 4010 }],
  ['my_autograph', '签名模板', icons(11, 'n', 511), 0, { id: 4011 }],
  ['', '', '', 0],
  ['event_framework', '组织架构', icons(13, 'n', 512), 0, { id: 4012 }],
  ['event_help', '用户手册', icons(16, 'n', 513), 0, { id: 4013 }], // 帮助
  // ['my_infos', '我的资料', icons(14, 'n', 514), 0, { id: 4014 }],
  ['form', '表单列表', icons(15, 'n', 515), 0, { id: 4015 }],
  ['', '', '', 0],
  ['event_wx', '微信绑定', icons(17, 'n', 516), 0, { id: 4016 }],
  ['work_recipes/2', '我的食谱', icons(27, 'n', 517), 0, { food: true, id: 4017 }],
  // ['', '教育局管理', '', 0],
  ['my_device', '设备管理', icons(27, 'n', 519), 0, { debug: true, id: 4018 }],
  // ['', '我的备课', '', 0],
  // ['temp_info', '资讯模板', '', 0],
])

let wobj = { square: true, default: true }
let qhys = fn([['event_kindergarten', '切换园所', icons(18, 'n', 519), 0, { id: 4019 }]])
if (config.moreid) {
  userdef = userdef.concat(qhys)
}
let user = (levels = []) => {
  let arr = levelmenu(userdef.map(k => {
    return { ...k, ...wobj, theme: '4' }
  }), levels)
  // eslint-disable-next-line
  let is_debug_open = demo.$local.get('debug-page-status', '')
  // eslint-disable-next-line
  let checkdebugid = ['7', '71'].indexOf(demo.$local.get('nid')) >= 0
  if (!env && +is_debug_open !== 1) {
    if (!checkdebugid) {
      arr = arr.filter(r => {
        return !r.debug
      })
    }
  }
  return arr
}

// 财务
let finance = {
  index: fn([
    ['finance_record/1', '录收入', icons(1, 'finance'), 0, { id: 5000 }],
    ['finance_record/2', '录支出', icons(1, 'finance'), 0, { id: 5001 }],
    ['finance_select', '查凭证', icons(2, 'finance'), 0, { id: 5002 }],
    ['finance_bill', '收支账', icons(3, 'finance'), 0, { id: 5003 }],
    ['finance_setting', '参数设定', icons(4, 'finance'), 0, { id: 5004 }],
    ['finance_account', '账户余额', icons(104, 'finance'), 0, { id: 5005 }],
    ['finance_daily', '现金日报', icons(6, 'finance'), 0, { id: 5006 }],
    ['finance_month', '月度财报', icons(6, 'finance'), 0, { id: 5007 }],
    ['finance_year', '期间财报', icons(7, 'finance'), 0, { id: 5008 }],
  ]),
  setting: fn([
    ['finance_classify', '分类管理', '', 0, { sub: '支出/收入分类 新增/删除', id: 5009 }],
    ['finance_card', '账户管理', '', 0, { sub: '账户 变更/新增', id: 5010 }],
    ['finance_customer', '客户管理', '', 0, { sub: '客户 变更/新增', id: 5011 }],
    ['finance_supplier', '供应商管理', '', 0, { sub: '供应商 变更/新增', id: 5012 }],
    ['finance_staff', '员工管理', '', 0, { sub: '员工 变更/新增', id: 5013 }]
  ])
}

// menulevel 新版权限控制
// 工作
let works = {
  work: fn([
    ['work_semester', '学期工作', icons(1000, 'work'), 377, { id: 10000 }],
    ['work_month', '月工作', icons(1003, 'work'), 363, { id: 10001 }],
    ['work_week', '周工作', icons(1001, 'work'), 354, { id: 10002 }],
    ['', '后勤工作', icons(1002, 'work'), 468, { id: 10003 }],
    ['', '保健工作', icons(1004, 'work'), 469, { id: 10004 }],
    ['', '班级工作', icons(1005, 'work'), 5, { id: 10005 }],
    ['work_recruit', '招生工作', icons(1006, 'work'), 4, { id: 10006 }],
    ['', '园务工作', icons(2003, 'work'), 470, { id: 10007 }],
    ['finance', '财务工作', icons(1007, 'work'), 0, { id: 10008, menulevel: 1003 }],
  ]),
  manage: fn([
    ['management_record', '园所数据', icons(2001, 'work'), 274, { id: 10100 }],
    ['', '绩效积分管理', icons(2002, 'work'), 271, { id: 10101, menulevel: 1001 }],
    ['management_baby', '宝贝在线', icons(2004, 'work'), 8, { id: 10102, menulevel: 1007 }],
    ['management_class', '班级管理', icons(2005, 'work'), 424, { id: 10103 }],
    ['work_duty', '岗位职责', icons(2006, 'work'), 427, { id: 10104 }],
    ['parenting_class', '幼儿课堂', icons(2007, 'work'), 0, {menulevel: 1003}],
  ]),
  other: fn([
    ['work_banner', '轮播图', icons(3001, 'work'), 438, { id: 10200 }],
    ['info', '园所资讯', icons(3002, 'work'), 439, { id: 10201 }],
    ['work_survey', '调研表', icons(3003, 'work'), 6, { id: 10202 }],
    ['work_repair', '维修申报', icons(3004, 'work'), 415, { id: 10203 }],
  ]),
  class: fn([
    ['management_classlist', '班级列表', '', 0, { id: 10300 }],
    ['management_classsplit', '已分班列表', '', 0, { id: 10301 }],
    ['management_classnot', '未分班列表', '', 0, { id: 10302 }],
  ]),
  baby: fn([
    ['work_reward', '宝贝奖分', '', 432, { id: 10400 }],
    ['work_rewardrule', '宝宝奖分规则', '', 467, { id: 10401 }],
    ['work_integral', '积分记录', '', 441, { id: 10402 }],
    ['work_integralrank', '积分榜', '', 442, { id: 10403 }],
  ]),
  integral: fn([
    ['to:tx', '提现', icons(22, 'n', 1001), 0, { ...wobj, id: 10500 }, '2'],
    ['to:jl', '提现记录', icons(22, 'n', 1000), 0, { ...wobj, id: 10501 }],
    ['to:in', '积分记录', icons(22, 'n', 1002), 0, { ...wobj, id: 10502 }],
  ]),
  chant: fn([
    ['to:1', '示范课视频', icons(0, 'n', 7021), 0, { ...wobj }],
    // ['to:2', '国学共育', icons(0, 'n', 510), 0, { ...wobj }],
    ['to:2', '吟诵示例', icons(0, 'n', 7022), 0, { ...wobj }],
    ['to:3', '朗读音频', icons(0, 'n', 510), 0, { ...wobj }],
    ['to:4', '授课 PPT', icons(0, 'n', 509), 0, { ...wobj }],
    ['to:5', '教参', icons(0, 'n', 7023), 0, { ...wobj }],
  ]),
  atten: fn([
    ['to:1', '打卡记录', icons(0, 'n', 600), 0, { ...wobj }, '2'],
    ['to:2', '请假记录', icons(0, 'n', 601), 0, { ...wobj }, '2'],
    ['to:3', '上传考勤图', icons(0, 'n', 7009), 0, { ...wobj }, '2'],
    ['to:4', '考勤范围', icons(0, 'n', 602), 0, { ...wobj }, '2'],
    ['to:5', '历史出勤', icons(0, 'n', 7019), 0, { ...wobj }, '2'],
    ['approval_send/4', '请假', icons(0, 'n', 603), 0, { ...wobj }, '2'],
  ]),
  children: {
    '10003': fn([
      ['work_purchase', '采购管理', icons(19, 'n', 1), 10, { ...wobj, id: 20100 }],
      ['work_receive', '领用管理', icons(20, 'n', 2), 10, { ...wobj, id: 20101 }],
      ['work_supplies', '物资列表', icons(23, 'n', 3), 10, { ...wobj, id: 20102 }],
      ['work_visit', '来访登记', icons(25, 'n', 4), 413, { ...wobj, id: 20103 }],
      ['work_visitcode/1', '入园二维码', icons(22, 'n', 6), 413, { ...wobj, id: 20104 }],
      ['work_visitcode/0', '离园二维码', icons(22, 'n', 7), 413, { ...wobj, id: 20105 }],
      ['work_foodorder', '食材订单', icons(26, 'n', 8), 413, { ...wobj, id: 20106 }],
    ]),
    '10004': fn([
      ['work_recipes', '宝贝食谱', icons(28, 'n', 101), 9, { ...wobj, id: 20200 }],
      ['work_medication', '喂药管理', icons(29, 'n', 102), 272, { ...wobj, id: 20201 }],
    ]),
    '10005': fn([
      ['work_parent', '家长入园审批', icons(38, 'n', 201), 7, { ...wobj, id: 20300 }],
      ['work_connection', '家园联系册', icons(36, 'n', 202), 353, { ...wobj, menulevel: 1006, id: 20301 }],
      ['work_attendance', '班级考勤', icons(45, 'n', 203), 466, { ...wobj, id: 20302 }],
      ['work_baby', '宝贝奖分', icons(32, 'n', 204), 432, { ...wobj, id: 20303 }],
      ['work_timetable', '班级课表', icons(37, 'n', 205), 378, { ...wobj, id: 20304 }],
      ['work_grow', '成长任务', icons(30, 'n', 206), 422, { ...wobj, id: 20305 }],
      ['work_album', '学期相册', icons(31, 'n', 207), 430, { ...wobj, menulevel: 1004, id: 20306 }],
      ['work_leave', '请假审批', icons(208, 'n', 208), 466, { ...wobj, id: 20307 }],
      ['work_style', '班级风采', icons(31, 'n', 207), 467, { ...wobj, id: 20308 }],
      ['work_chant', '国学', icons(0, 'n', 7004), 802, { ...wobj, id: 20308 }],
      ['vote2', '投票系统', icons(0, 'n', 7024), 803, { ...wobj, id: 20309 }],
    ]),
    '10007': fn([
      ['work_kindergarten', '园所风采', icons(39, 'n', 301), 2, { ...wobj, id: 20400 }],
      ['work_teacher', '老师入园审批', icons(41, 'n', 302), 12, { ...wobj, id: 20401 }],
      ['work_organization', '编制管理', icons(43, 'n', 303), 426, { ...wobj, id: 20402 }],
      ['work_recruitteach', '招聘管理', icons(42, 'n', 304), 273, { ...wobj, id: 20403 }],
      ['work_address', '热线与地址', icons(40, 'n', 305), 2, { ...wobj, id: 20404 }],
      ['work_affairsdata', '数据管理', icons(36, 'n', 306), 0, { ...wobj, id: 20405 }],
      ['work_menulevel', '功能管理', icons(0, 'n', 7016), 0, { ...wobj, id: 20406 }],
      ['attendance_set', '考勤设置', icons(0, 'n', 602), 0, { ...wobj, id: 20407 }],
      ['vote1', '投票系统', icons(0, 'n', 7024), 803, { ...wobj, id: 20309 }],
      ['votelist', '投票订单', icons(0, 'n', 508), 803, { ...wobj, id: 20309 }],
      ['babypay', '宝贝缴费管理', icons(0, 'n', 1), 0, { ...wobj, boss: true, id: 5000 }]
      // ['', '员工资料', '', 0],
    ]),
    '10101': fn([
      ['management_achievements_my', '我的考核表', icons(24, 'work', 401), 271, { ...wobj, menulevel: 1001 }, '3', 20500],
      ['management_achievements_wait', '待我考核表', icons(25, 'work', 402), 271, { ...wobj, menulevel: 1001 }, '3', 20501],
      ['management_achievements_set', '制定绩效表', icons(26, 'work', 403), 0, { ...wobj, menulevel: 1001 }, '3', 20502],
      ['management_integral', '奖分', icons(20, 'work', 404), 0, { ...wobj, menulevel: 1001 }, '2', 20503],
      ['management_integral/2', '扣分', icons(21, 'work', 405), 0, { ...wobj, menulevel: 1001 }, '2', 20504],
      ['management_integral_my', '我的积分', icons(22, 'work', 406), 0, { ...wobj, menulevel: 1001 }, '2', 20505],
      ['management_integral_level', '积分榜', icons(23, 'work', 407), 0, { ...wobj, menulevel: 1001 }, '2', 20506],
      ['management_integral_file', '积分管理制度', icons(34, 'n', 408), 0, { ...wobj, menulevel: 1001 }, '2', 20507],
    ])
  }
}

let work = (type, levels = [], newmenulevel = [], level2 = {}) => {
  let olevel = level2.noopen || []
  if (!isNaN(type)) {
    return levelmenu(works.children[type], levels, newmenulevel, olevel)
  }
  return levelmenu(works[type], levels, newmenulevel, olevel)
}

let workname = (id) => {
  let a = (arr, id) => {
    return arr.filter(r => {
      return r.id === +id
    })[0] || {}
  }
  let arr = [...works.manage, ...works.work, ...works.other]
  return a(arr, id).text || ''
}

let form = (path = '') => {
  let a = fn([
    ['form_analysis', '分析表', 'newspaper-o', 0, {
      children: fn([
        ['semester_management', '幼儿园学期利润分析表', '', 0, { del: true }],
        ['student', '幼儿园生源分析表', '', 0],
        ['kindergarten_compete', '幼儿园园所竞争分析表', '', 0, { add: true }],
        // ['semester_management_group', '集团学期利润分析表', '', 0, { del: true }]
      ])
    }],
    // ['', '经营表', 'label-o', 0, {
    //   children: fn([
    //   ])
    // }],
    // ['', '数据表', 'chart-trending-o', 0, {
    //   children: fn([
    //   ])
    // }],
  ]).map((s, v) => {
    s.value = v
    return s
  })
  if (path !== '') {
    a = a.filter(r => {
      return r.path.indexOf(path) >= 0
    })
  }
  return JSON.parse(JSON.stringify(a))
}

// 9-2 秋
// 3-8 春
// eslint-disable-next-line
let t = demo.timeout('', 'array')
let semester = {
  year: t[0],
  semester: (t[1] >= 9 || t[1] <= 2) ? 2 : 1
}

let record_year = (num = 20, isdis = false) => {
  let a = []
  for (let i = 0; i < num; i++) {
    let year = t[0] - i
    let dis = year === t[0] && +t[1] <= 2
    let dis2 = year === t[0] && +t[1] < 10
    let sms = '季学期'
    a.push({
      name: year + '年',
      text: year + '年',
      value: year,
      disabled: isdis ? false : (dis && dis2),
      children: [
        { name: '春' + sms, value: 1, text: '春' + sms, disabled: isdis ? false : dis, },
        { name: '秋' + sms, value: 2, text: '秋' + sms, disabled: isdis ? false : dis2 },
      ]
    })
  }
  return a
}

let record = {
  tab: [
    { t: "在读人数", c: ["人"], a: "0", type: "1" },
    { t: "在册人数", c: ["人"], a: "1", type: "2" },
    { t: "出勤率", c: ["%"], e: "查看班级出勤率", type: "3", a: "2" },
    { t: "食材", c: ["元"], e: "编辑", type: "food", a: 3, tp: "1" },
    { t: "费用", c: ["元"], e: "编辑", type: "money", a: 3, tp: "6" },
    {
      t: "退费",
      c: ["元", "个"],
      e: "编辑",
      type: "money_ret",
      a: 3,
      tp: "7",
    },
    { t: "水", c: ["元", "吨"], f: true, a: 4, tp: "2", type: "102" },
    { t: "电", c: ["元", "度"], f: true, a: 4, tp: "3", type: "103" },
    { t: "气", c: ["元", "方"], f: true, a: 4, tp: "4", type: "104" },
    { t: "幼儿伙食费", c: ["元"], f: true, a: 4, tp: "5", type: "105" },
    { t: "员工伙食费", c: ["元"], f: true, a: 4, tp: "6", type: "106" },
    { t: "工资", c: ["元"], f: true, a: 4, tp: "7", type: "107" },
    { t: "社保", c: ["元"], f: true, a: 4, tp: "8", type: "108" },
  ].map(s => {
    s.data = []
    s.url = ''
    return s
  }),
  api: [
    "recordread",
    "recordreg",
    "recordatten",
    "recordfood",
    "recorddata",
  ],
  year: record_year(),
  year2: record_year(10, true)
}

let qrcode = {
  info: () => {
    // eslint-disable-next-line
    let id = demo.$local.get('nid')
    return config.api.url + '?id=' + id + '#/visit'
  },
  leave: () => {
    // eslint-disable-next-line
    let id = demo.$local.get('nid')
    return config.api.url + '?id=' + id + '#/visitleave'
  }
}

export default {
  index, menu, user, finance, work, levelmenu, works, form, semester, menuindex, workname, record, qrcode
}
