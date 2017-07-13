import { Template } from 'meteor/templating';
import { DBimage, Projects } from '../../../universal/collections';
import { ReactiveVar } from "meteor/reactive-var";
import { showSpin, closeSpin } from '../../stores/uiactions/spin.action';
import { getStore } from '../../stores/uiactions/willdelete.action';

Template.imageEditor.onCreated(function() {
  this.date = new ReactiveVar(Date.now());
})

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
  },
  'dragover .drop-here'(e, instance) {
    e.preventDefault();
    instance.$('.drop-here').css('z-index', 999).addClass('border-ora');
    instance.$('.drop-desc').fadeIn(200);
  },
  'drop .drop-here'(event, instance) {
    event.preventDefault();
    const files = event.originalEvent.dataTransfer.files;
    const ele = document.getElementById('filer');
    window.addfile.data = files;
    ele.dispatchEvent(window.addfile);
    instance.$('.drop-here').css('z-index', 1).removeClass('border-ora');
    instance.$('.drop-desc').hide();
  },
  'dragenter .image-editor-page'(event, instance) {
    event.preventDefault();
    instance.$('.drop-here').css('z-index', 999).addClass('border-ora');
    instance.$('.drop-desc').fadeIn(200);
  },
  'dragleave .drop-here'(event, instance) {
    event.preventDefault();
    instance.$('.drop-here').css('z-index', 1).removeClass('border-ora');
    instance.$('.drop-desc').hide();
  },
  'mouseenter .add-hover'(event, instance) {
    instance.$(event.currentTarget).animate({ top: -25 });
    instance.$('.title').fadeOut(300);
  },
  'mouseleave .add-hover'(event, instance) {
    instance.$(event.currentTarget).animate({ top: -70 });
    instance.$('.title').fadeIn(300);
  },
  'click .add-hover'(event, instance) {
    instance.$('#filer').click();
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
      const imgs = DBimage.find({ projId: FlowRouter.getParam('projectid') }, { sort: { updateAt: -1 } });
      const _imgs = [];
      const months = [];
      imgs.map((img) => {
        img.src = `${img.src}?v=${Template.instance().date.get()}`;
        if (img.updateAt) {
          const d = new Date(img.updateAt);
          img.time = `${d.getFullYear()}年 ${d.getMonth() + 1}月`
        } else {
          img.time = '上传时间因系统原因未及时更新，请重新上传'
        }
        const date = new Date(img.updateAt);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (!isNaN(month) && !isNaN(year) && !months.includes(`${month}#${year}`)) {
          img.show_time_line = true;
          months.push(`${month}#${year}`);
        }
        if ((isNaN(month) || isNaN(year)) && !months.includes(`${month}#${year}`)) {
          img.show_time_line = true;
          months.push(`${month}#${year}`);
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
