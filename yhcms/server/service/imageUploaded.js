import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import { upload2qiniu } from '../utils/upload2qiniu';
import { DBimage, Images } from '../../universal/collections';
import secret from '../../secret.json';

function imageUploaded(file) {
  const fileCount = DBimage.find({ name: file.name, projId: file.meta.projId, uploading: false }).count();
  return new Promise((resolve, reject) => {
    upload2qiniu(file, Meteor.bindEnvironment(
      (res) => {
        DBimage.update({ fileId: file._id }, { $set: { percent: 100 } });
        if (fileCount === 0) {
          Meteor.setTimeout(
            () => {
              DBimage.update({ fileId: file._id }, { $set: { src: `${secret.BASE_URL}${res.key}`, uploading: false } });
              resolve({
                flag: true,
                msg: 'add ok'
              });
            }, 1000);
          } else {
            Meteor.setTimeout(
              () => {
                DBimage.update({ name: file.name, projId: file.meta.projId, uploading: false }, { $set: { src: `${secret.BASE_URL}${res.key}` } });
                DBimage.remove({ fileId: file._id });
                resolve({
                  flag: true,
                  msg: 'update ok'
                });
              }, 1000);
            }
            Images.remove({ _id: file._id });
          }));
  });
}

export default imageUploaded;
