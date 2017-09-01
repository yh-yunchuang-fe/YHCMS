import storeList from '../uistates/storeList.store';

function set(list) {
  storeList.set('storeList',list);
}

function get() {
  return storeList.get('storeList');
}

export {
  set,
  get
}
