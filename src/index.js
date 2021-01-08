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

// dome 产生两个虚拟节点进行比对

// template -> render方法 -> vnode

import { compilerToFunction } from './compiler/index'
import { createElm, patch } from './vdom/patch'

let vm1 = new Vue({
  data: { name: 'hello' }
})
let render1 = compilerToFunction(`<div id='app' a='1' style='background:red'>
  <div style="background:red" key="A">A</div>
  <div style="background:yellow" key="B">B</div>
  <div style="background:blue" key="C">C</div>
</div>`)
let vnode = render1.call(vm1);

let el = createElm(vnode);
document.body.appendChild(el);

let vm2 = new Vue({
  data: { name: 'yctang', age: 18 }
})

let render2 = compilerToFunction(`<div id="aaa" b="2" style="color:blue">
  <div style="background:green" key="Q">Q</div>
  <div style="background:red" key="A">A</div>
  <div style="background:yellow" key="F">F</div>
  <div style="background:blue" key="C">C</div>
  <div style="background:green" key="N">N</div>
</div>`)
let newVnode = render2.call(vm2);

setTimeout(() => {
  patch(vnode, newVnode); // 传入两个虚拟节点，会在内部进行比对
}, 3000)


// 1. diff算法的特点是 平级比对，正常操作dom元素时，很少涉及到父变成子，子变成父

