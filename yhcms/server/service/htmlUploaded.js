import { Meteor } from 'meteor/meteor';
import { DBhtml, Htmls } from '../../universal/collections';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import config from '../../config.json';

const projPath = path.join(config.uplaodPath, 'uploads');

function htmlUploaded(file) {
  console.log(file.name);
  file.name = file.name.replace(/\s+/g, '');
  const projHtmlPath = path.join(projPath, `/html/${file.meta.proj.replace(/\s+/g, '')}`);
  return new Promise((resolve, reject) => {
    fs.rename(file.path, `${projHtmlPath}/${file.name}`, Meteor.bindEnvironment(function(err) {
      if (err) {
        DBhtml.remove({ fileId: file._id });
        Htmls.remove({ _id: file._id });
        console.log(err);
        reject({
          flag: false,
          err: err
        });
      }
      fs.stat(`${projHtmlPath}/${file.name}`, Meteor.bindEnvironment(function(err, stats) {
        if (err) {
          DBhtml.remove({ fileId: file._id });
          Htmls.remove({ _id: file._id });
          console.log(err);
          reject({
            flag: false,
            err: err
          });
        }
        console.log(`unzip -o ${projHtmlPath}/${file.name} -d ${projHtmlPath}/ && chmod 775 ${projHtmlPath}/${file.name.split('.zip')[0]} && rm ${projHtmlPath}/${file.name}`);
        exec(`unzip -o ${projHtmlPath}/${file.name} -d ${projHtmlPath}/ && chmod 775 ${projHtmlPath}/${file.name.split('.zip')[0]} && mv ${projHtmlPath}/${file.name} ${projHtmlPath}/${file.name.split('.zip')[0]}/${file.name}`, Meteor.bindEnvironment(function(err) {
          if (err) {
            console.log(err);
            DBhtml.remove({ fileId: file._id });
            Htmls.remove({ _id: file._id });
            reject({
              flag: false,
              err: err
            });
          } else {
            Meteor.setTimeout(() => {
              DBhtml.update({ fileId: file._id }, { $set: { percent: 100 } });
            }, 1000);
            Meteor.setTimeout(() => {
              if (DBhtml.find({ dirName: file.name.split('.zip')[0], projId: file.meta.projId }).count() === 0) {
                DBhtml.update({ fileId: file._id }, { $set: { dirName: file.name.split('.zip')[0], uploading: false, openUrl: `http://${config.domain}/html/${file.meta.proj}/${file.name.split('.zip')[0]}/index.html`, filePath: `${projHtmlPath}/${file.name.split('.zip')[0]}` } });
                resolve({
                  flag: true,
                  msg: 'add ok'
                });
              } else {
                DBhtml.remove({ fileId: file._id });
                resolve({
                  flag: true,
                  msg: 'update ok'
                });
              }
              Htmls.remove({ _id: file._id });
            }, 1500);
          }
        }));
      }));
    }));
  });
}

export default htmlUploaded;
