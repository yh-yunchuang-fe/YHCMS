const Utils = require('./utils.js');
// const fetch = require('node-fetch');

class Http {
  constructor() {
    this.instance = null;
    this.access_token = null;
    this.wechatunionid = null;
    this.appid = null;
    this.sdk_version = null;
    this.wechat_version = null;
    this.app_version = null;
    this.ticket = null;
  }

  /*--------------------------------------
  api名称：setConfig
  api作用：初始化http请求【根据不同渠道等信息初始化不同http请求】
  参数名：objConfig
  参数类型：Object
  参数下属性：
      1.属性名：   channel    -------》     渠道
        属性作用： 后端接口不同渠道 主要分【"APP"，"WECHAT"】等
      2.属性名：   version    -------》     版本号
        属性作用： 设置api签名的版本号
      3. ---



  --------------------------------------*/
  //@yu 2016.12.14 加入扩展接口多端API
  setConfig(objConfig){
    //先对【null，undefined，'', 0】等做一次判定  这些传入的都使用默认微信商城http配置
    let bLegalParam = false;
    if(!!objConfig && ((typeof objConfig) == "object" )){
        if((objConfig instanceof String) || (objConfig instanceof Date) ||
          (objConfig instanceof Array) || (objConfig instanceof Number) ||
          (objConfig instanceof Boolean) || (objConfig instanceof Function)){
          bLegalParam = false;
        }else{
          bLegalParam = true;
        }
    }

    //设置签名公有参数
    if(bLegalParam && objConfig.channel){
      Utils.setSignConfig(objConfig.channel);
    }

    //设置签名公有参数版本信息
    if(bLegalParam && objConfig.version) {
      Utils.setVersion(objConfig.version);
    }
  }



  setAccessToken(access_token) {
    this.access_token = access_token;
  }

  setTicket(ticket) {
    this.ticket = ticket;
  }

  getTicket() {
    return this.ticket;
  }

  setAppID(appid) {
    this.appid = appid;
  }

  setUnionID(wechatunionid) {
    this.wechatunionid = wechatunionid;
  }

  setSDKVersion(sdkVersion) {
    this.sdk_version = sdkVersion;
  }

  setWechatVersion(wechatVersoin) {
    this.wechat_version = wechatVersoin;
  }

  setAppVersion(appVersion) {
    this.app_version = appVersion;
  }

  get(options) {
    const {
      url,
      params,
      headers
    } = options;
    let newParmas = Object.assign({}, params);
    if(this.access_token) {
      newParmas.access_token = this.access_token;
    }
    if(this.appid) {
      newParmas.appid = this.appid;
    }
    if(this.wechatunionid) {
      newParmas.wechatunionid = this.wechatunionid;
    }
    if(this.sdk_version) {
      newParmas.sdk_version = this.sdk_version;
    }
    if(this.wechat_version) {
      newParmas.wechat_version = this.wechat_version;
    }
    if(this.app_version) {
      newParmas.app_version = this.app_version;
    }
    let signedObj =  Utils.suffix(newParmas);
    if(this.access_token) {
      signedObj.access_token = this.access_token;
    }
    if(this.wechatunionid) {
      signedObj.wechatunionid = this.wechatunionid;
    }
    newParmas = Object.assign(signedObj,params);
    const paramsString = _jsonToQueryString(newParmas);
    const api = `${url}${paramsString}`;
    const fetchConfig = {
      mode:'no-cors',
      credentials: 'same-origin'
    };
    if(!!headers) {
      fetchConfig.headers = headers;
    }
    return fetch(api, {
      method: 'GET',
      credentials: 'same-origin'
    }).then((res) => {
      return res.json();
    }).catch((err) => {
      console.log(err);
    });
  }

  post(options) {
    const {
      url,
      params
    } = options;
    let newParmas = Object.assign({}, params);
    if(this.access_token) {
      newParmas.access_token = this.access_token;
    }
    if(this.appid) {
      newParmas.appid = this.appid;
    }
    if(this.wechatunionid) {
      newParmas.wechatunionid = this.wechatunionid;
    }
    if(this.sdk_version) {
      newParmas.sdk_version = this.sdk_version;
    }
    if(this.wechat_version) {
      newParmas.wechat_version = this.wechat_version;
    }
    if(this.app_version) {
      newParmas.app_version = this.app_version;
    }
    newParmas.json = JSON.stringify(params);
    let signedObj = Utils.suffix(newParmas);
    if(this.access_token) {
      signedObj.access_token = this.access_token;
    }
    if(this.wechatunionid) {
      signedObj.wechatunionid = this.wechatunionid;
    }
    const paramsString = _jsonToQueryString(signedObj);
    const api = `${url}${paramsString}`;
    return new Promise((resolve,reject) => {
        fetch(api, {
          data: JSON.stringify(params),
          method: 'POST',
          success: function(res){
              resolve(res);
          },
          fail: function(res) {
            // fail
            console.log(res);
            reject(res);
          },
          complete: function(res) {
            // complete
          }
        })
    })
  }

   static getInstance() {
    if(!this.instance) {
      this.instance = new Http();
    }
    return this.instance;
  }
}

const http = Http.getInstance();



function _jsonToQueryString(json) {
  return '?' +
    Object.keys(json).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    }).join('&');
}


export default http;
// module.exports =  http;
