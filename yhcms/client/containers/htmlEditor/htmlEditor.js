import { Template } from 'meteor/templating';
import { Projects, DBhtml } from '../../../universal/collections';
import { showSpin, closeSpin } from '../../stores/uiactions/spin.action';
import { getStore } from '../../stores/uiactions/willdelete.action';

Template.htmlEditor.onCreated(function() {
})

Template.htmlEditor.events({
  'click #delete'(event, instance) {
    if (getStore().html.length === 0) {
      alert('请至少选中一项');
      return;
    }
    showSpin();
    Meteor.call('deleteHtml', getStore().html, (err, result) => {
      if (!err) {
        console.log(result);
        alert(result);
        closeSpin();
      }
    });
  },
  'dragover .drop-here'(e, instance) {
    e.preventDefault();
    instance.$('.drop-here').css('z-index', 999).addClass('border-ora');
    instance.$('.drop-desc').fadeIn(200);
  },
  'drop .drop-here'(event, instance) {
    event.preventDefault();
    const files = event.originalEvent.dataTransfer.files;
    const ele = document.getElementById('filer');
    window.addfile.data = files;
    ele.dispatchEvent(window.addfile);
    instance.$('.drop-here').css('z-index', 1).removeClass('border-ora');
    instance.$('.drop-desc').hide();
  },
  'dragenter .html-editor-page'(event, instance) {
    event.preventDefault();
    instance.$('.drop-here').css('z-index', 999).addClass('border-ora');
    instance.$('.drop-desc').fadeIn(200);
  },
  'dragleave .drop-here'(event, instance) {
    event.preventDefault();
    instance.$('.drop-here').css('z-index', 1).removeClass('border-ora');
    instance.$('.drop-desc').hide();
  },
  'mouseenter .add-hover'(event, instance) {
    instance.$(event.currentTarget).animate({ top: -35 });
  },
  'mouseleave .add-hover'(event, instance) {
    instance.$(event.currentTarget).animate({ top: -80 });
  },
  'click .add-hover'(event, instance) {
    instance.$('#filer').click();
  }
})

Template.htmlEditor.helpers({
    Htmls: () => {
      if (!Meteor.userId()) {
        return FlowRouter.go('/');
      }
      return DBhtml.find({ projId: FlowRouter.getParam('projectid') });
    },
    proj: () => {
      const _id = FlowRouter.getParam('projectid');
      return Projects.findOne({ _id: _id });
    },
    view: () => {
      if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
        return true;
      } else {
        return false;
      }
    }
})
