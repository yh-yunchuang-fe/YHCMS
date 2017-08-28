import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import path from 'path';
import config from '../../config.json';

function downloadTTF(req, res) {
  const ttfPath = path.join(config.uplaodPath, `uploads/svg/${req.query.projName.replace(/\s+/g, '')}/ttfs/Glyphter.ttf`);
  if (!fs.existsSync(ttfPath)) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      code: '00200',
      error: 'ttf file is not exist, please push createCssAndTTF button first'
    }))
  } else {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=Glyphter.ttf');
    res.writeHead(200);
    const fileBuffer = fs.readFileSync(ttfPath);
    res.write(fileBuffer);
    res.end();
  }
}

export default downloadTTF;
