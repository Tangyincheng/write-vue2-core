import Watcher from './observer/watcher';
import { patch } from './vdom/patch';

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 虚拟节点对应的内容
    const prevVnode = vm._vnode;
    // 第一次默认 不需要diff算法
    vm._vnode = vnode; // 真实渲染的内容

    // 通过虚拟节点，渲染出真实的dom
    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode);  // 需要用虚拟节点创建真实节点 替换 真实的$el
    } else {
      vm.$el = patch(prevVnode, vnode);
    }
  }
}

export function mountComponent(vm, el) {
  const options = vm.$options;
  vm.$el = el; // 真实的dom元素

  // Watcger 用于渲染
  // vm._render 通过解析render方法 渲染出虚拟dom _c _v _s
  // vm._update 通过虚拟dom 创建真实的dom

  // 调用 boforeMount
  callHook(vm, 'beforeMount');
  // 渲染页面
  let updateComponent = () => { // 无论是渲染还是更新都会调用此方法
    // 返回的是虚拟dom
    // 由Watcher监听render生成vnode，并由update生成真实dom并挂载
    vm._update(vm._render());
  }
  // 渲染watcher 每个组件都有一个watcher vm.$watch(()=>{})
  new Watcher(vm, updateComponent, () => { }, true) // true 表示他是一个渲染watcher

  // 调用 mounted
  callHook(vm, 'mounted');
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  // 找到对应的钩子一次执行
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}
