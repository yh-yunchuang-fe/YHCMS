import storeCitys from '../uistates/storeCitys.store';

function setCitys(citys) {
  storeCitys.set('storeCitys',citys);
}

function getCitys() {
  return storeCitys.get('storeCitys');
}

export {
  setCitys,
  getCitys
}
