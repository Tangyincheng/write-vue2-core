import { initMixin } from './init';
import { renderMixin } from './render';
import { lifecycleMixin } from './lifeCycle';

// Vue的核心代码
function Vue(options) {
  // 进行Vue的初始化操作
  this._init(options);
}
// 通过引入文件的方式，给Vue原型上添加方法
initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);

export default Vue;