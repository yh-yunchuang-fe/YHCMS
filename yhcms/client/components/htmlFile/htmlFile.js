import { Template } from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import { DBhtml } from '../../../universal/collections';
import { openModal, closeModal } from '../../stores/uiactions/modal.action';
import willdeleteStore from '../../stores/uistates/willdelete.store';
import { initStore, setStore, getStore } from '../../stores/uiactions/willdelete.action';

Template.htmlfile.onCreated(function() {
  this.clicked = new ReactiveVar(false);
  initStore();
  this.currentData = new ReactiveVar(Template.currentData().html);
  this.flag = new ReactiveVar(true);
})

Template.htmlfile.events({
  'click .look_btn'(event, instance) {
    event.stopPropagation();
    instance.$('a').attr('href', instance.currentData.get().openUrl.replace(/\s+/g, ''));
  },
  'click .html-top-cantainer'(event, instance) {
    instance.$('a').attr('href', instance.currentData.get().openUrl.replace(/\s+/g, ''));
    instance.$(`#${instance.currentData.get().fileId}`).click();
  },
  'click .prepare-delete'(event, instance) {
    event.stopPropagation();
    instance.$(event.currentTarget).fadeOut(300);
    const fileId = instance.currentData.get().fileId;
    const collections = getStore();
    const position = collections.html.indexOf(fileId);
    collections.html.splice(position, 1);
    setStore(collections);
  },
  'click .bar-img'(event, instance) {
    event.stopPropagation();
    if (instance.$(event.currentTarget).attr('index') == 1) {
      instance.$(event.currentTarget).parents('.html-editor-page').find('#downloadAssetsFrame').attr('src', `/downloadAssets?id=${instance.currentData.get()._id}`);
      instance.$(event.currentTarget).parents('.html-editor-page').find("#downloadAssetsFrame").load(function() {
        let json = $(this).contents().find("*").first().text();
        json = JSON.parse(json);
        if (json.code) {
          alert(json.error);
        }
      });
    } else {
      instance.$('.prepare-delete').fadeIn(300)
      if (Meteor.user() && Meteor.user().profile.isView) {
        const fileId = instance.currentData.get().fileId;
        const collections = getStore();
        if (!collections.html.includes(fileId)) {
          collections.html.push(fileId);
        }
        setStore(collections);
        openModal({title: '删除', contentTPL: 'predelete'});
      }
    }
  },
  'mouseenter .bar-img'(event, instance) {
    if (instance.$(event.currentTarget).attr('index') == 1) {
      instance.$('.html-mask').unbind('click').fadeIn(200).click(() => {
        /* Act on the event */
        instance.$(event.currentTarget).parents('.html-editor-page').find('#downloadAssetsFrame').attr('src', `/downloadAssets?id=${instance.currentData.get()._id}`);
        instance.$(event.currentTarget).parents('.html-editor-page').find("#downloadAssetsFrame").load(function() {
          let json = $(this).contents().find("*").first().text();
          json = JSON.parse(json);
          if (json.code) {
            alert(json.error);
          }
        });
      }).find('span').text('下载切图');
    } else {
      instance.$('.html-mask').unbind('click').fadeIn(200).click(() => {
        /* Act on the event */
        instance.$('.prepare-delete').fadeIn(300);
        if (Meteor.user() && Meteor.user().profile.isView) {
          const fileId = instance.currentData.get().fileId;
          const collections = getStore();
          if (!collections.html.includes(fileId)) {
            collections.html.push(fileId);
          }
          setStore(collections);
          openModal({title: '删除', contentTPL: 'predelete'});
        }
      }).find('span').text('删除');
    }
  },
  'mouseleave .html-bottom-cantainer'(event, instance) {
    instance.$('.html-mask').fadeOut(200);
  },
})

Template.htmlfile.helpers({
  display: () => {
    if (Meteor.user() && Meteor.user().profile.isView) {
        return 'block';
    } else {
      return 'none';
    }
  },
  right_trans: () => {
    let right_trans = -135;
    const id = Template.instance().currentData.get()._id;
    const percent = DBhtml.findOne({ _id: id }) ? DBhtml.findOne({ _id: id }).percent : 0;
    if (percent <= 50) {
      right_trans += 3.6 * percent;
    } else {
      right_trans = 45;
    }
    return right_trans;
  },
  left_trans: () => {
    let right_trans = -135;
    const id = Template.instance().currentData.get()._id;
    const percent = DBhtml.findOne({ _id: id }) ? DBhtml.findOne({ _id: id }).percent : 0;
    if (percent > 50) {
      right_trans += 3.6 * (percent - 50);
    } else {
      right_trans = -135;
    }
    return right_trans;
  },
  showprogress: () => {
    const id = Template.instance().currentData.get()._id;
    const html = DBhtml.findOne({ _id: id });
    if (html) {
      if (!html.uploading && Template.instance().flag.get()) {
        Template.instance().currentData.set(html);
        Template.instance().flag.set(false);
      }
      return html.uploading;
    }
    return false;
  }
})
