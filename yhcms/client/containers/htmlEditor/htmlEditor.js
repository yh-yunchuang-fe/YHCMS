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
