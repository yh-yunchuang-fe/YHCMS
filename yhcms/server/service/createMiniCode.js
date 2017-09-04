import { getToken, getwxacode } from '../../api.json';
import { APPID, APP_SECRET, BASE_URL } from '../../secret.json';
import { paramGet } from '../utils/fetch';
import fetch from 'node-fetch';
import { uplaodPath } from '../../config.json';
import path from 'path';
import fs from 'fs';
import { upload2qiniu } from '../utils/upload2qiniu';
import { MiniCode, DBimage } from '../../universal/collections';
import { exec } from 'child_process';

function createMiniCode(params, _res) {
  const url = getToken.replace('APPID', APPID).replace('SECRET', APP_SECRET);
  const store_code_url = 'https://activity.yonghuivip.com/api/invitecodeofcsx';
  const sendData = {
    shopId: params.storeId
  };
  console.log(sendData);
  paramGet(store_code_url, sendData).then((res) => {
    console.log(res);
    if (res.code === 0) {
      params.code = res.data;
      if (!global.access_token) {
        console.log(url);
        const jsonBody = {
          grant_type: 'client_credential',
          appid: APPID,
          secret: APP_SECRET
        };
        paramGet(url, jsonBody).then((res) => {
          global.access_token = res.access_token;
          getCodeUrl(params, _res);
        });
      } else {
        getCodeUrl(params, _res);
      }
    } else {
      _res.setHeader('Content-Type', 'application/json');
      _res.end(JSON.stringify({
        code: '2000',
        error: '门店邀请码不存在，请到中台生成后点击'
      }))
    }
  });

}

function getCodeUrl(params, _res) {
  const now = Date.now();
  const tmpImage_path = path.join(uplaodPath, 'uploads/tmp/', `${now}.jpeg`);
  const url = getwxacode.replace('ACCESS_TOKEN', global.access_token);
  const jsonBody = {
    path: `pages/scanbuyhome/index?code=${params.code}&shopid=${params.storeId}`
  };
  console.log(`小程序码路径 ====> ${jsonBody.path}`);
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(jsonBody)
  }).then((res) => {
    return res.buffer();
  }).then((buf) => {
    const file = {
      path: tmpImage_path,
      name: `${now}.jpeg`,
      meta: {
        proj: '门店小程序码'
      }
    };
    fs.createWriteStream(tmpImage_path).write(buf, Meteor.bindEnvironment(() => {
      upload2qiniu(file, Meteor.bindEnvironment(function(ret) {
        console.log('小程序码已上传至七牛云服务');
        console.log(`sellerId ${params.sellerId}`);
        console.log(`门店名称 ${params.storeName}`);
        if (MiniCode.find({ storeId: params.storeId }).count() === 0) {
          MiniCode.insert({
            storeId: params.storeId,
            code: params.code,
            miniCodeUrl: `${BASE_URL}${ret.key}`,
            createdAt: Date.now()
          });
          DBimage.insert({
            fileId : '',
            projId : params.projId,
            percent : 100,
            uploading : false,
            ext : 'jpeg',
            extension : 'jpeg',
            extensionWithDot : '.jpeg',
            meta : {
                projId : params.projId
            },
            mime : 'image/jpeg',
            'mime-type' : 'image/jpeg',
            cityId: params.cityId,
            sellerId: params.sellerId,
            name : `${params.storeName}.jpeg`,
            size : '',
            type : 'image/jpeg',
            src : `${BASE_URL}${ret.key}`,
            updateAt : Date.now()
          });
          exec(`rm -rf ${tmpImage_path}`);
        }
        _res.setHeader('Content-Type', 'application/json');
        _res.end(JSON.stringify({
          code: '0000'
        }))
      }));
    }))
  })
}

export default createMiniCode;
