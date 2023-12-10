import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let prefix_title = ''
let after_title = ''
// eslint-disable-next-line
let link = demo.siteConfig.isframe

function routerObj(path, com, name, title, to = '', child) {
  let opt = {
    path: path,
    name: name,
    meta: {
      title: prefix_title + title + after_title,
      to: to,
      name: name,
      path: path
    }
  }
  if (process.env.NODE_ENV === 'development') {
    opt.component = resolve => require(['../views/' + com], resolve)
  } else {
    opt.component = () => import(/* webpackChunkName: "lib" */ '../views/' + com)
  }
  if (child !== undefined && child.length > 0) {
    opt.children = child
  }
  return opt
}
// information
const router = new Router({
  routes: [{
    path: '/',
    redirect: {
      name: "start"
    }
  },
  routerObj('/start', 'start/index.vue', 'start', ''),

  routerObj('/login', 'login/index.vue', 'login', '登录'),
  routerObj('/login1', 'login/lib/1.vue', 'login1', '登录'),
  routerObj('/login2', 'login/lib/2.vue', 'login2', '微信登录'),
  routerObj('/login_reg', 'login/reg.vue', 'loginReg', '注册'),
  routerObj('/login_reset', 'login/reset.vue', 'loginReset', '重置密码'),
  routerObj('/apply_teacher', 'login/apply.vue', 'loginapply', '申请老师'),
  routerObj('/apply_teacher/:tel', 'login/apply.vue', 'loginapply1', '申请老师'),
  routerObj('/apply_status', 'login/status.vue', 'loginstatus', '审核状态'),
  routerObj('/apply_status/:id', 'login/status.vue', 'loginstatus2', '审核状态'),

  routerObj('/index', 'index/index.vue', 'index', '主页'),
  routerObj('/notify', 'index/notify/index.vue', 'notify', '通知'),
  routerObj('/notify/:id&:type', 'index/notify/index.vue', 'notifys', '通知详情'),
  routerObj('/notify_add', 'index/notify/add.vue', 'notifyAdd', '发送通知'),

  routerObj('/task', 'index/task/index.vue', 'task', '任务'),
  routerObj('/task/:num', 'index/task/index.vue', 'tasks', '任务'),
  routerObj('/task_add', 'index/task/add.vue', 'taskAdd', '发布任务'),

  routerObj('/approval', 'index/approval/index.vue', 'approval', '审批'),
  routerObj('/approval_my', 'index/approval/my.vue', 'approvalMy', '我的审批'),
  routerObj('/approval_my/:id&:did&:child', 'index/approval/my.vue', 'approvalMys', '我的审批详情'),
  routerObj('/approval_send', 'index/approval/send.vue', 'approvalSend', '发起审批'),
  routerObj('/approval_send/:id&:ids', 'index/approval/send.vue', 'approvalSends2', '发起'),
  routerObj('/approval_send/:id', 'index/approval/send.vue', 'approvalSends', '发起'),

  routerObj('/census', 'index/census/index.vue', 'census', '出勤统计'),
  routerObj('/census/:id', 'index/census/index.vue', 'censuss', '出勤统计'),

  routerObj('/cute', 'index/cute/index.vue', 'cute', '精彩瞬间'),
  routerObj('/cute/:id', 'index/cute/index.vue', 'cutes', '精彩瞬间'),
  routerObj('/cute_add', 'index/cute/add.vue', 'cuteadd', '添加精彩瞬间'),

  routerObj('/info', 'index/info/index.vue', 'info', '园所资讯'),
  routerObj('/info/:id', 'index/info/index.vue', 'infos', '园所资讯详情'),
  routerObj('/info_add', 'index/info/add.vue', 'infoadd', '添加园所资讯'),

  routerObj('/attendance', 'index/attendance/index.vue', 'attendance', '我的出勤'),
  routerObj('/attendance_set', 'index/attendance/set.vue', 'attendanceset', '考勤设置'),

  routerObj('/class', 'class/index.vue', 'class', '班级圈'),
  routerObj('/class/:id&:did&:cid', 'class/index.vue', 'classs', '班级圈'),
  routerObj('/class/:id&:did', 'class/index.vue', 'classs1', '班级圈'),
  routerObj('/class/:id', 'class/index.vue', 'classs2', '班级圈'),
  routerObj('/class_add', 'class/add.vue', 'classadd', '发布班级圈'),
  routerObj('/class_add/:id', 'class/add.vue', 'classadd1', '发布班级圈'),

  routerObj('/finance', 'finance/index.vue', 'finance', '财务管理'),
  routerObj('/finance_record', 'finance/record/index.vue', 'financerecord', '录凭证'),
  routerObj('/finance_record/:type', 'finance/record/index.vue', 'financerecords', '录凭证'),
  routerObj('/finance_select', 'finance/select/index.vue', 'financeselect', '查凭证'),
  routerObj('/finance_bill', 'finance/select/bill.vue', 'financebill', '收支账'),

  routerObj('/finance_setting', 'finance/setting/index.vue', 'financesetting', '参数设定'),
  routerObj('/finance_classify', 'finance/setting/classify.vue', 'financeclassify', '分类管理'),
  routerObj('/finance_card', 'finance/setting/card.vue', 'financecard', '账户管理'),
  routerObj('/finance_customer', 'finance/code/customer.vue', 'financecustomer', '客户管理'),
  routerObj('/finance_supplier', 'finance/code/supplier.vue', 'financesupplier', '供应商管理'),
  routerObj('/finance_staff', 'finance/staff/index.vue', 'financestaff', '员工管理'),

  routerObj('/finance_account', 'finance/select/account.vue', 'financeaccount', '账户余额'),
  routerObj('/finance_daily', 'finance/select/daily.vue', 'financedaily', '现金日报'),
  routerObj('/finance_month', 'finance/select/month.vue', 'financemonth', '月度财报'),
  routerObj('/finance_year', 'finance/select/year.vue', 'financeyear', '期间财报'),

  routerObj('/user', 'user/index.vue', 'user', '我的'),
  routerObj('/tel_parent', 'user/phone/parent.vue', 'usertelparent', '家长通讯录'),
  routerObj('/tel_index', 'user/phone/index.vue', 'usertel', '老师通讯录'),
  routerObj('/tel_government', 'user/phone/government.vue', 'usertelgovernment', '政务通讯录'),

  routerObj('/my_brief', 'user/my/brief.vue', 'userbrief', '我的风采'),
  routerObj('/my_duty', 'user/my/duty.vue', 'userduty', '我的岗位职责'),
  routerObj('/my_attendance', 'user/my/attendance.vue', 'userattendance', '我的考勤'),
  routerObj('/my_autograph', 'user/my/autograph.vue', 'userautograph', '我的签名'),
  routerObj('/my_wages', 'user/my/wages.vue', 'userwages', '我的工资'),
  routerObj('/my_infos', 'user/my/infos.vue', 'userinfos', '我的资料'),
  routerObj('/my_info', 'user/my/info.vue', 'userinfo', '我的资料'),
  routerObj('/my_info_pwd', 'user/my/set_pwd.vue', 'userinfopwd', '密码变更'),
  routerObj('/my_info_tel', 'user/my/set_tel.vue', 'userinfotel', '手机号变更'),
  routerObj('/my_integral', 'user/my/integral.vue', 'userintegral', '我的积分'),
  routerObj('/my_device', 'user/my/device.vue', 'device', '设备管理'),

  routerObj('/event_repair', 'user/event/repair.vue', 'userrepair', '维修申请'),
  routerObj('/event_framework', 'user/event/framework.vue', 'userframework', '组织架构'),
  routerObj('/event_help', 'user/event/help.vue', 'userhelp', '用户手册'),
  routerObj('/event_help/:id&:type', 'user/event/help.vue', 'userhelp2', '用户手册'),
  routerObj('/event_help/:id', 'user/event/help.vue', 'userhelp3', '用户手册'),
  routerObj('/event_wx', 'user/event/wx.vue', 'userwx', '微信绑定'),
  routerObj('/event_apply', 'user/event/apply.vue', 'userapply', '加入集团'),
  routerObj('/event_kindergarten', 'user/event/kindergarten.vue', 'userkindergarten', '切换园所'),
  routerObj('/event_bind', 'user/event/bindwx.vue', 'userbind', '绑定微信'),

  routerObj('/school', 'user/school/index.vue', 'userschool', '幼教学堂'),
  routerObj('/school/:type&:id', 'user/school/index.vue', 'userschool1', '幼教学堂'),
  routerObj('/school/:type', 'user/school/index.vue', 'userschool2', '幼教学堂'),

  routerObj('/environment', 'user/environment/index.vue', 'userenvironment', '环创集'),
  routerObj('/environment/:type&:id', 'user/environment/index.vue', 'userenvironment1', '环创集'),
  routerObj('/environment/:type', 'user/environment/index.vue', 'userenvironment2', '环创集'),
  routerObj('/environment_my', 'user/environment/my.vue', 'userenvironmentmy', '我的环创集'),
  routerObj('/environment_my/:type&:id', 'user/environment/my.vue', 'userenvironmentmy1', '我的环创集'),
  routerObj('/environment_my/:type', 'user/environment/my.vue', 'userenvironmentmy2', '我的环创集'),

  routerObj('/help_manual', 'user/help/manual.vue', 'usermanual', '员工手册'),

  routerObj('/work', 'work/index.vue', 'work', '工作'),
  routerObj('/work/:id', 'work/index.vue', 'works', '工作'),

  routerObj('/work_semester', 'work/work/semester.vue', 'worksemester', '学期工作'),
  routerObj('/work_semester_person', 'work/work/semester_person.vue', 'worksemesterperson', '学期工作'),
  routerObj('/work_month', 'work/work/month.vue', 'workmonth', '月工作'),
  routerObj('/work_week', 'work/work/week.vue', 'workweek', '周工作'),

  routerObj('/work_duty', 'work/duty/index.vue', 'workduty', '岗位职责'),
  routerObj('/work_duty/:id', 'work/duty/index.vue', 'workdutys', '岗位职责'),

  routerObj('/parenting_class', 'education/index.vue', 'parentingclass', '幼儿课堂'),
  routerObj('/education/:id', 'education/index.vue', 'education10', '家庭是孩子的第一学校'),
  routerObj('/educations/:id', 'education/detail.vue', 'education1', '家庭是孩子的第一学校'),
  routerObj('/address', 'address/index.vue', 'address', '收货地址'),
  routerObj('/educationorder', 'education/order.vue', 'educationorder', '家庭教育订单'),
  routerObj('/educationorder/:id', 'education/order.vue', 'educationorders', '家庭教育订单'),

  routerObj('/work_purchase', 'work/logistics/purchase.vue', 'workpurchase', '采购管理'),
  routerObj('/work_purchase/:type', 'work/logistics/purchase.vue', 'workpurchases', '采购管理'),
  routerObj('/work_receive', 'work/logistics/receive.vue', 'workreceive', '领用管理'),
  routerObj('/work_receive/:type', 'work/logistics/receive.vue', 'workreceives', '领用管理'),
  routerObj('/work_supplies', 'work/logistics/supplies.vue', 'worksupplies', '物资列表'),
  routerObj('/work_visit', 'work/logistics/visit.vue', 'workvisit', '来访登记'),
  routerObj('/work_visitcode/:id', 'work/logistics/visitcode.vue', 'workvisitcode', '来访登记二维码'),

  routerObj('/work_foodorder/:type&:status&:id', 'work/logistics/foodorder.vue', 'workfoodorder', '食材订单详情'),
  routerObj('/work_foodorder/:type&:status', 'work/logistics/foodorder.vue', 'workfoodorder1', '食材订单'),
  routerObj('/work_foodorder/:type', 'work/logistics/foodorder.vue', 'workfoodorder2', '食材订单'),
  routerObj('/work_foodorder', 'work/logistics/foodorder.vue', 'workfoodorder3', '食材订单'),

  routerObj('/work_medication', 'work/health/medication.vue', 'workmedication', '喂药管理'),
  routerObj('/work_medication/:id', 'work/health/medication.vue', 'workmedications', '喂药管理'),
  routerObj('/work_recipes/:id', 'work/health/recipes.vue', 'workrecipes2', '老师食谱'),
  routerObj('/work_recipes', 'work/health/recipes.vue', 'workrecipes', '宝宝食谱'),
  routerObj('/work_recipes_history/:id', 'work/health/recipes_history.vue', 'workrecipeshistory', '老师历史食谱'),
  routerObj('/work_recipes_history', 'work/health/recipes_history.vue', 'workrecipeshistory2', '宝宝历史食谱'),

  routerObj('/work_attendance', 'work/class/attendance.vue', 'workattendance', '班级考勤'),
  routerObj('/work_attendance/:id', 'work/class/attendance.vue', 'workattendances', '班级考勤'),
  routerObj('/work_grow', 'work/class/grow.vue', 'workgrow', '成长任务'),
  routerObj('/work_grow/:id&:type&:tid', 'work/class/grow.vue', 'workgrow1', '成长任务详情'),
  routerObj('/work_grow/:id&:type', 'work/class/grow.vue', 'workgrow2', '成长任务详情'),
  routerObj('/work_grow/:id', 'work/class/grow.vue', 'workgrow3', '成长任务详情'),
  routerObj('/work_album', 'work/class/album.vue', 'workalbum', '学期相册'),
  routerObj('/work_album/:id', 'work/class/album.vue', 'workalbums', '学期相册'),
  routerObj('/work_leave', 'work/class/leave.vue', 'workleave', '请假审批'),

  routerObj('/work_baby', 'work/class/baby.vue', 'workbaby', '宝贝奖分'),
  routerObj('/work_baby/:type&:id', 'work/class/baby.vue', 'workbaby1', '宝贝奖分'),
  routerObj('/work_baby/:type', 'work/class/baby.vue', 'workbaby2', '宝贝奖分'),

  routerObj('/work_reward', 'work/class/reward.vue', 'workrewards', '宝贝奖分'),
  routerObj('/work_reward/:id', 'work/class/reward.vue', 'workrewards2', '宝贝奖分'),
  routerObj('/work_timetable', 'work/class/timetable.vue', 'worktimetable', '班级课表'),
  routerObj('/work_rewardrule', 'work/class/reward_rule.vue', 'workrewardrule', '宝宝奖分规则'),
  routerObj('/work_connection', 'work/class/connection.vue', 'workconnection', '家园联系册'),
  routerObj('/work_connection/:id&:his', 'work/class/connection.vue', 'workconnections1', '家园联系册'),
  routerObj('/work_connection/:id', 'work/class/connection.vue', 'workconnections2', '家园联系册'),

  // 家园联系册 模板 20230515
  routerObj('/connection', 'work/connection/index.vue', 'connection1', '家园联系册'),
  routerObj('/connection/:type&:id&:his', 'work/connection/index.vue', 'connection2', '家园联系册'),
  routerObj('/connection/:type&:id', 'work/connection/index.vue', 'connection3', '家园联系册'),
  routerObj('/connection/:type', 'work/connection/index.vue', 'connection4', '家园联系册'),

  routerObj('/work_integral', 'work/class/integral.vue', 'workintegral', '积分记录'),
  routerObj('/work_integralrank', 'work/class/integral_rank.vue', 'workintegralrank', '积分榜'),
  routerObj('/work_parent', 'work/class/parent.vue', 'workparent', '家长入驻/绑定核验'),
  routerObj('/work_parent/:id', 'work/class/parent.vue', 'workparents', '家长入驻/绑定核验'),
  routerObj('/work_chant', 'work/class/chant.vue', 'workchant', '国学'),
  routerObj('/work_chant/:sid&:tid&:id&:videoid', 'work/class/chant.vue', 'workchant0', '国学'),
  routerObj('/work_chant/:sid&:tid&:id', 'work/class/chant.vue', 'workchant1', '国学'),
  routerObj('/work_chant/:sid&:tid', 'work/class/chant.vue', 'workchant2', '国学'),
  routerObj('/work_chant_video', 'work/class/chant_video.vue', 'workchant3', '国学示范课'),
  routerObj('/work_chant_video/:id', 'work/class/chant_video.vue', 'workchant4', '国学示范课'),

  routerObj('/work_recruit', 'work/recruit/index.vue', 'workrecruit', '招生工作'),
  routerObj('/work_recruit/:type&:id', 'work/recruit/index.vue', 'workrecruits1', '招生工作'),
  routerObj('/work_recruit/:type', 'work/recruit/index.vue', 'workrecruits2', '招生工作'),

  routerObj('/work_kindergarten', 'work/affairs/kindergarten.vue', 'workkindergarten', '园所风采'),
  routerObj('/work_kindergarten/:type', 'work/affairs/kindergarten.vue', 'workkindergartens', '园所风采'),
  routerObj('/work_teacher', 'work/affairs/teacher.vue', 'workteacher', '老师入驻审批'),
  routerObj('/work_teacher/:type', 'work/affairs/teacher.vue', 'workteachers', '老师入驻审批'),
  routerObj('/work_organization', 'work/affairs/organization.vue', 'workorganization', '编制管理'),
  routerObj('/work_organization/:id', 'work/affairs/organization.vue', 'workorganizations', '编制管理'),
  routerObj('/work_recruitteach', 'work/affairs/recruit.vue', 'workrecruitteach', '招聘管理'),
  routerObj('/work_recruitteach/:id', 'work/affairs/recruit.vue', 'workrecruitteach2', '招聘管理'),
  routerObj('/work_address', 'work/affairs/address.vue', 'workaddress', '热线地址'),
  routerObj('/work_affairsdata', 'work/affairs/affairsdata.vue', 'workaffairsdata', '数据管理'),
  routerObj('/work_menulevel', 'work/affairs/menulevel.vue', 'workmenulevel', '功能管理'),

  routerObj('/management_baby', 'work/management/baby/index.vue', 'managementbaby', '宝贝在线'),
  routerObj('/management_baby/:id', 'work/management/baby/index.vue', 'managementbabys', '宝贝在线'),

  routerObj('/management_class', 'work/management/class/index.vue', 'managementclass', '班级管理'),
  routerObj('/management_classlist', 'work/management/class/list.vue', 'managementclasslist', '班级列表'),
  routerObj('/management_classlist/:type&:id', 'work/management/class/list.vue', 'managementclasslist1', '班级名单'),
  routerObj('/management_classlist/:type', 'work/management/class/list.vue', 'managementclasslist2', '班级列表'),
  routerObj('/management_classsplit', 'work/management/class/class.vue', 'managementclassclass', '已分班'),
  routerObj('/management_classsplit/:id&:type', 'work/management/class/class.vue', 'managementclassclass2', '已分班'),
  routerObj('/management_classsplit/:id', 'work/management/class/class.vue', 'managementclassclass3', '已分班'),
  routerObj('/management_classnot', 'work/management/class/not_class.vue', 'managementclassnotclass', '未分班'),
  routerObj('/management_classnot/:id', 'work/management/class/not_class.vue', 'managementclassnotclass2', '未分班'),

  routerObj('/management_record', 'work/management/record/index.vue', 'managementrecord', '园所数据'),
  routerObj('/management_record2', 'work/management/record/old.vue', 'managementrecord2', '园所数据'),
  // routerObj('/management_achievements', 'work/management/achievements/index.vue', 'managementachievements', '绩效积分管理'),
  routerObj('/management_achievements_set', 'work/management/achievements/set.vue', 'managementachievementsset', '绩效考核表管理'),
  routerObj('/management_achievements_set/:id', 'work/management/achievements/set.vue', 'managementachievementsset2', '绩效考核表管理'),
  routerObj('/management_achievements_wait', 'work/management/achievements/wait.vue', 'managementachievementswait', '待我考核表'),
  routerObj('/management_achievements_wait/:type&:id', 'work/management/achievements/wait.vue', 'managementachievementswait2', '待我考核表'),
  routerObj('/management_achievements_my', 'work/management/achievements/my.vue', 'managementachievementsmy', '我的考核表'),
  routerObj('/management_achievements_my/:type&:id', 'work/management/achievements/my.vue', 'managementachievementsmy2', '我的考核表'),

  routerObj('/management_integral_level', 'work/management/integral/level.vue', 'managementintegrallevel', '积分榜'),
  routerObj('/management_integral_level/:type', 'work/management/integral/level.vue', 'managementintegrallevel2', '积分榜'),
  routerObj('/management_integral_my', 'work/management/integral/my.vue', 'managementintegralmy', '我的积分'),
  routerObj('/management_integral', 'work/management/integral/index.vue', 'managementintegral1', '奖分'),
  routerObj('/management_integral/:id', 'work/management/integral/index.vue', 'managementintegral2', '扣分'),
  routerObj('/management_integral_file', 'work/management/integral/file.vue', 'managementintegralfile', '积分管理制度'),

  routerObj('/work_banner', 'work/banner/index.vue', 'workbanner', '轮播图'),
  routerObj('/work_survey', 'work/survey/index.vue', 'worksurvey', '调研表'),
  routerObj('/work_survey_list', 'work/survey/list.vue', 'worksurveylist', '调研记录'),
  routerObj('/work_repair', 'work/repair/index.vue', 'workrepair', '维修申报'),
  routerObj('/work_repair/:type&:id', 'work/repair/index.vue', 'workrepair1', '维修申报'),
  routerObj('/work_repair/:type', 'work/repair/index.vue', 'workrepair2', '维修申报'),

  routerObj('/form', 'form/index.vue', 'form', '表单管理'),
  routerObj('/form_analysis', 'form/analysis/index.vue', 'formanalysis', '分析表'),
  routerObj('/form_analysis/:id', 'form/analysis/index.vue', 'formanalysiss', '分析表'),

  routerObj('/temp_info', 'temp/info.vue', 'tempinfo', '资讯模板'),

  routerObj('/vote', 'work/vote/index.vue', 'vote', '投票'),
  routerObj('/vote/:id&:cid', 'work/vote/index.vue', 'vote1', '投票'),
  routerObj('/vote/:id', 'work/vote/index.vue', 'vote2', '投票'),
  routerObj('/vote1', 'work/vote/index.vue', 'vote3', '投票'),
  routerObj('/vote2', 'work/vote/index.vue', 'vote4', '投票'),
  routerObj('/votelist', 'work/vote/list.vue', 'votelist', '投票订单'),

  routerObj('/system', 'user/system/index.vue', 'system', '系统设置'),

  // 旧版本外链地址跳转
  routerObj('/article_detail/:id', 'index/info/index.vue', 'a01', '资讯详情'),
  routerObj('/work_teach', 'work/affairs/teacher.vue', 'a02', '老师入驻审批'),
  routerObj('/form_baby_here', 'old/a03.vue', 'a03', '家园联系册'),
  routerObj('/user_classroom', 'user/school/index.vue', 'a04', '幼教学堂'),
  routerObj('/educations/:id', 'education/detail.vue', 'education1', '家庭是孩子的第一学校'),
  routerObj('/link_food/:id', 'old/a05.vue', 'a05', '跳转食材小店'),
  routerObj('/notice_detail/:id&:type', 'index/notify/to.vue', 'notifys2', '通知详情'),

  routerObj('/visit', 'h5/visit.vue', 'visit', '来访登记'),
  routerObj('/visitleave', 'h5/visit_leave.vue', 'visitleave', '离园登记'),

  routerObj('/babypay', '10007/babypay.vue', 'babypay', '宝宝缴费'),

  routerObj('/wechat', 'wechat/index.vue', 'wechat', '微信'),
  routerObj('/c', '404/c.vue', 'c', '测试'),
  // routerObj('/q', '404/q.vue', 'q', '测试'),
  // routerObj('/ces', '404/ces.vue', 'ces', '测试'),
  // routerObj('/v', '404/v.vue', 'v', '测试'),
  routerObj('/*', '404/index.vue', 'error', '404')
  ]
})

