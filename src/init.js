import { initState } from "./state";
import { compilerToFunction } from './compiler/index';
import { mountComponent } from './lifeCycle';
import { nextTick } from './util/next-tick';

// 在原型上添加一个init方法
export function initMixin(Vue) {
  // 初始化流程
  Vue.prototype._init = function (options) {
    // 数据劫持
    const vm = this; // vue中使用 this.$options 指代的就是用户传递的属性
    vm.$options = options;
    // 初始化状体
    initState(vm);
    // ---------添加部分
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
    // ---------
  }

  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    // 默认先查找有没有render方法，没有render再采用template，template也没有再使用 el 中的内容
    if (!options.render) {
      // 对模板进行编译
      let template = options.template; // 取出模板
      if (!template && el) {
        template = el.outerHTML;
      }
      // 编译
      const render = compilerToFunction(template);
      console.log('render', render);
      options.render = render;
      // 我们需要将template 转化成render方法vue1.0 2.0 虚拟dom
      console.log('options', options);
    }

    // 渲染当前的组件，挂载这个组件
    mountComponent(vm, el);
  }

  // 用户调用的nextTick
  Vue.prototype.$nextTick = nextTick
}
