import { Meteor } from 'meteor/meteor';
import path from 'path';
import { DBsvg, DBhtml, DBimage, Projects } from '../../universal/collections';
import config from '../../config.json';

const projPath = path.join(config.uplaodPath, 'uploads');

function deleteProj(projIds) {
  return new Promise(function(resolve, reject) {
    DBsvg.remove({ projId: { $in: projIds } });
    DBimage.remove({ projId: { $in: projIds } });
    DBhtml.remove({ projId: { $in: projIds } });
    Projects.remove({ _id: { $in: projIds } });
    resolve({
      res: true,
      msg: '删除成功'
    });
  });
}

export default deleteProj;
