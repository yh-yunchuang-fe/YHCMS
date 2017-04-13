import {
  Template
} from 'meteor/templating';

Template.ProjectBtn.events({
  'click .project-btn'(event,instance) {
    const {
      addNew,
      callback,
      project
    } = instance.data;
    if(addNew) {
     callback && callback();
    }else {
      callback && callback(project);
    }
  }
});

Template.ProjectBtn.helpers({
  view: () => {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
      return true;
    } else {
      return false;
    }
  }
})
