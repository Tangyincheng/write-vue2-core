// 重写会导致数组本身发生变化的方法 push、shift、unshift、pop、reverse、sort、splice

let oldArrayMethods = Array.prototype;
// value.__proto__ = arrayMethods  原型链查找
// arrayMethods.__proto__ = oldArrayMethods

export const arrayMethods = Object.create(oldArrayMethods);

const methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'sort',
  'splice',
  'reverse'
]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    // AOP 切片编程
    const result = oldArrayMethods[method].apply(this, args) // 调用原生的数组方法
    // push unshift 添加的元素可能还是一个对象
    let inserted; // 当前用户插入的元素
    let ob = this.__ob__;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice': // 3个  新增的属性 aplice有删除 新增的功能
        inserted = args.splice(2)
      default:
        break;
    }
    if (inserted) {
      ob.observeArray(inserted); // 将新增属性继续观测
    }
    ob.dep.notify(); // 如果用户调用了 push方法 就通知当前这个dep更新
    return result;
  }
})
