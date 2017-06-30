import { Template } from 'meteor/templating';
import { DBimage, Projects } from '../../../universal/collections';
import { showSpin, closeSpin } from '../../stores/uiactions/spin.action';
import { getStore } from '../../stores/uiactions/willdelete.action';

Template.imageEditor.onCreated(function() {})

Template.imageEditor.events({
  'click #delete'(event, instance) {
    if (getStore().image.length === 0) {
      alert('请至少选中一项');
      return;
    }
    showSpin();
    Meteor.call('deleteImage', getStore().image, (err, result) => {
      if (!err) {
        console.log(result);
        alert(result);
        closeSpin();
      }
    });
  }
})

function copy(obj) {
  const newObj = {};
  for (let prop in obj) {
    if (prop !== '') {
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
}

Template.imageEditor.helpers({
    images: () => {
      if (!Meteor.userId()) {
        return FlowRouter.go('/');
      }
      const imgs = DBimage.find({ projId: FlowRouter.getParam('projectid') });
      const _imgs = [];
      imgs.map((img) => {
        if (!img.uploading) {
          img.src = `${img.src}?v=${Date.now()}`;
        }
        const _img = copy(img);
        _imgs.push(_img);
      });
      return _imgs;
    },
    proj: () => {
      const _id = FlowRouter.getParam('projectid');
      return Projects.findOne({ _id: _id });
    },
    view: () => {
      if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
        return true;
      } else {
        return false;
      }
    }
})
