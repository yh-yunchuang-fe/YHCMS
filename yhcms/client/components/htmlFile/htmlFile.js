import {Template} from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import willdeleteStore from '../../stores/uistates/willdelete.store';
import { initStore, setStore, getStore } from '../../stores/uiactions/willdelete.action';

Template.htmlfile.onCreated(function() {
  this.clicked = new ReactiveVar(false);
  initStore();
  this.currentData = new ReactiveVar(Template.currentData().html);
})

Template.htmlfile.events({
  'click .htmlfile'(event, instance) {
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
})

Template.htmlfile.helpers({
  opacity: () => {
    if (Template.instance().clicked.get()) {
        return 1;
    } else {
      return 0;
    }
  }
})
