import { pushTarget, popTarget } from './dep.js';
import { queueWatcher } from './schedule';

let id = 0;

class Wathcer {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    this.options = options;
    this.id = id++;
    this.getter = exprOrFn; // 将内部传过来的回调函数 放到getter属性上
    this.depsId = new Set(); // es6中的集合（不能放重复项）
    this.deps = [];

    this.get(); // 调用get方法 会让渲染watcher执行
  }
  // watcher 里不能放重复的dep dep里不能放重复的watcher
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }

  get() {
    pushTarget(this); // 把watcher存起来
    this.getter();  // 渲染watcher执行
    popTarget(); // 移除watcher
  }
  update() {
    // 等待着 一起更新 因为每次调用update的时候 都放入了watcher
    // this.get()
    // ----- 添加代码
    queueWatcher(this);
    // -----
  }
  // ----- 添加代码
  run() {
    this.get();
  }
  // -----
}

// ----- 添加代码
// let queue = [];
// let has = {};

// function queueWatcher(watcher) {
//   const id = watcher.id;
//   if (has[id] == null) {
//     queue.push(watcher);
//     has[id] = true;
//     setTimeout(function () {
//       queue.forEach(watcher => watcher.run())
//       queue = [];
//       has = {};
//     })
//   }
// }
// -----
export default Wathcer;
