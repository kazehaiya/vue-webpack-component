import MyVueComponent from './components/my-vue-component';

// 方便解构
export { MyVueComponent };

const AllComponent = [
  MyVueComponent
];

const installFunc = function(Vue, opt ={}) {
  AllComponent.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install: installFunc,
  MyVueComponent
};