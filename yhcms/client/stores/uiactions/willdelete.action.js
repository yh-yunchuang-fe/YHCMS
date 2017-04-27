import willdeleteStore from '../uistates/willdelete.store';

function initStore() {
  willdeleteStore.set('collections', {
    svg: [],
    image: [],
    html: [],
    proj: []
  });
}

function getStore(collections) {
  return willdeleteStore.get('collections');
}

function setStore(collections) {
  willdeleteStore.set('collections', collections);
}

export { initStore, getStore, setStore };
