import { observe } from './observer/index'

export function initState(vm) {
  const opts = vm.$options;
  // vue的数据来源 属性 方法 数据 计算属性 watch
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}

function initProps() { }
function initMethod() { }

// 取值时实现代理
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue;
    }
  })
}
function initData(vm) {
  // 数据初始化工作
  let data = vm.$options.data; // 用户传递的data
  // 用户可以通过 vm._data 拿到data
  // 用户传参中的data可以是函数的形式(函数返回一个对象)也可以是对象的形式，故做如下处理
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;

  // 对象劫持  用户改变了数据 期望可以得到通知 => 刷新页面
  // MVVM模式 数据变化可以驱动视图变化
  // Object.defineProperty(): 给属性增加get方法和set方法

  // 为了让用户更好的使用 可以直接vm.xxx
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data); // 响应式原理

}
function initComputed() { }
function initWatch() { }