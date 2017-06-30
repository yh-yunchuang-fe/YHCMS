import { FilesCollection } from 'meteor/ostrio:files';
import DBhtml from './DBhtml'
import path from 'path';
import config from '../../config.json';
// import svg2css from '../../../../svg2css';

const projPath = config.uplaodPath;

const Htmls = new FilesCollection({
  collectionName: 'Htmls',
  allowClientCode: true,
  debug: true,
  storagePath: path.join(projPath, 'uploads/html'),
  onBeforeUpload: (file) => {
    if(file.size <= 104857600 && /zip/i.test(file.extension)) {
      return true;
    }else {
      return 'Please upload image, with size equal or less than 100MB';
    }
  },
  onInitiateUpload: (file) => {
    DBhtml.insert({ fileId: file._id, projId: file.meta.projId, percent: 60, uploading: true, ext: file.ext, extension: file.extension, extensionWithDot: file.extensionWithDot,
      meta: file.meta, mime: file.mime, 'mime-type': file['mime-type'], name: file.name, size: file.size, type: file.type });
  }
});



export default Htmls;
