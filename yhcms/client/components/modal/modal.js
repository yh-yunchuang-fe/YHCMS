import {
  Template
} from 'meteor/templating';
import {
  openModal,
  closeModal
} from '../../stores/uiactions/modal.action';
import modalStore from '../../stores/uistates/modal.store';
import { ProjRele } from '../../../universal/collections';

Template.Modal.events({
  'click .yhicon-close'(event,instance){
    instance.$(event.target).parents('body').find('.prepare-delete').fadeOut(100);
    closeModal();
  },
  'click .yhcms-btn-warning'(event, instance) {

  },
  'click #left-btn'(event, instance) {
    instance.$('.hover-model').animate({ top: '40%' });
    instance.$('#rela_value').val('');
    setTimeout(() => {
      instance.$('.hover-model').hide();
    }, 1000);
  },
  'click #right-btn'(event, instance) {
    const value = instance.$('#rela_value').val();
    const prohRela = ProjRele.findOne({ rela: value });
    if (!prohRela) {
      ProjRele.insert({
        rela: value,
        createdAt: Date.now(),
        userId: Meteor.userId()
      });
      instance.$('.hover-model').animate({ top: '40%' });
      setTimeout(() => {
        instance.$('.hover-model').hide();
      }, 1000);
    } else {
      alert('归属类型已存在');
    }
  }
});

Template.Modal.helpers({
  title: ()=>{
    return modalStore.get('title')
  },
  contentTPL: ()=>{
    return modalStore.get('contentTPL')
  }
});
