import {Template} from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import { setStore, getStore } from '../../stores/uiactions/search.action';

Template.header.onCreated(function() {
  this.searchValue = new ReactiveVar('');
})

Template.header.events({
  'input #search'(event, instance) {
    instance.searchValue.set(event.target.value);
    setStore(instance.searchValue.get());
    const ele = document.getElementById('home');
    window.home.data = (event.target.value === '');
    ele.dispatchEvent(window.home);
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
        Template.instance().searchValue.set('');
        return true;
    } else {
      return false;
    }
  },
  view: () => {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
      return true;
    }
    return false;
  }
})
