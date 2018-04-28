import { Template } from 'meteor/templating';
import { DBimage, Projects, MiniCode } from '../../../universal/collections';
import { ReactiveVar } from "meteor/reactive-var";
import { getCitys, setCitys } from '../../stores/uiactions/storeCitys.action';
import { showSpin, closeSpin } from '../../stores/uiactions/spin.action';
import { getStore } from '../../stores/uiactions/willdelete.action';
import Http from '../../Http';

const filter = ['LPAwe8HETN4j7SGXv', 'rMjpdavyc2SJjBwMg'];

Template.imageEditor.onCreated(function() {
  this.date = new ReactiveVar(Date.now());
  this.search = new ReactiveVar({
    city: '1',
    store: '2',
    shop: ''
  });
  this._stores = new ReactiveVar([]);
  Http.get({
    url: 'https://activity.yonghuivip.com/api/app/shop/citys'
  })
  .then(response => {
    if (response.code === 0 && response.data) {
      const citys = response.data.citys;
      setCitys(citys);
    }
  })
  const params = {
    cityid: 1,
    isonlyscancode: 1
  };
  Http.get({
    url: 'https://activity.yonghuivip.com/api/app/shop/storelist',
    params
  })
  .then(response => {
    if (response.code === 0 && response.data) {
      const _stores = [];
      response.data.list.map((key) => {
        key.stores.map((_k) => {
          _stores.push(_k.id);
        });
      });
      this._stores.set(_stores);
    }
  })
})

Template.imageEditor.events({
  'click #delete'(event, instance) {
    if (getStore().image.length === 0) {
      alert('请至少选中一项');
      return;
    }
    showSpin();
    Meteor.call('deleteImage', getStore().image, (err, result) => {
      if (!err) {
        console.log(result);
        alert(result);
        closeSpin();
      }
    });
  },
  'dragover .drop-here'(e, instance) {
    e.preventDefault();
  },
  'dragenter .drop-here'(e, instance) {
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
  'dragenter .image-editor-page'(event, instance) {
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
    instance.$(event.currentTarget).animate({ top: -25 });
    instance.$('.title').fadeOut(300);
  },
  'mouseleave .add-hover'(event, instance) {
    instance.$(event.currentTarget).animate({ top: -70 });
    instance.$('.title').fadeIn(300);
  },
  'click .add-hover'(event, instance) {
    instance.$('#filer').click();
  },
  'input #shop'(event, instance) {
    const value = event.currentTarget.value;
    const miniSearch = instance.search.get();
    miniSearch.shop = value;
    instance.search.set(miniSearch)
  },
  'change #city'(event, instance) {
    const value = event.currentTarget.value;
    const miniSearch = instance.search.get();
    miniSearch.city = value;
    instance.search.set(miniSearch)
    const params = {
      cityid: event.currentTarget.value,
      isonlyscancode: 1
    };
    Http.get({
      url: 'https://activity.yonghuivip.com/api/app/shop/storelist',
      params
    })
    .then(response => {
      if (response.code === 0 && response.data) {
        pushCityAvilableStores(response.data.list, instance);
      }
    })
  },
  'change #store'(event, instance) {
    const value = event.currentTarget.value;
    const miniSearch = instance.search.get();
    miniSearch.store = value;
    instance.search.set(miniSearch)
  }
})

function pushCityAvilableStores(list, instance) {
  const _stores = [];
  list.map((key) => {
    key.stores.map((_k) => {
      _stores.push(_k.id);
    });
  });
  instance._stores.set(_stores);
}

function copy(obj) {
  const newObj = {};
  for (let prop in obj) {
    if (prop !== '') {
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
}

Template.imageEditor.helpers({
    images: () => {
      console.log(Template.instance()._stores ? Template.instance()._stores.get() : '');
      if (!Meteor.userId()) {
        return FlowRouter.go('/');
      }
      const search = Template.instance().search.get();
      const options = {
        projId: FlowRouter.getParam('projectid')
      }
      if (filter.includes(options.projId)) {
        options.shopId = {
          $in: Template.instance()._stores ? Template.instance()._stores.get() : []
        };
        if (search.city && search.city !== '') {
          options.cityId = search.city;
        }
        if (search.shop && search.shop !== '') {
          options.name = new RegExp(search.shop);
        }
        if (search.store && search.store !== '') {
          const sellerId = search.store.split(',');
          options.sellerId = {
            $in: sellerId
          }
        }
      }
      const imgs = DBimage.find(options, { sort: { updateAt: -1 } });
      const _imgs = [];
      const months = [];
      imgs.map((img) => {
        if (img.updateAt) {
          const d = new Date(img.updateAt);
          img.time = `${d.getFullYear()}年 ${d.getMonth() + 1}月`
        } else {
          img.time = '上传时间因系统原因未及时更新，请重新上传'
        }
        const date = new Date(img.updateAt);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (!isNaN(month) && !isNaN(year) && !months.includes(`${month}#${year}`)) {
          img.show_time_line = true;
          months.push(`${month}#${year}`);
        }
        if ((isNaN(month) || isNaN(year)) && !months.includes(`${month}#${year}`)) {
          img.show_time_line = true;
          months.push(`${month}#${year}`);
        }
        const _img = copy(img);
        _imgs.push(_img);
      });
      return _imgs;
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
    },
    profile_seller: () => {
      if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.seller) {
        return Meteor.user().profile.seller;
      } else {
        return false;
      }
    },
    miniCodeUrl: () => {
      return MiniCode.find({});
    },
    citys: () => {
      return getCitys();
    }
})
