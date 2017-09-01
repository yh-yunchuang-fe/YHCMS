import * as md5 from './md5';
import { localTimer } from './LocalTimer';
//@yu 2016.12.14 加入配置签名参数
var signConfig = {
  signstr:"YH601933yCzc",         //设置签名key
  channel:"wechat",                //渠道类型
  platform:"wechat",                //平台类型
  v:"2.0.1",                         //版本号
  isGroupon: false                  //是否为拼团项目的API     //@yu 2016.12.17 新增判断是否是拼团api签名
};

function _sign(map) {
  var json = null;
  var keys = Object.keys(map);
  var count = keys.length;
  keys.sort();
  var signstr = signConfig.signstr;
  for (var i = 0; i < count; i++) {
    var k = keys[i];
    var v = map[k];
    if (k == "json") {
      json = v;
    } else {
      signstr = signstr + k + v;
    }
  }
  if (json) {
    signstr = signstr + json;
  }
  return md5.md5(signstr);
}

function suffix(map) {
  var timestamp = Math.round(localTimer.getLocalTime());
  map['timestamp'] = timestamp;

  //@yu 2016.12.17 拼团的API是不需要其他参数加入一起签名
  if(!signConfig.isGroupon){
    var channel = signConfig.channel;
    var v = signConfig.v;
    var platform = signConfig.platform;
    map['platform'] = platform;
    map['channel'] = channel;
    map['v'] = v;
  }
  var signStr = _sign(map);
  delete map['json'];
  return Object.assign({sign:signStr},map);
}


/*--------------------------------------
 api名称：setSignConfig
 api作用：配置签名公有参数
 参数名：strChannel
 参数类型：string
 参数取值范围：["APP","WECHAT","GROUPON"]
 参数默认值："WECHAT"
 参数作用：不同的api渠道
 --------------------------------------*/
//@yu 2016.12.14 加入配置签名参数
function setSignConfig(strChannel) {
  var strUpperChannel = strChannel.toUpperCase();
  switch (strUpperChannel){
    case 'APP': {
      signConfig.signstr = "YONGHUI601933";
      signConfig.channel = "ios";
      signConfig.platform = "ios";
      signConfig.isGroupon = false;
      break;
    }
    case 'WECHAT': {
      signConfig.signstr = "YH601933yCzc";
      signConfig.channel = "wechat";
      signConfig.platform = "wechat";
      signConfig.isGroupon = false;
      break;
    }
    case "GROUPON": {
      signConfig.signstr = "YONGHUI601933";
      signConfig.isGroupon = true;
      break;
    }
    case "YHPARTNER": {
      signConfig.signstr = "YH601933yCzc";
      signConfig.channel = "android";
      signConfig.platform = "android";
      signConfig.isGroupon = false;
      break;
    }
    case "WECHATMINIPROGRAM" : {
      signConfig.signstr = "YH601933yCzc";
      signConfig.channel = "wechatminiprogram";
      signConfig.platform = "wechatminiprogram";
      signConfig.isGroupon = false;
      break;
    }
    default:
      break;
  }
}

/*--------------------------------------
 api名称：setVersion
 api作用：设置签名中的版本号
 参数名：strVer
 参数类型：string
 参数默认值："2.0.1"
 参数作用：版本号
 --------------------------------------*/
//@yu 2016.12.15 加入配置版本号
function setVersion(strVer) {
  if((typeof strVer) == 'string'){
    signConfig.v = strVer;
  }
}

/*--------------------------------------
 api名称：getUrlQuery
 api作用：设置签名中的版本号
 参数名：name
 参数类型：string
 参数作用：URL上参数名

 参数名：url
 参数类型：string
 参数作用：URL
 --------------------------------------*/
//@yu 2016.12.15 加入配置版本号
function getUrlQuery(name,url) {
  if(!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getDisPlayTime () {
  const date = new Date(Date.now())
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

function monitorApiError (params) {
  const api = 'https://log.yonghuivip.com/yhhy-logclient/httplog'
  const _params = Object.assign({},params,{
    _platform: 'wechatminiprogram',
    _type: 'monitorApiError',
    displayTime: getDisPlayTime()
  })
  wx.request({
    url: api,
    data: JSON.stringify(_params),
    method: 'POST',
    success: function (res) {
      console.info(res)
    }
  })
}

module.exports =  {
    suffix,
    setSignConfig,
    setVersion,
    getUrlQuery,
    monitorApiError
}
