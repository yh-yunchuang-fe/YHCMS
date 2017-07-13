import {Template} from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import { openModal, closeModal } from '../../stores/uiactions/modal.action';
import { DBimage } from '../../../universal/collections';
import willdeleteStore from '../../stores/uistates/willdelete.store';
import { initStore, setStore, getStore } from '../../stores/uiactions/willdelete.action';

Template.showfile.onCreated(function() {
  this.clicked = new ReactiveVar(false);
  initStore();
  this.currentData = new ReactiveVar(Template.currentData().image);
  this.isView = new ReactiveVar(Meteor.user().profile.isView);
})

Template.showfile.events({
  'click .show-file'(event, instance) {
    if (Meteor.user() && Meteor.user().profile.isView) {
      const fileId = instance.currentData.get().fileId;
      const collections = getStore();
      if (!collections.image.includes(fileId)) {
        collections.image.push(fileId);
      } else {
        const position = collections.image.indexOf(fileId);
        collections.image.splice(position, 1);
      }
      setStore(collections);
      const clicked = instance.clicked.get();
      instance.clicked.set(!clicked);
    }
  },
  'click .html-top-cantainer'(event, instance) {
    window.open(`${instance.currentData.get().src.split('?v=')[0]}?v=${Date.now()}`)
  },
  'click .prepare-delete'(event, instance) {
    event.stopPropagation();
    instance.$(event.currentTarget).fadeOut(300);
    const fileId = instance.currentData.get().fileId;
    const collections = getStore();
    const position = collections.image.indexOf(fileId);
    collections.image.splice(position, 1);
    setStore(collections);
  },
  'click .bar-img'(event, instance) {
    event.stopPropagation();
    if (instance.$(event.currentTarget).attr('index') == 1) {
      window.open(`${instance.currentData.get().src.split('?v=')[0]}?v=${Date.now()}`)
    } else {
      instance.$('.prepare-delete').fadeIn(300)
      if (instance.isView.get()) {
        const fileId = instance.currentData.get().fileId;
        const collections = getStore();
        if (!collections.image.includes(fileId)) {
          collections.image.push(fileId);
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
        window.open(`${instance.currentData.get().src.split('?v=')[0]}?v=${Date.now()}`)
      }).find('span').text('查看');
    } else {
      instance.$('.html-mask').unbind('click').fadeIn(200).click(() => {
        /* Act on the event */
        instance.$('.prepare-delete').fadeIn(300);
        if (instance.isView.get()) {
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
  // 'mouseenter .show-file'(event, instance) {
  //   instance.$('.img-name').fadeIn(200);
  // },
  // 'mouseleave .show-file'(event, instance) {
  //   instance.$('.img-name').fadeOut(100);
  // },
})

Template.showfile.helpers({
  display: () => {
    if (Template.instance().isView.get()) {
        return 'block';
    } else {
      return 'none';
    }
  },
  opacity: () => {
    if (Template.instance().clicked.get()) {
        return 1;
    } else {
      return 0;
    }
  },
  right_trans: () => {
    let right_trans = -135;
    const id = Template.instance().currentData.get()._id;
    const percent = DBimage.findOne({ _id: id }) ? DBimage.findOne({ _id: id }).percent : 100;
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
    const percent = DBimage.findOne({ _id: id }) ? DBimage.findOne({ _id: id }).percent : 100;
    if (percent > 50) {
      right_trans += 3.6 * (percent - 50);
    } else {
      right_trans = -135;
    }
    return right_trans;
  },
  showprogress: () => {
    const id = Template.instance().currentData.get()._id;
    const image = DBimage.findOne({ _id: id });
    if (image) {
      return image.uploading;
    }
    return false;
  }
})