const val = ['/login', '/login_reg', '/login_reset', '/login1', '/login2', '/visit', '/visitleave', '/event_help', '/start']
let valtoname = ['userbind', 'userhelp2', 'userhelp']
// 路由拦截，如果没有登录 则返回登录页面
router.beforeEach((to, from, next) => {
  // eslint-disable-next-line
  let token = demo.siteConfig.tktoggle()

  if (valtoname.indexOf(to.name) >= 0) {
    next()
    return 0
  }
  let href = window.location.href
  href = href.split('#/')

  if (to.name === 'login' && href[1] !== 'login' && href[1] !== 'event_bind') {
    console.log('进入' + href[1], to.name);
    // eslint-disable-next-line
    demo.es6().readytojump('set', { type: 'link', link: window.location.href })
    // eslint-disable-next-line
    demo.siteConfig.tktoggle('clear')
    // eslint-disable-next-line
    demo.$session.reset()
    if (window.location.href.indexOf('/new/') > 0) {
      window.location.href = window.location.href.replace('/new', '')
    }
  }
  // 检测是否外链
  // 检测是否分享h5
  // 检测不检测token的页面

  // 检测token
  if (!token && val.indexOf(to.path) < 0) {
    return next('/login')
  }
  next()
  // let path = '/' + to.path.split('/')[1]
  // if (val.indexOf(path) >= 0) {
  //   next()
  // } else {
  //   let token = window.demo.$local.get('token', '')
  //   if (token) {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // }
})

router.afterEach(route => {
  // 从路由的元信息中获取 title 属性
  if (route.meta.title) {
    document.title = route.meta.title;
    // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      const hackIframe = document.createElement('iframe');
      hackIframe.style.display = 'none';
      hackIframe.src = process.env.NODE_ENV === 'development' ? '../../../' : './' + 'static/html/fixIosTitle.html?r=' + Math.random();
      document.body.appendChild(hackIframe);
      setTimeout(_ => {
        document.body.removeChild(hackIframe)
      }, 300)
    }
  }
})

export default router
