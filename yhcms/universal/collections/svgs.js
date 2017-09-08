import { FilesCollection } from 'meteor/ostrio:files';
import DBsvg from './DBsvg'
import Projects from './projects'
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import config from '../../config.json';
// import svg2css from '../../../../svg2css';

const projPath = config.uplaodPath;

const Svgs = new FilesCollection({
  collectionName: 'Svgs',
  allowClientCode: true,
  // debug: true,
  storagePath: path.join(projPath, 'uploads/svg'),
  onBeforeUpload: (file) => {
    if(file.size <= 10485760 && /svg/i.test(file.extension)) {
      return true;
    }else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
  onInitiateUpload: (file) => {
    const index = DBsvg.find({}).count();
    DBsvg.insert({ fileId: file._id, projId: file.meta.projId, percent: 60, uploading: true, ext: file.ext, extension: file.extension, extensionWithDot: file.extensionWithDot,
      meta: file.meta, mime: file.mime, 'mime-type': file['mime-type'], name: file.name, size: file.size, type: file.type, filePath: file.path, index });
  }
});



export default Svgs;
