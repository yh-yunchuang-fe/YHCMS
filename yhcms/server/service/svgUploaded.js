import { Meteor } from 'meteor/meteor';
import { DBsvg, Svgs } from '../../universal/collections';
import fs from 'fs';
import path from 'path';
import config from '../../config.json';

const projPath = path.join(config.uplaodPath, 'uploads');

function svgUploaded(file) {
  console.log('upload file name is ' + file.name);
  const fileCount = DBsvg.find({ name: file.name, projId: file.meta.projId, uploading: false }).count();
  const src = fs.readFileSync(file.path, 'utf8');
  const projSvgPath = path.join(projPath, `/svg/${file.meta.proj}`);
  fs.rename(file.path, `${projSvgPath}/${file.name}`, Meteor.bindEnvironment(function(err) {
    if (err) {
      DBsvg.remove({fileId: file._id});
      Svgs.remove({ _id: file._id });
      throw err;
    }
    fs.stat(`${projSvgPath}/${file.name}`, Meteor.bindEnvironment(function(err, stats) {
      if (err) {
        DBsvg.remove({fileId: file._id});
        Svgs.remove({ _id: file._id });
        throw err;
      }
      console.log('stats: ' + JSON.stringify(stats));
      Meteor.setTimeout(() => {
        DBsvg.update({ fileId: file._id }, { $set: { percent: 100 } });
      }, 1000);
      if (fileCount === 0) {
        Meteor.setTimeout(() => {
          DBsvg.update({ fileId: file._id }, { $set: { uploading: false, src: src, filePath: `${projSvgPath}/${file.name}` } });
        }, 1500);
      } else {
        Meteor.setTimeout(() => {
          DBsvg.update({ name: file.name, projId: file.meta.projId, uploading: false }, { $set: { src: src, filePath: `${projSvgPath}/${file.name}` } });
          DBsvg.remove({ fileId: file._id });
        }, 1500);
      }
      Svgs.remove({ _id: file._id });
    }));
  }));
}

export default svgUploaded;
