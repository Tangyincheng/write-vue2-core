import { mergeOptions } from '../util/index'

export default function initMixin(Vue) {
  Vue.mixin = function (mixin) {
    // 对象合并
    this.options = mergeOptions(this.options, mixin);
  }
}