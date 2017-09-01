import { ReactiveDict } from "meteor/reactive-dict";
const storeList = new ReactiveDict('storeList');
storeList.set('list', []);
export default storeList;
