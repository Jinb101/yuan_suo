import js from "../js/const";
// import link from './link'
import model from "../js/model";
import route from "../../router/index";
import Tools from "../../utils/index";
// import citys from '../../../static/js/e.json'
import { Toast, Dialog } from "vant";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg/dist/ffmpeg.min.js";
import seleHttp from './selfApi'
/* eslint-disable */

const link = demo.siteApi();
let apiTime = 0,
  apiPath = "",
  apiData = "";
let citys = [];
let loadupload = null;
let loaduploadstatus = false;

const ffmpeg = createFFmpeg({
  corePath: "/static/js/ffmpeg-core.js",
  log: false
});


// 分片
function splitFile(file, size) {
  return new Promise((resolve, reject) => {
    const fileChunks = [];
    let position = 0;

    const onLoadHandler = event => {
      const chunk = event.target.result;
      const newBlob = new Blob([chunk], { type: file.type });
      const newFileName = `_part${fileChunks.length + 1}${file.name}`;
      fileChunks.push({ blob: newBlob, fileName: newFileName });
      position += size;
      if (position < file.size) {
        readNextChunk();
      } else {
        resolve(fileChunks);
      }
    };

    const onErrorHandler = error => {
      reject(error);
    };

    const readNextChunk = () => {
      const fileReader = new FileReader();
      fileReader.onload = onLoadHandler;
      fileReader.onerror = onErrorHandler;
      const slice = file.slice(position, position + size);
      fileReader.readAsArrayBuffer(slice);
    };

    readNextChunk();
  });
}

async function compressVideo(inputFile, length, index,name) {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  console.log(inputFile);
  return new Promise(async (resolve, reject) => {
    const inputFileName = inputFile.name;
    // Write the input video file to FS
    ffmpeg.FS("writeFile", "input.mp4", new Uint8Array(await inputFile.arrayBuffer()));
    console.log(123);
    ffmpeg.setProgress(async ({ ratio }) => {
      const progress = (ratio * 100.0).toFixed();
      console.log(progress);
      if (progress !== "100" && progress >= "0") {
        Toast.loading({
          duration: 0,
          message: `压缩中 \n ${progress}%`,
          forbidClick: true
        });
      } else if (progress === "100") {
        // Call the next compression function
        // if (index < length - 1) {
        //   await compressVideo(fileChunks[index + 1], length, index + 1);
        // }
      }
    });

    const args = [
      "-i",
      "input.mp4",
      "-c:v",
      "libx264",
      "-b",
      "2000k",
      "-preset",
      "ultrafast",
      "output.mp4"
    ];
    await ffmpeg.run(...args);
            // Record the start time of compression
            const startTime = performance.now();

            // Calculate compression time
            const endTime = performance.now();
            const compressTime = ((endTime - startTime) / 1000).toFixed(2);
            console.log(`Compression time: ${compressTime} seconds`);

            // Read the compressed video file from FS
            const data = ffmpeg.FS("readFile", "output.mp4");
            const compressedVideoBlob = new Blob([data.buffer], { type: "video/mp4" });
            console.log(inputFileName);

            // Create a File object from the Blob
            const compressedVideoFile = new File(
              [compressedVideoBlob],
              inputFileName,
              { type: "video/mp4" }
            );
            resolve(compressedVideoFile)
            //         // 创建一个新的 FormData 对象
            // var formData = new FormData();
            // // formData.append('file', compressedVideoFile);
            // formData.append('blob_num', index);
            // formData.append('file_name', inputFileName);

            // // 发送 POST 请求
            // seleHttp.post('sharUpload', formData,{
            //   'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq'
            // })
            //   .then((response) => {
            //     console.log(response);
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //   });
            // 压缩完成后，解析 Promise
  });
}

