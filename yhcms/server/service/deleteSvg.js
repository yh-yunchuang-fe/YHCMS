import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import { DBsvg } from '../../universal/collections';

function deleteSvg(fileIds) {
  return new Promise(function(resolve, reject) {
    const files = DBsvg.find({ fileId: { $in: fileIds } });
    files.forEach((svg, index) => {
      fs.unlink(svg.filePath, Meteor.bindEnvironment((err) => {
        if (err) {
          console.log(err);
          reject({
            res: false,
            msg: err
          });
        } else {
          DBsvg.remove({ fileId: svg.fileId })
        }
      }))
    });
    resolve({
      res: true,
      msg: '删除成功'
    });
  });
}

export default deleteSvg;
