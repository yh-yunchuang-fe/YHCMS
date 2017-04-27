import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import path from 'path';
import fs from 'fs';
import { deleteSvg, deleteImage, deleteHtml, svgUploaded, imageUploaded, htmlUploaded, deleteProj, downloadSVG } from './service';
import { createCss } from './service/plugin'
import config from '../config.json';

const projPath = path.join(config.uplaodPath, 'uploads');

Meteor.startup(() => {
    // code to run on server at startup
    console.log(`meteor start listen ${process.env.ROOT_URL}`);
    console.log(`wellcom to yhcms ^ ^`);
});

Meteor.methods({
    createCss: function(projName) {
      return createCss(projName).then((res) => {
          console.log(res);
          return res.url;
      });
    },
    createDir: function(projectname, projecttype) {
      const projDirPath = path.join(projPath, `${projecttype}/${projectname.replace(/\s+/g, '')}`);
      if (!fs.existsSync(projDirPath)) {
          fs.mkdirSync(projDirPath);
      }
    },
    svgUploaded: function(file) {
      svgUploaded(file);
    },
    imageUploaded: function(file) {
      imageUploaded(file);
    },
    htmlUploaded: function(file) {
      htmlUploaded(file);
    },
    deleteSvg: function(fileIds) {
      return deleteSvg(fileIds).then((res) => {
        console.log(res);
        return res.msg;
      });
    },
    deleteImage: function(fileIds) {
      return deleteImage(fileIds).then((res) => {
        console.log(res);
        return res.msg;
      });
    },
    deleteHtml: function(fileIds) {
      return deleteHtml(fileIds).then((res) => {
        console.log(res);
        return res.msg;
      });
    },
    deleteProj: function(projIds) {
      console.log(`prepare to delete proj id is => ${projIds}`);
      return deleteProj(projIds).then((res) => {
        console.log(res);
        return res.msg;
      });
    }
});

WebApp.connectHandlers.use('/downloadSVG', (req, res) => {
  if (!req.query.fileIds || (req.query.fileIds && req.query.fileIds.split(',').length === 0)) {
    res.setHeader('Content-Type', 'application/json');
    res.end({
      error: 'fileIds is require'
    })
  }
  downloadSVG(req, res);
});
