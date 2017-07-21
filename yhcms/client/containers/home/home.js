import { Template } from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import { openModal, closeModal } from '../../stores/uiactions/modal.action';
import { Projects, DBhtml, ProjRele } from '../../../universal/collections';
import { showSpin, closeSpin } from '../../stores/uiactions/spin.action';
import { getStore as getSearchStore, setStore } from '../../stores/uiactions/search.action';
import { getStore } from '../../stores/uiactions/willdelete.action';

Template.home.onCreated(function(){
  setStore('');
  const findType = window.localStorage.getItem('findType');
  let chooseProj = window.localStorage.getItem('chooseProj');
  this.dir = new ReactiveVar(true);
  if (chooseProj) {
    chooseProj = JSON.parse(chooseProj);
    this.rela = new ReactiveVar(chooseProj.projName);
  } else {
    this.rela = new ReactiveVar('');
  }
  if (findType) {
    this.findType = new ReactiveVar(findType);
  } else {
    window.localStorage.setItem('findType', 'html');
    this.findType = new ReactiveVar('html');
  }
  window.home = document.createEvent('Event');
  window.home.initEvent('search', true, true);
})

const types = ['image', 'svg', 'html'];

Template.home.rendered = function() {
  this.autorun(() => {
    const findType = window.localStorage.getItem('findType');
    const chooseProj = window.localStorage.getItem('chooseProj');
    Template.instance().dir.set(findType === 'html' && !chooseProj);
    let left = Template.instance().$(`.tab-${findType ? findType : 'html'} span`).offset().left;;
    Template.instance().$('.under-line').css('left', left - 20);
    Template.instance().$(`.tab-${findType ? findType : 'html'} span`).addClass('orange');
  })
}

Template.home.events({
  'click #delete'(event, instance) {
    if (getStore().proj.length === 0) {
      alert('请至少选中一项');
      return;
    }
    showSpin();
    Meteor.call('deleteProj', getStore().proj, (err, result) => {
      if (!err) {
        console.log(result);
        alert(result);
        closeSpin();
      }
    });
  },
  'click .tab'(event, instance) {
    instance.$('.tab span').removeClass('orange');
    const width = document.body.clientWidth;
    const type = instance.$(event.currentTarget).attr('index');
    instance.findType.set(type);
    if (type !== 'html') {
      instance.rela.set('');
      instance.dir.set(false);
    } else {
      let chooseProj = window.localStorage.getItem('chooseProj');
      if (chooseProj) {
        chooseProj = JSON.parse(chooseProj);
        instance.rela.set(chooseProj.projName);
        instance.dir.set(false);
      } else {
        instance.rela.set('');
        instance.dir.set(true);
      }
    }
    window.localStorage.setItem('findType', type);
    const left = instance.$(`.tab-${type} span`).offset().left - 20;
    const underline = instance.$('.under-line');
    underline.animate({ left });
    instance.$(`.tab-${type} span`).addClass('orange');
  },
  'mouseenter .add-hover'(event, instance) {
    instance.$(event.currentTarget).animate({ top: -30 });
  },
  'mouseleave .add-hover'(event, instance) {
    instance.$(event.currentTarget).animate({ top: -70 });
  },
  'click .add-hover'(event, instance) {
    instance.$('.project-btn').click();
  },
  'dblclick .html-dir'(event, instance) {
    const rela = instance.$(event.currentTarget).find('span').text();
    instance.dir.set(false);
    instance.rela.set(rela);
    window.localStorage.setItem('chooseProj', JSON.stringify({
      projName: rela
    }));
  },
  'click .goBack'(event, instance) {
    instance.dir.set(true);
    instance.rela.set('');
    window.localStorage.removeItem('chooseProj');
  },
  'search .home-container'(event, instance) {
    if (instance.findType.get() === 'html') {
      instance.dir.set(event.originalEvent.data);
    } else {
      instance.dir.set(false);
    }
  }
});

Template.home.helpers({
  openProject: ()=>{
    return (project)=>{
      const {
        _id, type
      } = project;
      if (types.includes(type)) {
        FlowRouter.go(`${type}editor`, {projectid:_id});
      } else {
        console.log('自定义页面');
      }
    }
  },
  addProject: ()=>{
    return ()=>{
      openModal({title: '新建项目', contentTPL: 'addProject'});
    }
  },
  projects: ()=>{
    const type = Template.instance().findType.get();
    const rela = Template.instance().rela.get();
    const dir = Template.instance().dir.get();
    const searchObj = { type };
    if (type === 'html' && rela === '' && dir) {
      return [];
    }
    if (rela !== '' && type === 'html') {
      searchObj.rela = rela;
    }
    if (getSearchStore() !== '') {
      searchObj['$or'] = [{ name: new RegExp(`${getSearchStore()}`), type }];
      const html = DBhtml.find({ dirName: new RegExp(`${getSearchStore()}`) });
      const ids = [];
      html.map((key) => {
        ids.push(key.projId);
      });
      if (ids.length > 0) {
        searchObj['$or'].push({ _id: { $in: ids }, type });
      }
    }
    return Projects.find(searchObj, { sort: { createdAt: -1 } });
  },
  user: () => {
    return Meteor.userId();
  },
  view: () => {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
      return true;
    } else {
      return false;
    }
  },
  dir: () => {
    return Template.instance().dir.get();
  },
  projReles: () => {
    return ProjRele.find({});
  },
  goback: () => {
    if (!Template.instance().dir.get() && Template.instance().findType.get() === 'html') {
      return true;
    }
    return false;
  }
})
