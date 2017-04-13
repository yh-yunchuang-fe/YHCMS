import {Template} from 'meteor/templating';
import {Images, Svgs, Htmls, Projects, DBsvg, DBimage, DBhtml} from '../../../universal/collections'
import {ReactiveVar} from "meteor/reactive-var";

Template.addFile.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
})

Template.addFile.helpers({
  view: () => {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
      return true;
    } else {
      return false;
    }
  }
})

Template.addFile.events({
    'change #filer' (event, instance) {
        if (event.target.files && event.target.files.length > 0) {
            const filelen = event.target.files.length;
            // if (filelen > 30) {
            //     alert('too much files you upload, max is 30!');
            //     return;
            // }
            const project = Projects.findOne({ _id: FlowRouter.getParam('projectid') });
            for (let i = 0; i < filelen; i++) {
                let upload = {};
                let uploadedType = '';
                if (event.target.files[i].type === 'image/svg+xml') {
                    upload = Svgs.insert({
                        file: event.target.files[i],
                        streams: 'dynamic',
                        chunkSize: 'dynamic',
                        meta: {
                          proj: project.name,
                          projId: project._id
                        }
                    }, false);
                    uploadedType = 'svgUploaded';
                }
                if (event.target.files[i].type === 'application/zip') {
                  upload = Htmls.insert({
                      file: event.target.files[i],
                      streams: 'dynamic',
                      chunkSize: 'dynamic',
                      meta: {
                        proj: project.name,
                        projId: project._id
                      }
                  }, false);
                  uploadedType = 'htmlUploaded';
                }
                console.log(event.target.files[i].type);
                if (/image\/(jpeg|jpg|png)/.test(event.target.files[i].type)) {
                    upload = Images.insert({
                        file: event.target.files[i],
                        streams: 'dynamic',
                        chunkSize: 'dynamic',
                        meta: {
                          proj: project.name,
                          projId: project._id
                        }
                    }, false);
                    uploadedType = 'imageUploaded';
                }
                upload.on('start', () => {
                    instance.currentUpload.set(this);
                })
                upload.on('error', (err, fileObj) => {
                  console.log(err);
                })
                upload.on('end', (error, fileObj) => {
                    if (error) {
                        if (uploadedType === 'svgUploaded') {
                          DBsvg.remove({fileId: fileObj._id});
                          Svgs.remove({ _id: fileObj._id });
                        }
                        if (uploadedType === 'imageUploaded') {
                          DBimage.remove({ fileId: fileObj._id });
                          Images.remove({ _id: fileObj._id });
                        }
                        if (uploadedType === 'htmlUploaded') {
                          DBhtml.remove({ fileId: fileObj._id });
                          Htmls.remove({ _id: fileObj._id });
                        }
                        alert('Error during upload: ' + error);
                    } else {
                        Meteor.call(uploadedType, fileObj);
                    }
                    instance.currentUpload.set(false);
                })
                upload.start();
            }
        }
    }
})