// 上传篇
let upload = async (data, fn, error, progress) => {
  let url = link.loginApi.upload.api;
  let type = data.imgs.type.indexOf("image") < 0;
  let size = Math.ceil(data.imgs.size / 1024 / 1024);
  if (size >= 500) {
    error ? error({ msg: "文件过大" }) : null;
    return 0;
  }
  if (type && data.type === "video") {
    // const fileChunks = await splitFile(data.imgs, 50 * 1024 * 1024);
    // let fileFFegList = []
    // for (let index = 0; index < fileChunks.length; index++) {
    //   const curFile =   await compressVideo(fileChunks[index], fileChunks.length, index,data.imgs.name);
    //   fileFFegList.push(curFile)
    // }
    Toast.loading({
      duration: 0,
      message: `压缩中 `,
      forbidClick: true
    });
    const curFile = await  compressVideo(data.imgs)
    data.imgs = curFile;
    console.log(curFile,data.imgs,data);
  } else if (type && data.type === "img") {
    const img = await Tools.compressFile(data.imgs);
    data.imgs = img;
    data.type = "pdf";
  }

  if (!loaduploadstatus) {
    if (!loadupload || !loadupload.clear) {
      loadupload = Toast.loading({
        duration: 0,
        message: "上传中",
        forbidClick: true
      });
      loaduploadstatus = true;
    }
  }
  let tms = 1;
  let sr = setInterval(() => {
    tms++;
  }, 1000);

  let user = demo.$session.get("user", {});
  demo.ajax(js.api.http + url).upload(
    data,
    e => {
      demo.ajax(demo.siteConfig.api.hps + "?type=upload").post(
        {
          size,
          name: data.imgs.name || "上传",
          account: user.phone || user.account || "无账号",
          type: data.type,
          num: e.progress || 0,
          nid: user.n_id,
          token: demo.$local.get("token", ""),
          key: md5(data.imgs.name || ""),
          port: "admin",
          url: e.code === 200 ? e.data.data : "",
          tms
        },
        () => {}
      );
      if (e.code !== 2) {
        if (!loaduploadstatus) {
          loadupload && loadupload.clear && loadupload.clear();
          loadupload = null;
        }
        loaduploadstatus = false;

        if (sr) {
          clearInterval(sr);
          sr = null;
        }
      }

      if (e.code === 2) {
        let num = e.progress * 100;
        let l = num.toFixed(2);
        let ms = "";

        if (size > 20 && tms > 1 && num < 100 && num > 0) {
          let mb = size / ((e.progress * size) / tms) - tms;

          if (mb < 60) {
            ms = "预计" + Math.ceil(mb) + "秒完成";
          } else {
            ms = "预计" + Math.ceil(mb / 60) + "分完成";
          }
        }

        let err = "上传中" + +l + "%" + (ms ? ms : "");

        if (num < 0 && data.type === "video") {
          console.log("视频上传失败，上传超时");
          err = "上传超时";
          loadupload && loadupload.clear && loadupload.clear();
          loaduploadstatus = false;
          loadupload = null;
          Dialog.alert({
            message: err
          }).then(() => {});

          error ? error({ msg: err }) : null;
        }

        if (loadupload) {
          loadupload.message = err;
        }

        if (num > 99) {
          loaduploadstatus = false;
        }

        progress ? progress(l) : null;
      } else if (e.code === 200) {
        fn(e.data);
      } else {
        error ? error(e) : null;
      }
    },
    "",
    headers()
  );
};

let token = () => {
  let v = demo.$local.get("token", "");
  if (!v) {
    v = demo.siteConfig.tktoggle();
  }
  return v;
};
let financeToken = () => {
  return demo.$local.get("finance-token", "");
};

let headers = f => {
  if (!f) return {};
  let os = {
    access_token: token()
  };
  let finance_token = financeToken();
  if (finance_token) {
    os.finance_token = finance_token;
  }
  return os;
};

let waitpostcallback = (obj, fn) => {
  setTimeout(() => {
    post(
      obj.url,
      obj.data,
      e => {
        fn(e);
      },
      obj.fs
    );
  }, 500);
};
let waitpostdata = [];

let get = (url, data, fn, fs) => {
  demo.ajax(js.api.http + url).get(
    data,
    e => {
      fn(e);
    },
    "",
    headers(fs)
  );
};

let post = (url, data, fn, fs) => {
  let d = demo.copy(data);
  delete d.class_id;
  let keymd5 = md5(url + "-" + JSON.stringify(d));

  if (waitpostdata.indexOf(keymd5) >= 0) {
    waitpostcallback({ url, data, fs }, e => {
      fn(e);
    });
    return 0;
  }
  if (data.page) {
    waitpostdata.push(keymd5);
  }

  demo.ajax(js.api.http + url).post(
    data,
    e => {
      waitpostdata = waitpostdata.filter(s => {
        return s !== keymd5;
      });
      fn(e);
    },
    "json",
    headers(fs)
  );
};

let exit = f => {
  demo.$local.clear(["token", "finance-token"]);
  demo.siteConfig.tktoggle("clear");
  demo.$session.reset();
};
let load = null;
let loads = false;

