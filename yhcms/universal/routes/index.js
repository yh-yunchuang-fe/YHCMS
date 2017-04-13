import {
  renderBasic,
  renderSlim
} from './helpers';

function route(FlowRouter) {
  FlowRouter.route('/',{
    name:'home',
    action: renderBasic.bind(this,'home')
  })
  FlowRouter.route('/image/:projectid',{
    name:'imageeditor',
    action: renderBasic.bind(this,'imageEditor')
  })
  FlowRouter.route('/svg/:projectid',{
    name:'svgeditor',
    action: renderBasic.bind(this,'svgEditor')
  })
  FlowRouter.route('/html/:projectid',{
    name:'htmleditor',
    action: renderBasic.bind(this,'htmlEditor')
  })
  FlowRouter.notFound = {
    action: renderSlim.bind(this,'notFound')
  }
}

export default route;
