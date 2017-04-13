import spinStore from '../uistates/spin.store';

function showSpin() {
  spinStore.set('spin',true);
}

function closeSpin() {
  spinStore.set('spin',false);
}

export {
  showSpin,
  closeSpin
}
