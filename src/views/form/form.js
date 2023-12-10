/* eslint-disable */
let time = demo.timeout('', 'object')

let analysis = {
  // 学期利润分析表
  semester_manage: () => {

    let fns = (title, u = '') => {
      return { title, value: '', unit: u || '元/学期' }
    }
    let fn = (title, add = false, children = []) => {
      return {
        title, all: 0, mix: 0, add, children
      }
    }
    let fn2 = (title) => {
      return { title, num: '', price: '', unit: '元/学期' }
    }

    let a = fn('收入', true, [
      { ...fns('开班数', '个'), undel: true },
      {
        ...fns('在读宝宝', '个'), undel: true
      },
      fns('生活费总额'),
      fns('保教费总额'),
      fns('兴趣班总额')
    ])
    let b = fn('房租', true, [
      fns('幼儿园租金'),
      fns('幼儿园物业费'),
      fns('员工宿舍')
    ])
    let c = fn('薪酬测算', true, [
      fn2('园长'),
      fn2('园长助理'),
      fn2('副园长'),
      fn2('班主任'),
      fn2('保育员'),
      fn2('配班老师'),
      fn2('招生主管'),
      fn2('招生专员'),
      fn2('后勤主管'),
      fn2('后勤主任'),
      fn2('主厨'),
      fn2('帮厨'),
      fn2('保安'),
      fn2('会计'),
      fn2('出纳'),
      fn2('保健医生'),
    ])
    let d = fn('社保测算', false, [
      fns('购买社保人数', '个'),
      fns('购买总额')
    ])
    let e = fn('伙食成本', false, [
      fns('宝宝伙食预算'),
      fns('教师伙食预算')
    ])
    let f = fn('其他费用', true, [
      fns('水费'),
      fns('电费'),
      fns('气费'),
      fns('暖气费'),
      fns('节日费'),
      fns('慰问金'),
      fns('招生提成奖金'),
      fns('团建费用'),
      fns('培训学习'),
      fns('办公耗材'),
      fns('活动'),
      fns('交通'),
      fns('其他'),
    ])

    c.sum = true

    let arr = [a, b, c, d, e, f]
    return JSON.parse(JSON.stringify(arr))
  },
  semester_manag_sum: (arr = [], callback) => {
    let fn = (title, value = '') => {
      return { title, value }
    }

    let summax = (e, len = -1) => {
      let s = (e.children || []).map((s, v) => {
        return v > len ? !isNaN(s.value) ? +s.value : 0 : 0
      })
      if (s.length) {
        return demo.array(s).sum(0)
      }
      return 0
    }
    let summax2 = (e) => {
      let s = (e.children || []).map(s => {
        let p = !isNaN(s.price) ? +s.price : 0
        return p
      })
      if (s.length) {
        return demo.array(s).sum(0)
      }
      return 0
    }

    let data = JSON.parse(JSON.stringify(arr))

    let dmax = data.map((s, v) => {
      if (s.sum) {
        return summax2(s)
      }
      return summax(s, v > 0 ? v === 3 ? 0 : -1 : 1)
    })

    let amax = demo.array(dmax.concat(0)).sum(0)
    let d2max = JSON.parse(JSON.stringify(dmax))
    d2max.splice(0, 1)
    let emax = data[0].all - demo.array(d2max.concat(0)).sum(0)

    let ndata = data.map((s, v) => {
      let m = amax === 0 ? 1 : amax
      return {
        all: dmax[v],
        mix: ((dmax[v] / m) * 100).toFixed(2) * 1
      }
    })

    if (callback) {
      callback(ndata)
    }

    let a = [
      fn('保教费总额', (data[0].children[3].value || 0) + '元'),
      fn('生活费总额', (data[0].children[2].value || 0) + '元'),
      fn('房屋物业占比', ndata[1].mix + '%'),
      fn('宝宝人数', (data[0].children[1].value || 0) + '个'),
      fn('工资总额', ndata[2].all + '元'),
      fn('工资占比', ndata[2].mix + '%'),
      fn('核算利润', amax + '元'),
      fn('实际利润', emax + '元'),
    ]
    return JSON.parse(JSON.stringify(a))
  }
}

let params = (name) => {
  let a = demo.getUrl()
  if (name) {
    return a[name] || ''
  }
  return a
}

export default {
  version: '1.0.0',
  params,
  analysis
}
