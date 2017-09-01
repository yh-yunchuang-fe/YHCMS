import { ReactiveDict } from "meteor/reactive-dict";
const storeCitys = new ReactiveDict('storeCitys');
storeCitys.set('storeCitys', []);
export default storeCitys;
