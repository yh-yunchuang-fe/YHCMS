import { Template } from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import willdeleteStore from '../../stores/uistates/willdelete.store';
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
  'click .content'(event, instance) {
    if (Meteor.user() && Meteor.user().profile.isView) {
      const _id = instance.currentData.get()._id;
      const collections = getStore();
      if (!collections.proj.includes(_id)) {
        collections.proj.push(_id);
      } else {
        const position = collections.proj.indexOf(_id);
        collections.proj.splice(position, 1);
      }
      setStore(collections);
      const clicked = instance.clicked.get();
      instance.clicked.set(!clicked);
    }
  },
  'click .look_proj'(event, instance) {
    event.stopPropagation();
    const { addNew, callback, project } = instance.data;
    if (!addNew) {
      callback && callback(project);
    }
    // instance.$('a').attr('href', instance.currentData.get().openUrl);
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
    if (Template.instance().clicked.get()) {
        return 'block';
    } else {
      return 'none';
    }
  }
})
