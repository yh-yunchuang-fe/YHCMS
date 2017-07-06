import { Template } from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import willdeleteStore from '../../stores/uistates/willdelete.store';
import { openModal, closeModal } from '../../stores/uiactions/modal.action';
import { initStore, setStore, getStore } from '../../stores/uiactions/willdelete.action';

Template.ProjectBtn.onCreated(function() {
  this.clicked = new ReactiveVar(false);
  initStore();
  this.currentData = new ReactiveVar(Template.currentData().project);
})

Template.ProjectBtn.events({
  'click .project-btn'(event,instance) {
    const {
      addNew,
      callback,
      project
    } = instance.data;
    if(addNew) {
     callback && callback();
    }
  },
  'click .html-top-cantainer'(event, instance) {
    event.stopPropagation();
    const { addNew, callback, project } = instance.data;
    if (!addNew) {
      callback && callback(project);
    }
  },
  'click .look_proj'(event, instance) {
    event.stopPropagation();
    const { addNew, callback, project } = instance.data;
    if (!addNew) {
      callback && callback(project);
    }
  },
  'click .prepare-delete'(event, instance) {
    event.stopPropagation();
    instance.$(event.currentTarget).fadeOut(300);
    const fileId = instance.currentData.get().fileId;
    const collections = getStore();
    const position = collections.image.indexOf(fileId);
    collections.image.splice(position, 1);
    setStore(collections);
  },
  'click .bar-img'(event, instance) {
    event.stopPropagation();
    if (instance.$(event.currentTarget).attr('index') == 1) {
      const { addNew, callback, project } = instance.data;
      if (!addNew && callback) {
        callback(project);
      }
    } else {
      instance.$('.prepare-delete').fadeIn(300)
      if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
        const _id = instance.currentData.get()._id;
        const collections = getStore();
        if (!collections.proj.includes(_id)) {
          collections.proj.push(_id);
        } else {
          const position = collections.proj.indexOf(_id);
          collections.proj.splice(position, 1);
        }
        setStore(collections);
        openModal({title: '删除', contentTPL: 'predelete'});
      }
    }
  },
  'mouseenter .bar-img'(event, instance) {
    if (instance.$(event.currentTarget).attr('index') == 1) {
      instance.$('.html-mask').unbind('click').fadeIn(200).click(() => {
        /* Act on the event */
        const { addNew, callback, project } = instance.data;
        if (!addNew && callback) {
          callback(project);
        }
      }).find('span').text('查看');
    } else {
      instance.$('.html-mask').unbind('click').fadeIn(200).click(() => {
        /* Act on the event */
        instance.$('.prepare-delete').fadeIn(300);
        if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
          const _id = instance.currentData.get()._id;
          const collections = getStore();
          if (!collections.proj.includes(_id)) {
            collections.proj.push(_id);
          } else {
            const position = collections.proj.indexOf(_id);
            collections.proj.splice(position, 1);
          }
          setStore(collections);
          openModal({title: '删除', contentTPL: 'predelete'});
        }
      }).find('span').text('删除');
    }
  },
  'mouseleave .html-bottom-cantainer'(event, instance) {
    instance.$('.html-mask').fadeOut(200);
  }
});

Template.ProjectBtn.helpers({
  view: () => {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
      return true;
    } else {
      return false;
    }
  },
  display: () => {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
        return 'block';
    } else {
      return 'none';
    }
  }
})
