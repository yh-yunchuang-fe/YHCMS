import {Template} from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import willdeleteStore from '../../stores/uistates/willdelete.store';
import { initStore, setStore, getStore } from '../../stores/uiactions/willdelete.action';
import { setDragEle, getDragEle } from '../../stores/uiactions/dragStore.action';
import { DBsvg } from '../../../universal/collections';

Template.svgfile.onCreated(function() {
  this.clicked = new ReactiveVar(false);
  initStore();
  this.currentData = new ReactiveVar(Template.currentData().svg);
})

Template.svgfile.events({
  'click .svgfile'(event, instance) {
    event.preventDefault();
    if (Meteor.user() && Meteor.user().profile.isView) {
      const fileId = instance.currentData.get().fileId;
      const collections = getStore();
      if (!collections.svg.includes(fileId)) {
        collections.svg.push(fileId);
      } else {
        const position = collections.svg.indexOf(fileId);
        collections.svg.splice(position, 1);
      }
      setStore(collections);
      const clicked = instance.clicked.get();
      instance.clicked.set(!clicked);
    }
  },
  'dragstart .svgfile'(event, instance) {
    setDragEle(instance.$(event.currentTarget).attr('id'));
  },
  'dragover .drop-left,.drop-right'(event, instance) {
    event.preventDefault();
  },
  'drop .drop-left'(event, instance) {
    event.preventDefault();
    const currentEle = instance.$(event.currentTarget).parents('.svg-editor-page').find('#' + getDragEle())[0];
    if(currentEle != instance.$(event.currentTarget).parent()[0]) {
        instance.$(event.currentTarget).parent().before(currentEle);
        updateDBsvg(event, instance);
    }
  },
  'drop .drop-right'(event, instance) {
    event.preventDefault();
    const currentEle = instance.$(event.currentTarget).parents('.svg-editor-page').find('#' + getDragEle())[0];
    if(currentEle != instance.$(event.currentTarget).parent()[0]) {
        instance.$(event.currentTarget).parent().after(currentEle);
        updateDBsvg(event, instance);
    }
  }
})

function updateDBsvg(event, instance) {
  const page = instance.$(event.currentTarget).parents('.svg-editor-page');
  page.find('.svgfile').each(function(index, el) {
    const id = page.find(el).attr('id');
    DBsvg.update({ _id: id }, { $set: { index } });
  });
}

Template.svgfile.helpers({
  opacity: () => {
    if (Template.instance().clicked.get()) {
        return 1;
    } else {
      return 0;
    }
  },
  svgName: () => {
    const svg = Template.instance().currentData.get();
    if (svg) {
      return svg.name.split('.svg')[0]
    }
    return '';
  }
})
