import { Template } from 'meteor/templating';
import { showSpin, closeSpin } from '../../stores/uiactions/spin.action';
import { getStore } from '../../stores/uiactions/willdelete.action';
import { DBsvg, Projects } from '../../../universal/collections';
import { ReactiveVar } from "meteor/reactive-var";
import { domain } from '../../../config.json';
import { getDragEle } from '../../stores/uiactions/dragStore.action';

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
  },
  'click #viewAPP'(event, instance) {
    const project = Projects.findOne({ _id: FlowRouter.getParam('projectid') });
    window.open(`http://${domain}/svg/${project.name.replace(/\s+/g, '')}/ttfs/app_icon/app.html`);
  },
  'click #downloadTTF'(event, instance) {
    const project = Projects.findOne({ _id: FlowRouter.getParam('projectid') });
    $('#downloadTTFFrame').attr('src', `/downloadTTF?projName=${project.name}`);
    let alert_ready = true;
    instance.$(event.currentTarget).parents('#main').find("#downloadTTFFrame").load(function() {
      let json = $(this).contents().find("*").first().text();
      json = JSON.parse(json);
      if (json.code) {
        if (alert_ready) {
          alert(json.error);
          alert_ready = false;
        }
      }
    });
  },
  'dragover .drop-here'(e, instance) {
    if (checkIfReadyEle()) return;
    e.preventDefault();
  },
  'dragenter .drop-here'(e, instance) {
    if (checkIfReadyEle()) return;
    e.preventDefault();
    instance.$('.drop-here').css('z-index', 999).addClass('border-ora');
    instance.$('.drop-desc').fadeIn(200);
  },
  'drop .drop-here'(event, instance) {
    if (checkIfReadyEle()) return;
    event.preventDefault();
    const files = event.originalEvent.dataTransfer.files;
    const ele = document.getElementById('filer');
    window.addfile.data = files;
    ele.dispatchEvent(window.addfile);
    instance.$('.drop-here').css('z-index', 1).removeClass('border-ora');
    instance.$('.drop-desc').hide();
  },
  'dragenter .svg-editor-page'(event, instance) {
    if (checkIfReadyEle()) return;
    event.preventDefault();
    instance.$('.drop-here').css('z-index', 999).addClass('border-ora');
    instance.$('.drop-desc').fadeIn(200);
  },
  'dragleave .drop-here'(event, instance) {
    if (checkIfReadyEle()) return;
    event.preventDefault();
    instance.$('.drop-here').css('z-index', 1).removeClass('border-ora');
    instance.$('.drop-desc').hide();
  }
})

function checkIfReadyEle() {
  const ele = getDragEle();
  if (ele !== '') {
    return true;
  }
  return false;
}

Template.svgEditor.helpers({
    Svgs: () => {
      if (!Meteor.userId()) {
        return FlowRouter.go('/');
      }
      return DBsvg.find({ projId: FlowRouter.getParam('projectid') }, { sort: { index: 1 } });
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
        project.cssUrl.reverse();
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
