import { isObject } from '../util/index';
import { arrayMethods } from './array';
import Dep from './dep';
// 把data中的数据 都使用Object.defineProperty重新定义 es5

class Observer {
  constructor(value) { // 仅仅是初始化的操作

    this.dep = new Dep(); // 这个dep是给数组用的

    // 在value上添加 __ob__ 属性，该属性的值等于 this，即 Observer。
    // 目的：为了在重写数组的方法中能够调用 observeArray。
    // 这里设置 enumerable：false，是为了防止死循环，而造成内存移除
    Object.defineProperty(value, "__ob__", {
      enumerable: false,
      configurable: true,
      value: this
    })
    // 如果vue的数据层次过多，需要递归解析对象中的属性，依次增加set和get方法
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods;
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
  // 如果是多层级的对象，需要递归调用
  let childOb = observe(value);
  // 递归实现深度检测
  // 这里这个value可能是数组 也可能是对象，返回的结果boserver的实例，当前这个value对应的observer
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    // 获取值的时候，做一些操作
    get() {
      // 每个属性都对应着自己的watcher
      if (Dep.target) {
        console.log('收集')
        // 如果当前有watcher，则需要将watcher存起来
        dep.depend();
        // 数组的依赖收集
        if (childOb) {
          // 收集数组的相关依赖
          childOb.dep.depend();
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
      // 数据改变时，如果新数据等于旧的数据，则不做处理
      if (newValue === value) return;
      console.log('数据变化');
      // 继续劫持用户设置的值，因为用户设置的的值也是一个对象
      observe(newValue)
      value = newValue;

      dep.notify(); // 通知依赖的watcher更新操作
    }
  })
}

function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    // 将数组中的每一项都取出来，数据变化后 也需要更新试图
    let current = value[i];
    // 数组中的数组的依赖收集
    current.__ob__ && current.__ob__.dep.depend();
    if (Array.isArray(current)) {
      dependArray(current);
    }
  }
}

export function observe(data) {
  // 如果data不是对象，则不做处理
  if (!(typeof data === "object" && data !== null)) {
    return;
  }
  return new Observer(data); // 用来观测数据
}