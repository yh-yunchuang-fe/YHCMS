import { Template } from 'meteor/templating';
import { openModal, closeModal } from '../../stores/uiactions/modal.action';
import { showSpin, closeSpin } from '../../stores/uiactions/spin.action';
import { getStore, setStore } from '../../stores/uiactions/willdelete.action';

Template.predelete.events({
  'click .yhcms-btn-warning'(event,instance){
    closeModal();
    const collection = {
      svg: [],
      image: [],
      html: [],
      proj: []
    }
    setStore(collection);
    instance.$(event.target).parents('body').find('.prepare-delete').fadeOut(100);
  },
  'click .yhcms-btn-primary'(event, instance) {
    console.log(getStore());
    closeModal();
    if (getStore().html.length > 0) {
      showSpin();
      Meteor.call('deleteHtml', getStore().html, (err, result) => {
        if (!err) {
          console.log(result);
          alert(result);
          closeSpin();
        }
      });
    }
    if (getStore().image.length > 0) {
      showSpin();
      Meteor.call('deleteImage', getStore().image, (err, result) => {
        if (!err) {
          console.log(result);
          alert(result);
          closeSpin();
        }
      });
    }
    if (getStore().proj.length > 0) {
      showSpin();
      Meteor.call('deleteProj', getStore().proj, (err, result) => {
        if (!err) {
          console.log(result);
          alert(result);
          closeSpin();
        }
      });
    }
    if (getStore().svg.length > 0) {
      showSpin();
      Meteor.call('deleteSvg', getStore().svg, (err, result) => {
        if (!err) {
          console.log(result);
          alert(result);
          closeSpin();
        }
      });
    }
  }
});
