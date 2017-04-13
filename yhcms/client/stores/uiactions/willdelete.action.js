import willdeleteStore from '../uistates/willdelete.store';

function initStore() {
  willdeleteStore.set('collections', {
    svg: [],
    image: [],
    html: []
  });
}

function getStore(collections) {
  return willdeleteStore.get('collections');
}

function setStore(collections) {
  willdeleteStore.set('collections', collections);
}

export { initStore, getStore, setStore };
