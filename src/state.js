import Dep from './observer/dep'
import { observe } from './observer/index'
import Watcher from './observer/watcher'
import { isObject } from './util/index'

export function initState(vm) {
  const opts = vm.$options
  // vue的数据来源 属性 方法 数据 计算属性 watch
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethod(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm, opts.computed)
  }
  if (opts.watch) {
    initWatch(vm, opts.watch)
  }
}

function initProps() {}
function initMethod() {}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    },
  })
}
function initData(vm) {
  // 数据初始化工作
  let data = vm.$options.data // 用户传递的data
  // 用户可以通过 vm._data 拿到data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data

  // 对象劫持  用户改变了数据 期望可以得到通知 => 刷新页面
  // MVVM模式 数据变化可以驱动视图变化
  // Object.defineProperty(): 给属性增加get方法和set方法

  // 为了让用户更好的使用 可以直接vm.xxx
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data) // 响应式原理
}

// 内部原理都是通过watcher实现的
function initComputed(vm, computed) {
  // _computedWatcher 存放着所有的计算属性对应的watcher
  const watcher = (vm._computedWatchers = {})
  for (let key in computed) {
    const userDef = computed[key] // 获取用户的定义函数
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    // 获得getter函数 lazy: true 表示的就是computed 计算属性
    // 内部会根据lasy属性，不去调用getter
    watcher[key] = new Watcher(vm, getter, () => {}, { lazy: true })
    // 计算属性可以直接通过vm进行取值，所以将属性定义到实例上
    defineComputed(vm, key, userDef)
  }
}

// 属性描述器
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: () => {},
  set: () => {},
}

function defineComputed(target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key)
  } else {
    sharedPropertyDefinition.get = createComputedGetter(key)
    sharedPropertyDefinition.set = userDef.set || (() => {})
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter(key) {
  return function () {
    // 拿到刚才的watcher
    let watcher = this._computedWatchers[key]
    if (watcher.dirty) {
      // 如果dirty为true 就调用用户的方法
      watcher.evaluate()
    }
    if (Dep.target) {
      // watcher 指代的是计算属性 watcher
      watcher.depend() // 渲染watcher 也一并收集起来
    }
    return watcher.value
  }
}

// watch的原理是通过Watcher
function initWatch(vm, watch) {
  for (let key in watch) {
    // 获取key对应的值
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        // 如果用户传递的是一个数组，就循环数组将值依次进行创建
        createWatcher(vm, key, handler[i])
      }
    } else {
      // 单纯的key value
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher(vm, key, handler, options) {
  if (isObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm.$options.methods[handler]
  }

  // watch的原理 就是$watch
  return vm.$watch(key, handler, options)
}

export function stateMixin(Vue) {
  Vue.prototype.$watch = function (exprOrFn, cb, options) {
    const vm = this
    console.log(exprOrFn, cb, options)
    // 用户watcher
    options.user = true // 当前是用户自己写的watcher
    new Watcher(vm, exprOrFn, cb, options)
  }
}
