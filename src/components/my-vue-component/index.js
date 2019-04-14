import MyVueComponent from './src/index';

MyVueComponent.install = function(Vue, opt = {}) {
  Vue.component(MyVueComponent.name, MyVueComponent);
};

export default MyVueComponent;
