import {Template} from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import willdeleteStore from '../../stores/uistates/willdelete.store';
import { initStore, setStore, getStore } from '../../stores/uiactions/willdelete.action';

Template.showfile.onCreated(function() {
  this.clicked = new ReactiveVar(false);
  initStore();
  this.currentData = new ReactiveVar(Template.currentData().image);
})

Template.showfile.events({
  'click .show-file'(event, instance) {
    if (Meteor.user() && Meteor.user().profile.isView) {
      const fileId = instance.currentData.get().fileId;
      const collections = getStore();
      if (!collections.image.includes(fileId)) {
        collections.image.push(fileId);
      } else {
        const position = collections.image.indexOf(fileId);
        collections.image.splice(position, 1);
      }
      setStore(collections);
      const clicked = instance.clicked.get();
      instance.clicked.set(!clicked);
    }
  },
  'click .look_proj'(event, instance) {
    event.stopPropagation();
    window.open(instance.currentData.get().src)
  }
})

Template.showfile.helpers({
  opacity: () => {
    if (Template.instance().clicked.get()) {
        return 1;
    } else {
      return 0;
    }
  }
})
