import {
  Template
} from 'meteor/templating';
import {
  openModal,
  closeModal
} from '../../stores/uiactions/modal.action';
import modalStore from '../../stores/uistates/modal.store';

Template.Modal.events({
  'click .yhicon-close'(event,instance){
    instance.$(event.target).parents('body').find('.prepare-delete').fadeOut(100);
    closeModal();
  },
  'click .yhcms-btn-warning'(event, instance) {

  },
});

Template.Modal.helpers({
  title: ()=>{
    return modalStore.get('title')
  },
  contentTPL: ()=>{
    return modalStore.get('contentTPL')
  }
});
