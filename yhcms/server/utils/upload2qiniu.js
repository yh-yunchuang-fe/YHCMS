import qiniu from 'qiniu';
import secret from '../../secret.json';
import crypto from 'crypto';
import fetch from 'node-fetch';
qiniu.conf.ACCESS_KEY = secret.QINIU_ACCESS_KEY;
qiniu.conf.SECRET_KEY = secret.QINIU_SECRET_KEY;
const bucket = secret.BUNKET;

function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(`${bucket}:${key}`);
  return putPolicy.token();
}

var client = new qiniu.rs.Client();

function getFile(key, cb) {
  client.stat(bucket, key, (err, ret) => {
    if (!err) {
      console.log(ret.hash, ret.fsize, ret.putTime, ret.mimeType);
      deleteFile(key, cb);
    } else {
      console.log(err);
      if (err.code === 612) {
        cb();
      }
    }
  });
}

function deleteFile(key, cb) {
  client.remove(bucket, key, function(err, ret) {
    if (!err) {
      cb();
      // refesh();
    } else {
      console.log(err);
    }
  });
}

function uploadFile(file, cb) {
  const hexprojname = crypto.createHash('md5').update(file.meta.proj).digest('hex');
  const hexfilename = crypto.createHash('md5').update(file.name.split('.')[0]).digest('hex');
  const extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(uptoken(bucket, `${hexprojname}-${hexfilename}.${file.name.split('.')[1]}`), `${hexprojname}-${hexfilename}.${file.name.split('.')[1]}`, file.path, extra, function(err, ret) {
    if(err) {
      console.log(err);
    } else {
      cb(ret);
      console.log(ret.hash, ret.key, ret.persistentId);
    }
  });
}

function upload2qiniu(file, cb) {
  const hexprojname = crypto.createHash('md5').update(file.meta.proj).digest('hex');
  const hexfilename = crypto.createHash('md5').update(file.name.split('.')[0]).digest('hex');
  getFile(`${hexprojname}-${hexfilename}.${file.name.split('.')[1]}`, () => { uploadFile(file, cb); });
}

function refesh(url) {
  const jsonBody = {
    urls: [url],
    dirs: []
  };
  fetch('http://fusion.qiniu.com/refresh', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'QBox accesskey:' + uptoken(bucket, 'http://fusion.qiniu.com/refresh')
    },
    body: JSON.stringify(jsonBody)
  }).then((res) => {
    return res.json();
  })
}

export { upload2qiniu };
