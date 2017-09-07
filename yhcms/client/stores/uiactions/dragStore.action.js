import dragStore from '../uistates/dragStore.store';

function setDragEle(ele) {
  console.log(ele);
  dragStore.set('dragEle',ele);
}

function getDragEle() {
  return dragStore.get('dragEle');
}

export {
  setDragEle,
  getDragEle
}