let http = (
  name,
  data,
  fn,
  methods = "post",
  isLogin = false,
  successCode = [200]
) => {
  let m = ["get", "post"].indexOf(methods) >= 0;
  let method = methods;
  let ts = Date.now();
  let ntype = demo.siteConfig.nettype();
  let st = 800;
  if (ntype === "wifi" || ntype === "4g") {
    st = 3000;
  }
  if (
    apiTime + st > ts &&
    apiPath === name &&
    JSON.stringify(data) === JSON.stringify(apiData)
  ) {
    return 0;
  }
  setTimeout(() => {
    if (loads) return 0;
    load = Toast.loading({
      duration: 0
    });
  }, 1000);
  setTimeout(() => {
    // console.log(load);
    if (load) {
      load.clear();
      load = null;
    }
  }, 8000);
  apiTime = ts;
  apiPath = name;
  apiData = data;
  if (!m) {
    method = "post";
  }
  if (!link.api[name]) {
    isLogin = true;
  }
  let url = (isLogin ? link.loginApi[name] : link.api[name]) || "";
  if (!url) return 0;

  let v = window.demo.$local.all();
  let d = Object.assign({}, data, {
    n_id: v.nid
  });

  if (d.page && typeof d.limit === "undefined") {
    d.limit = 20;
  }

  if (isLogin) {
    d.access_token = v.token;
    if (!v.token) {
      d.access_token = demo.siteConfig.tktoggle();
    }

    if (name.indexOf("finance") >= 0) {
      d.finance_token = v["finance-token"];
    }
  }

  let params = demo.getUrl();

  let vr = params.group === "1";
  if (vr && !url.isgroup) {
    return model.info("集团端无法操作", 2);
  }

  if (params.debug) {
    console.log(url);
  }

  if (method === "post") {
    post(
      url.api,
      d,
      e => {
        loads = true;
        if (load) {
          load.clear();
          load = null;
          loads = false;
        }
        if (e.code !== 200) {
          let ms = e.err || e.msg || e;
          if (JSON.stringify(ms).length > 100) {
            let er = {
              接口: url.api,
              发送数据: d,
              返回信息: ms,
              请求时间: demo.timeout()
            };
            if ((er["返回信息"] + "").indexOf("登陆已过期") < 1) {
              if (demo.$error.length > 100) {
                demo.$error.splice(0, demo.$error.length - 100);
              }
              demo.$error.push(er);
              demo.$err.setMsg({ type: "error", ...er });
            }
          }
        }
        if (e.code === 0) {
          if (demo.$obj(e.err, true) === 3 && e.err.indexOf("Cannot") === 0) {
            return 0;
          }
          let err = e.msg || "当前网络较慢，请更换网络";
          if (demo.$obj(e.err, true) === 6 && e.err.msg) {
            err = e.err.msg;
          } else {
            if (e.err) {
              err = JSON.stringify(e.err);
            }
            if (err.indexOf("DOCTYPE html") >= 0) {
              err = "接口错误：" + e.data.statusText + ":" + url.api;
            }
          }
          if (err.indexOf("$refs.page") >= 0) {
            console.warn(err);
            return err;
          }
          return model.info(err, 2);
        }
        if (e.code === 401) {
          // demo.$local.set('login_path', window.location.hash)
          if (demo.siteConfig.isframe) {
            window.location.href = "../?id=" + v.nid + "#/login";
            return 0;
          }
          route.push("/login");
          exit(true);
          let msg =
            e.msg.indexOf("未登录") > -1
              ? "未登录，请登录"
              : "登录已过期，请重新登录";
          return model.info(msg);
        }
        if (e.code === 402) {
          // login_bind
          route.push("/apply_teacher");
          return 0;
        }
        if ([403, 405, 408].indexOf(e.code) >= 0) {
          route.push("/apply_status/" + e.code);
          return 0;
        }
        if (e.code === 409) {
          // demo.$local.set('login_path', window.location.hash)
          if (demo.siteConfig.isframe) {
            window.location.href = "../?id=" + v.nid + "#/login";
            return 0;
          }
          route.push("/login");
          exit(true);
          demo.$local.set("not_wx_admin", "1");
          return model.alert(
            e.msg || e.err || "用户未注册或未绑定微信",
            () => {}
          );
        }
        if (e.code === 444) {
          demo.$local.clear("finance-token");
          route.push("/finance");
        }
        if (e.code === 411 && e.msg.indexOf("注册") >= 0) {
          route.push("/login_reg");
        }
        if (successCode.indexOf(e.code) < 0) {
          if (name === "config" && e.code === 411 && !d.n_id) {
            return 0;
          }
          return model.info(e.msg || e.err);
        }
        if (demo.siteConfig.isgetbytab) {
          demo.$err.setMsg({
            api: url,
            time: demo.timeout("", "alls"),
            type: "api_tab",
            by: "通用-请求-请求api"
          });
        }
        fn(e.data, e.code, e);
      },
      isLogin
    );
  } else {
    get(
      url.api,
      d,
      e => {
        fn(e);
      },
      isLogin
    );
  }
};

