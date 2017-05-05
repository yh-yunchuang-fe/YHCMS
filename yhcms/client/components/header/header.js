import {Template} from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import { setStore } from '../../stores/uiactions/search.action';

Template.header.onCreated(function() {
  this.searchValue = new ReactiveVar('');
})

Template.header.events({
  'input #search'(event, instance) {
    instance.searchValue.set(event.target.value);
  },
  'click .yhicon-search'(event, instance) {
    setStore(instance.searchValue.get());
  },
  'keydown #search'(event, instance) {
    if (event.keyCode === 13) {
      setStore(instance.searchValue.get());
    }
  },
});

Template.header.helpers({
  show: () => {
    if (FlowRouter.getRouteName() === 'home') {
        return true;
    } else {
      return false;
    }
  }
})
