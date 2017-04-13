import { Meteor } from 'meteor/meteor';
import { DBimage } from '../../universal/collections';

function deleteImage(fileIds) {
  return new Promise(function(resolve, reject) {
    DBimage.remove({ fileId: { $in: fileIds } });
    resolve({
      res: true,
      msg: '删除成功'
    });
  });
}

export default deleteImage;
