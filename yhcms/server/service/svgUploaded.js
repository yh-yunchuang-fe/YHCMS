import { Meteor } from 'meteor/meteor';
import { DBsvg, Svgs } from '../../universal/collections';
import fs from 'fs';
import path from 'path';
import config from '../../config.json';

const projPath = path.join(config.uplaodPath, 'uploads');

function svgUploaded(file) {
  console.log('upload file name is ' + file.name);
  return new Promise((resolve, reject) => {
    file.name = file.name.replace(/\s+/g, '');
    const fileCount = DBsvg.find({ name: file.name, projId: file.meta.projId, uploading: false }).count();
    const src = fs.readFileSync(file.path, 'utf8');
    const projSvgPath = path.join(projPath, `/svg/${file.meta.proj.replace(/\s+/g, '')}`);
    fs.rename(file.path, `${projSvgPath}/${file.name}`, Meteor.bindEnvironment(function(err) {
      if (err) {
        DBsvg.remove({fileId: file._id});
        Svgs.remove({ _id: file._id });
        console.log(err);
        reject({
          flag: false,
          err: err
        });
      }
      fs.stat(`${projSvgPath}/${file.name}`, Meteor.bindEnvironment(function(err, stats) {
        if (err) {
          DBsvg.remove({fileId: file._id});
          Svgs.remove({ _id: file._id });
          console.log(err);
          reject({
            flag: false,
            err: err
          });
        }
        Meteor.setTimeout(() => {
          DBsvg.update({ fileId: file._id }, { $set: { percent: 100 } });
        }, 1000);
        if (fileCount === 0) {
          Meteor.setTimeout(() => {
            const index = DBsvg.find({ projId: file.meta.projId }).count();
            DBsvg.update({ fileId: file._id }, { $set: { uploading: false, src: src, filePath: `${projSvgPath}/${file.name}`, index: index - 1 } }, { upsert: true });
            resolve({
              flag: true,
              msg: 'add ok'
            });
          }, 1500);
        } else {
          Meteor.setTimeout(() => {
            DBsvg.update({ name: file.name, projId: file.meta.projId, uploading: false }, { $set: { src: src, filePath: `${projSvgPath}/${file.name}` } });
            DBsvg.remove({ fileId: file._id });
            resolve({
              flag: true,
              msg: 'update ok'
            });
          }, 1500);
        }
        Svgs.remove({ _id: file._id });
      }));
    }));
  });
}

export default svgUploaded;
