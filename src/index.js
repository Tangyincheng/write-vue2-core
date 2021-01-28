import { initMixin } from './init';
import { renderMixin } from './render';
import { lifecycleMixin } from './lifeCycle';

import { initGlobalAPI } from './initGlobalAPI/index'

import { stateMixin } from './state'

function Vue(options) {
  // 进行Vue的初始化操作
  this._init(options);
}

// 通过引入文件的方式，给Vue原型上添加方法
initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);

stateMixin(Vue);

// 初始化全局api
initGlobalAPI(Vue);
export default Vue;

// dome 产生两个虚拟节点进行比对

// template -> render方法 -> vnode

// 1. diff算法的特点是 平级比对，正常操作dom元素时，很少涉及到父变成子，子变成父