let oncity = () => {
  return new Promise((resolve, reject) => {
    demo.siteConfig.citys(e => {
      citys = e;
      resolve(e);
    });
  });
};

let city = async (ids = [], type, callback) => {
  if (!citys.length) {
    await oncity();
  }
  if (!ids.length) {
    if (type) {
      let v = citys.map(s => {
        s.text = s.n;
        s.children = s.children.map(r => {
          r.text = r.n;
          r.children = r.children.map(q => {
            q.text = q.n;
            return q;
          });
          return r;
        });
        return s;
      });
      callback ? callback(v) : null;
      return v;
    }
    callback ? callback(citys) : null;
    return citys;
  }
  if (ids.length === 3) {
    let id = [];
    if (type === "zh") {
      // 汉字
      let b =
        citys.filter(r => {
          return r.n === ids[0];
        })[0] || {};
      if (!b.i) return id;
      id[0] = b.n;
      let c =
        b.children.filter(r => {
          return r.n === ids[1];
        })[0] || {};
      if (!c.i) return id;
      id[1] = c.n;
      let d =
        c.children.filter(r => {
          return r.n === ids[2];
        })[0] || {};
      if (!d.i) return id;
      id[2] = d.n;
    } else if (type === "id") {
      // id
      let e =
        citys.filter(r => {
          return r.i === +ids[0];
        })[0] || {};
      if (!e.i) return id;
      id[0] = e.n;
      let f =
        e.children.filter(r => {
          return r.i === +ids[1];
        })[0] || {};
      if (!f.i) return id;
      id[1] = f.n;
      let g =
        f.children.filter(r => {
          return r.i === +ids[2];
        })[0] || {};
      if (!g.i) return id;
      id[2] = g.n;
    } else {
      // 索引
      let a = citys[+ids[0]];
      id[0] = a.i;
      id[1] = a.children[+ids[1]].i;
      id[2] = a.children[+ids[1]].children[+ids[2]].i;
    }
    callback ? callback(id) : null;
    return id;
  }
};

let classes = id => {
  let a = [
    { name: "幼小衔接班", id: 1 },
    { name: "托班", id: 2 },
    { name: "小班", id: 3 },
    { name: "中班", id: 4 },
    { name: "大班", id: 5 }
  ];
  if (id) {
    if (id === true) {
      a = [{ name: "全部", id: "" }].concat(a);
    } else {
      a =
        a.filter(r => {
          return r.id === +id;
        })[0] || {};
    }
  }
  return a;
};

// 小红点
let isWwrkDot = (level, data, flag) => {
  let arr = {
    "272": "administration",
    "7": "binding_audit",
    "12": "staff_count",
    "271": "my_assessment_count|me_assessment_count",
    "6": "satisfaction",
    "426": "overstaffing",
    "415": "repair_count",
    "10": "receive|purchase",
    "469": "administration",
    "470": "staff_count|overstaffing",
    "5": "binding_audit|prompt_not_entered",
    "353": "prompt_not_entered"
  };
  let l = level
    .map(r => {
      return r.level;
    })
    .filter(s => {
      return arr[s];
    });
  if (l.length) {
    let a = l.map(s => {
      let o = arr[s].split("|");
      let len = o.map(r => {
        return data[r];
      });
      return len.concat(0).reduce((a, b) => {
        return a + b;
      }, 0);
    });
    if (flag)
      return a
        .map((r, v) => {
          return { num: r, level: l[v] };
        })
        .filter(s => {
          return s.num >= 0;
        });
    let max = a.concat(0).reduce((a, b) => {
      return a + b;
    }, 0);
    return max > 0 ? demo.rand(5) : 0;
  }
  return [];
};

export default {
  get,
  post,
  token,
  upload,
  exit,
  link,
  http,
  city,
  classes,
  isWwrkDot
};
