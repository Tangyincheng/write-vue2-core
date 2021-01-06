import { initState } from './state'
import { compilerToFunction } from './compiler/index';
import { mountComponent, callHook } from './lifeCycle'
import { mergeOptions } from './util/index'
import { nextTick } from './util/next-tick'

// 在原型上添加以恶init方法
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 数据劫持
    const vm = this; // Vue中使用this.$options 指代的就是用户传递的属性

    // 将用户传递的 和 全局的进行合并
    vm.$options = mergeOptions(vm.constructor.options, options);

    // 调用 beforeCreate
    callHook(vm, 'beforeCreate');
    // 初始化状态
    initState(vm); // 分割代码

    // 调用 created
    callHook(vm, 'created')
    // 如果用户传入了el属性 需要将页面渲染出来
    // 如果用户传入了el 就要实现挂载流程

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    // 默认先查找有没有render方法，没有render再采用template，template也没有就使用el中的内容
    if (!options.render) {
      // 对模板进行编译
      let template = options.template; // 取出模板
      if (!template && el) {
        template = el.outerHTML;
      }
      // 编译
      const render = compilerToFunction(template);
      options.render = render;
      // 我们需要将template 转化成render方法vue1.0 2.0 虚拟dom

    }
    // options.render

    // 渲染当前的组件 挂载这个组件
    mountComponent(vm, el);
  }

  // 用户调用的nextTick
  Vue.prototype.$nextTick = nextTick
}
