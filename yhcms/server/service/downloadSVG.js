import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { DBsvg } from '../../universal/collections';
import config from '../../config.json';

const bundlePath = path.join(config.uplaodPath, 'uploads', 'bundle');
const uploadsPath = path.join(config.uplaodPath, 'uploads');

function buildZip (req, res) {
  fs.mkdir(bundlePath, Meteor.bindEnvironment(
    (err) => {
      if (err) {
        console.log(err);
        console.log('mkdir error');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          error: 'download failed'
        }))
      }
      const fileIds = req.query.fileIds.split(',');
      console.log(fileIds);
      DBsvg.find({ fileId: { $in: fileIds } }).map((svg) => {
        exec(`cp ${svg.filePath} ${bundlePath}`, function(err) {
          if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: 'download failed'
            }))
            return false;
          }
        });
      });
      exec(`cd ${uploadsPath} && zip -rDq bundle.zip ./bundle && rm -rf bundle`, (err) => {
        console.log(err);
        if (!err) {
          res.setHeader('Content-Type', 'application/octet-stream');
          res.setHeader('Content-Disposition', 'attachment; filename=bundle.zip');
          res.writeHead(200);
          const fileBuffer = fs.readFileSync(`${bundlePath}.zip`);
          res.write(fileBuffer);
          exec(`rm ${bundlePath}.zip`);
          res.end();
        }
      });
    }
  ))
}

function downloadSVG(req, res) {
  if (fs.existsSync(bundlePath)) {
    exec(`rm -rf ${bundlePath}`, Meteor.bindEnvironment(() => {
      buildZip(req, res);
    }));
  } else {
    buildZip(req, res);
  }

}

export default downloadSVG;
