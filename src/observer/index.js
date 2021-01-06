import { isObject, def } from '../util/index';
import { arrayMethods } from './array';
import Dep from './dep';

// 把data中的数据 都使用Object.defineProperty重新定义 es5
// Object.defineProperty 不能兼容ie8及以下 vue2 无法兼容ie8及以下版本

class Observer {
  constructor(value) { // 仅仅是初始化的操作
    this.dep = new Dep(); // 这个dep是给数组用的

    // 如果vue的数据层次过多，需要递归解析对象中的属性，依次增加set和get方法
    // value.__ob__ = this; // 给每个监控过的对象都增加一个__bo__属性
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 如果是数组的话，并不会对索引进行观测，因为会导致性能消耗过大
      // 前端开发中很少操作索引    push  shift  unshift
      value.__proto__ = arrayMethods;
      // 如果数组里放的是对象，再监控
      this.observeArray(value);
    } else {
      this.walk(value);
    }

  }

  observeArray(value) {
    for (let i = 0; i < value.length; i++) {
      observe(value[i]);
    }
  }

  walk(data) {
    let keys = Object.keys(data); // 拿到所有的key
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key, value) {
  let dep = new Dep(); // 这个dep是给对象使用的
  // 递归实现深度检测
  // 这里这个value可能是数组 也可能是对象，返回的结果是observer的实例，当前这个value对应的observer
  let childOb = observe(value);
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    // 获取值的时候，做一些操作
    get() {
      // 每个属性都对应着自己的watcher
      if (Dep.target) {
        // 如果当前有watcher，则需要将watcher存起来
        dep.depend();
        if (childOb) { // 数组的依赖收集
          childOb.dep.depend(); // 收集数组的相关依赖

          // 如果数组中还有数组
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    // 设置值的时候做一些操作
    set(newValue) {
      if (newValue === value) return;
      // 继续劫持用户设置的值，因为用户设置的的值也是一个对象
      observe(newValue);
      value = newValue;

      dep.notify(); // 通知依赖的watcher更新操作
    }
  })
}

function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    let current = value[i]; // 将数组中的每一个都去出来，数据变化后 也需要更新试图
    // 数组中的数组的依赖收集
    current.__ob__ && current.__ob__.dep.depend();
    if (Array.isArray(current)) {
      dependArray(current);
    }
  }
}

export function observe(data) {
  if (!isObject(data)) {
    return;
  }
  return new Observer(data); // 用来观测数据
}