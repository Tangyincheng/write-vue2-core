import { initMixin } from './init';
import { renderMixin } from './render';
import { lifecycleMixin } from './lifeCycle';

import { initGlobalAPI } from './initGlobalAPI/index'

function Vue(options) {
  // 进行Vue的初始化操作
  this._init(options);
}

// 通过引入文件的方式，给Vue原型上添加方法
initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);

// 初始化全局api
initGlobalAPI(Vue);
export default Vue;
