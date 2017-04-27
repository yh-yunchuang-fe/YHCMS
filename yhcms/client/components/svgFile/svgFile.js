import {Template} from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import willdeleteStore from '../../stores/uistates/willdelete.store';
import { initStore, setStore, getStore } from '../../stores/uiactions/willdelete.action';

Template.svgfile.onCreated(function() {
  this.clicked = new ReactiveVar(false);
  initStore();
  this.currentData = new ReactiveVar(Template.currentData().svg);
})

Template.svgfile.events({
  'click .svgfile'(event, instance) {
    if (Meteor.user() && Meteor.user().profile.isView) {
      const fileId = instance.currentData.get().fileId;
      const collections = getStore();
      if (!collections.svg.includes(fileId)) {
        collections.svg.push(fileId);
      } else {
        const position = collections.svg.indexOf(fileId);
        collections.svg.splice(position, 1);
      }
      setStore(collections);
      const clicked = instance.clicked.get();
      instance.clicked.set(!clicked);
    }
  }
})

Template.svgfile.helpers({
  opacity: () => {
    if (Template.instance().clicked.get()) {
        return 1;
    } else {
      return 0;
    }
  },
  svgName: () => {
    const svg = Template.instance().currentData.get();
    if (svg) {
      return svg.name.split('.svg')[0]
    }
    return '';
  }
})
