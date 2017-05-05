import { ReactiveDict } from "meteor/reactive-dict";
const searchStore = new ReactiveDict('searchStore');
searchStore.set('value', '');
export default searchStore;
