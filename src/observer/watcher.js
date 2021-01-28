import { pushTarget, popTarget } from './dep.js'
import { queueWatcher } from './schedule'

// 保证watcher得唯一性
let id = 0

class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm
    this.callback = callback
    this.options = options
    this.sync = options.sync
    this.id = id++
    // this.getter = exprOrFn; // 将内部传过来的回调函数 放到getter属性上
    this.depsId = new Set() // es6中的集合（不能放重复项）
    this.deps = []
    this.user = options.user // 用来表示watcher的状态
    this.lazy = options.lazy
    this.dirty = this.lazy

    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else {
      // 将getter方法封装成一个取值函数
      this.getter = function () {
        let path = exprOrFn.split('.')
        let val = vm
        for (let i = 0; i < path.length; i++) {
          val = val[path[i]]
        }
        return val
      }
    }

    this.value = this.lazy ? undefined : this.get() // 调用get方法 会让渲染watcher执行
  }
  // watcher 里不能放重复的dep dep里不能放重复的watcher
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

  get() {
    pushTarget(this) // 把watcher存起来 Dep.target
    let value = this.getter.call(this.vm) // 渲染watcher执行
    popTarget() // 移除watcher
    return value
  }

  update() {
    if (this.sync) {
      this.run()
    } else if (this.lazy) {
      // 计算属性依赖的值发生变化
      this.dirty = true
    } else {
      // 等待着 一起更新 因为每次调用update的时候 都放入了watcher
      // this.get()
      queueWatcher(this)
    }
  }
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  run() {
    let oldValue = this.value // 第一次渲染的值
    let newValue = this.get()
    this.value = newValue
    // 当前是用户watcher 就执行用户定义的callback
    if (this.user) {
      this.callback.call(this.vm, oldValue, newValue)
    }
  }
  depend() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
}

export default Watcher
