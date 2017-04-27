import {Template} from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import willdeleteStore from '../../stores/uistates/willdelete.store';
import { initStore, setStore, getStore } from '../../stores/uiactions/willdelete.action';

Template.htmlfile.onCreated(function() {
  this.clicked = new ReactiveVar(false);
  initStore();
  this.currentData = new ReactiveVar(Template.currentData().html);
  this.isView = new ReactiveVar(Meteor.user().profile.isView);
})

Template.htmlfile.events({
  'click .html_li'(event, instance) {
    if (instance.isView.get()) {
      const fileId = instance.currentData.get().fileId;
      const collections = getStore();
      if (!collections.html.includes(fileId)) {
        collections.html.push(fileId);
      } else {
        const position = collections.html.indexOf(fileId);
        collections.html.splice(position, 1);
      }
      setStore(collections);
      const clicked = instance.clicked.get();
      instance.clicked.set(!clicked);
    }
  },
  'click .look_btn'(event, instance) {
    event.stopPropagation();
    instance.$('a').attr('href', instance.currentData.get().openUrl);
  }
})

Template.htmlfile.helpers({
  display: () => {
    if (Template.instance().clicked.get()) {
        return 'block';
    } else {
      return 'none';
    }
  }
})
