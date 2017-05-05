import searchStore from '../uistates/search.store';

function setStore(value) {
  searchStore.set('value', value);
}

function getStore() {
  return searchStore.get('value');
}

export {
  setStore,
  getStore
}
