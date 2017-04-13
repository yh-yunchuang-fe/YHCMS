import { ReactiveDict } from "meteor/reactive-dict";
const willdeleteStore = new ReactiveDict('willdeleteStore');
willdeleteStore.set('collections', {
  svg: [],
  image: [],
  html: []
});
export default willdeleteStore;
