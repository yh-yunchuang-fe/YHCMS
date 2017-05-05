import {Template} from 'meteor/templating';
import {Images, Svgs, Htmls, Projects, DBsvg, DBimage, DBhtml} from '../../../universal/collections'
import {ReactiveVar} from "meteor/reactive-var";

Template.addFile.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
    this.TIMER = new ReactiveVar(0);
    this.MQ = new ReactiveVar([]);
    this.MQ_TRICK = new ReactiveVar(1);
    this.READY_SIGNAL = new ReactiveVar('');
    this.MQ_READY_ARRAY = new ReactiveVar([]);
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
            const files = [];
            const len = event.target.files.length;
            for (let i = 0; i < len; i++) {
              files.push(event.target.files[i]);
            }
            const _MQ = [];
            while(files.length > 0) {
              _MQ.push(files.splice(0, 10));
            }
            console.log(_MQ);
            instance.MQ.set(_MQ);
            const project = Projects.findOne({ _id: FlowRouter.getParam('projectid') });
            startPoll(instance, project);
            MQ_TRICK(instance, project, _MQ[0]);
        }
    }
})

/**
 * [startPoll 开始轮询]
 * @param  {[type]} instance [当前模板]
 * @param  {[type]} project  [项目]
 * @return {[type]}          [null]
 */
function startPoll(instance, project) {
  const timer = setInterval(() => {
    const signal = instance.READY_SIGNAL.get();
    const readyArray = instance.MQ_READY_ARRAY.get();
    const ready = readyArray.join('');
    if (signal === ready) {
      instance.MQ_READY_ARRAY.set([]);
      const _MQ = instance.MQ.get();
      const len = _MQ.length;
      let trick = instance.MQ_TRICK.get();
      if (trick < len) {
        console.log(`文件数超出队列限制, 上传队列开始, tricker is ${trick}`);
        MQ_TRICK(instance, project, _MQ[trick]);
        instance.MQ_TRICK.set(++trick);
      } else {
        clearInterval(instance.TIMER.get());
        console.log('end uploading, clear poll model');
      }
    }
  }, 100);
  instance.TIMER.set(timer);
}

/**
 * [MQ_TRICK 事件触发器]
 * @param {[type]} instance [当前模板]
 * @param {[type]} project  [项目]
 * @param {[type]} MQ       [当前执行的MQ队列]
 */
function MQ_TRICK(instance, project, MQ) {
  const ready = new Array(MQ.length);
  let signal = '';
  for (let i = 0; i < MQ.length; i++) {
    signal += i;
  }
  instance.READY_SIGNAL.set(signal);
  MQ.map((mq, index) => {
    let upload = {};
    let uploadedType = '';
    if (mq.type === 'image/svg+xml') {
        upload = Svgs.insert({
            file: mq,
            streams: 'dynamic',
            chunkSize: 'dynamic',
            meta: {
              proj: project.name,
              projId: project._id
            }
        }, false);
        uploadedType = 'svgUploaded';
    }
    if (mq.type === 'application/zip') {
      upload = Htmls.insert({
          file: mq,
          streams: 'dynamic',
          chunkSize: 'dynamic',
          meta: {
            proj: project.name,
            projId: project._id
          }
      }, false);
      uploadedType = 'htmlUploaded';
    }
    if (/image\/(jpeg|jpg|png)/.test(mq.type)) {
        upload = Images.insert({
            file: mq,
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
            Meteor.call(uploadedType, fileObj, (err, res) => {
              if (!err) {
                if (res) {
                  ready[index] = index;
                  instance.MQ_READY_ARRAY.set(ready);
                }
              }
            });
        }
        instance.currentUpload.set(false);
    })
    upload.start();
  });
}
