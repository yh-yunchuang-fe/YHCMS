import {
  Template
} from 'meteor/templating';
import {
  openModal,
  closeModal
} from '../../stores/uiactions/modal.action';
import {
  Projects, ProjRele
} from '../../../universal/collections';
import config from '../../../config.json';
// import svg2css from '../../../../svg2css';

const projPath = config.uplaodPath;

Template.addProject.events({
  'click .yhcms-btn-warning'(event,instance){
    closeModal();
  },
  'click .yhcms-btn-primary'(event, instance) {
    const projectname = instance.find('#projectname').value;
    const projecttype = instance.find('#projecttype').value;
    const projectrela = instance.find('#projectrela').value;
    console.log(`${projectname} ${projecttype} ${projectrela}`);
    if (Projects.find({ name: projectname, type: projecttype }).count() !== 0) {
      alert('项目名称和类型不能重复');
      return;
    }
    Projects.insert({
      name: projectname,
      type: projecttype,
      rela: projectrela,
      cssUrl: [],
      createdAt: new Date().getTime()
    });
    Meteor.call('createDir', projectname, projecttype);
    closeModal();
  },
  'click .add-rela'(event, instance) {
    instance.$(event.currentTarget).parents('body').find('.hover-model').show().animate({ top: '60%' })
    instance.$(event.currentTarget).parents('body').find('#rela_value').val('');
  }
});

Template.addProject.helpers({
  projReles: () => {
    return ProjRele.find({});
  }
});
