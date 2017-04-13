import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import { exec } from 'child_process';
import { DBhtml } from '../../universal/collections';

function deleteHtml(fileIds) {
  return new Promise(function(resolve, reject) {
    const files = DBhtml.find({ fileId: { $in: fileIds } });
    files.forEach((html, index) => {
      exec(`rm -rf ${html.filePath}`, Meteor.bindEnvironment((err) => {
        if (err) {
          reject({
            res: false,
            msg: err
          });
        } else {
          DBhtml.remove({ fileId: html.fileId })
        }
      }));
    });
    resolve({
      res: true,
      msg: '删除成功'
    });
  });
}

export default deleteHtml;
