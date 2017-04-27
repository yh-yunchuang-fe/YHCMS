import { Template } from 'meteor/templating';
import { showSpin, closeSpin } from '../../stores/uiactions/spin.action';
import { getStore } from '../../stores/uiactions/willdelete.action';
import { DBsvg, Projects } from '../../../universal/collections';
import { ReactiveVar } from "meteor/reactive-var";

Template.svgEditor.onCreated(function() {
  this.createStatus = new ReactiveVar({
    createing: false,
    percent: 60
  });
})

Template.svgEditor.events({
  'click #cssCreate'(event, instance) {
    const createStatus = instance.createStatus.get();
    createStatus.createing = true;
    instance.createStatus.set(createStatus);
    const project = Projects.findOne({ _id: FlowRouter.getParam('projectid') });
    Meteor.call("createCss", project,  (err, result) => {
          if(!err){
            createStatus.percent = 100;
            instance.createStatus.set(createStatus);
            setTimeout(Meteor.bindEnvironment(
              () => {
                createStatus.createing = false;
                instance.createStatus.set(createStatus);
                alert('url is => ' + result);
              }
            ), 1000);
          }
      });
  },
  'click #delete'(event, instance) {
    if (getStore().svg.length === 0) {
      alert('请至少选中一项');
      return;
    }
    showSpin();
    Meteor.call('deleteSvg', getStore().svg, (err, result) => {
      if (!err) {
        console.log(result);
        alert(result);
        closeSpin();
      }
    });
  },
  'click #downloadSVG'(event, instance) {
    if (getStore().svg.length === 0) {
      alert('请至少选中一项');
      return;
    }
    $('#downloadSVGFrame').attr('src', `/downloadSVG?fileIds=${getStore().svg.join(',')}`);
  }
})

Template.svgEditor.helpers({
    Svgs: () => {
      if (!Meteor.userId()) {
        return FlowRouter.go('/');
      }
      return DBsvg.find({ projId: FlowRouter.getParam('projectid') });
    },
    createStatus: () => {
      return Template.instance().createStatus.get();
      // return
    },
    proj: () => {
      const _id = FlowRouter.getParam('projectid');
      return Projects.findOne({ _id: _id });
    },
    cssUrls: function () {
      const _id = FlowRouter.getParam('projectid');
      let cssUrl = [];
      const project = Projects.findOne({ _id: _id });
      if (project && project.cssUrl) {
        project.cssUrl.map((key) => {
          key.createAt = new Date(key.createAt).toLocaleString();
        });
        cssUrl = project.cssUrl;
      }
      return cssUrl;
    },
    view: () => {
      if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
        return true;
      } else {
        return false;
      }
    }
})
