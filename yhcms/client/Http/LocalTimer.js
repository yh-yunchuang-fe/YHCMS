import { md5 } from './md5';
class LocalTimer {
  constructor() {
    this.localtime = null;
    this.signConfig = {
      signstr : "YH601933yCzc",
      channel : "wechatminiprogram",
      platform : "wechatminiprogram",
      isGroupon : false,
      v:'4.0.4'
    };
  }

  _sign(map) {
    var json = null;
    var keys = Object.keys(map);
    var count = keys.length;
    keys.sort();
    var signstr = this.signConfig.signstr;
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

  suffix(map) {
    var timestamp = Math.round(new Date().getTime());
    map['timestamp'] = timestamp;

    //@yu 2016.12.17 拼团的API是不需要其他参数加入一起签名
    if (!this.signConfig.isGroupon) {
      var channel = this.signConfig.channel;
      var v = this.signConfig.v;
      var platform = this.signConfig.platform;
      map['platform'] = platform;
      map['channel'] = channel;
      map['v'] = v;
    }
    var signStr = this._sign(map);
    delete map['json'];
    return Object.assign({ sign: signStr }, map);
  }

  /**
   * public
   * 每分钟更新一次
   */
  startLocalTimer(baseURL) {
    if(!!this.localTimer) return;
    this._updateLocalTime(baseURL);
    this.localTimer = setInterval(()=>{
      this._updateLocalTime(baseURL);
    },60 * 1000);
  }

  /**
   * private
   */
  _updateLocalTime(baseURL) {
    return new Promise((resolve,reject)=>{
      const signedOBJ = this.suffix({
      });
      const url = `${baseURL}app/commonconfig${_jsonToQueryString(signedOBJ)}`;
      wx.request({
        url,
        method: 'GET',
        success: (res) => {
          if (res.data && res.data.now) {
            this.localtime = res.data.now;
          } else {
            this.localtime = new Date().getTime();
          }
          resolve();
        },
        fail: (res) => {
          resolve
          this.localtime = new Date().getTime();
          resolve();
        },
        complete: function (res) {
          // complete
        }
      });
    })
  }

  /**
   * public
   */
  stopLocalTimer() {
    clearTimeout(this.localTimer);
  }

  /**
   * public
   */
  getLocalTime() {
    return this.localtime || new Date().getTime();
  }

}

function _jsonToQueryString(json) {
  return '?' +
    Object.keys(json).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    }).join('&');
}


const localTimer = new LocalTimer();

module.exports = {
  localTimer
}
