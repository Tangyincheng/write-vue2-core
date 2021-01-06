import Watcher from './observer/watcher';
import { patch } from './vdom/patch';

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 通过虚拟节点，渲染出真实的dom
    vm.$el = patch(vm.$el, vnode);  // 需要用虚拟节点创建真实节点 替换 真实的$el
  }
}

export function mountComponent(vm, el) {
  const options = vm.$options;
  vm.$el = el; // 真实的dom元素
  // 渲染页面
  let updateComponent = () => { // 无论是渲染还是更新都会调用此方法
    // 返回的是虚拟dom
    console.log("watcher");
    vm._update(vm._render());
  }
  // 渲染watcher 每个组件都有一个watcher vm.$watch(()=>{})
  new Watcher(vm, updateComponent, () => { }, true) // true 表示他是一个渲染watcher
}