import {
  Template
} from 'meteor/templating';
import modalStore from '../../stores/uistates/modal.store';
import spinStore from '../../stores/uistates/spin.store';

Template.basicLayout.helpers({
  modalOpen: ()=>{
    return modalStore.get('open')
  },
  showSpin: () => {
    return spinStore.get('spin');
  }
})
