import { ReactiveDict } from "meteor/reactive-dict";
const spinStore = new ReactiveDict('spinStore');
spinStore.set('spin', false);
export default spinStore;
