import { Meteor } from 'meteor/meteor';
import path from 'path';
import { DBhtml, Projects } from '../../universal/collections';
import config from '../../config.json';
import { exec } from 'child_process';
import fs from 'fs';

function downloadAssets(req, res) {
  const id = req.query.id;
  const html = DBhtml.findOne({ _id: id });
  if (!html) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'html data is not exist',
      code: '00003'
    }))
    return;
  }
  const html_name = html.dirName;
  const proj_name = Projects.findOne({ _id: html.projId }).name;
  const uploadsPath = path.join(config.uplaodPath, `uploads/html/${proj_name}/${html_name}`);
  const bundlePath = path.join(config.uplaodPath, `uploads/html/${proj_name}/${html_name}`, `${html_name}-assets`);
  const assetsPath = path.join(config.uplaodPath, `uploads/html/${proj_name}/${html_name}`, 'assets');
  console.log(bundlePath);
  console.log(assetsPath);
  if (!fs.existsSync(assetsPath)) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'assets folder is not exist',
      code: '00001'
    }))
    return;
  }
  exec(`cd ${uploadsPath} && zip -rDq ${html_name}-assets.zip ./assets`, (err) => {
    console.log(err);
    if (!err) {
      try {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(html_name)}-assets.zip`);
        res.writeHead(200);
        const fileBuffer = fs.readFileSync(`${bundlePath}.zip`);
        res.write(fileBuffer);
        exec(`rm ${bundlePath}.zip`);
        res.end();
      } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          error: 'assets zip file is not exist',
          code: '00002'
        }))
      }
    }
  });
}

export default downloadAssets;
