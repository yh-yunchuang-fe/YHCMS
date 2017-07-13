import { FilesCollection } from 'meteor/ostrio:files';
import path from 'path';
import config from '../../config.json';
import secret from '../../secret.json';
import fs from 'fs';
import DBimage from './DBimage';

const projPath = config.uplaodPath;

const Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true,
  storagePath: path.join(projPath, 'uploads/image'),
  onBeforeUpload: (file) => {
    if(file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
  onInitiateUpload: (file) => {
    DBimage.insert({ fileId: file._id, projId: file.meta.projId, percent: 0, uploading: true, ext: file.ext, extension: file.extension, extensionWithDot: file.extensionWithDot,
      meta: file.meta, mime: file.mime, 'mime-type': file['mime-type'], name: file.name, size: file.size, type: file.type, updateAt: Date.now() });
  }
});



export default Images;
