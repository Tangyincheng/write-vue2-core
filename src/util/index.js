export const isObject = (val) => typeof val === "object" && val !== null;

export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: true,
    value
  })
}

// 生命周期列举
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
]

let strats = {}

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return [childVal];
    }
  } else {
    return parentVal
  }
}

// 合并生命周期
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

export function mergeOptions(parent, child) {
  const options = {};
  // 将 parent 上的属性与 child 进行合并
  for (let key in parent) {
    mergeFild(key);
  }
  // 将 child 上的属性与 parent 进行合并
  for (let key in child) {
    // 如果已经合并过了就不需要再次合并了
    if (!parent.hasOwnProperty(key)) {
      mergeFild(key);
    }
  }
  // 默认的合并策略 但是有些属性 需要有特殊的合并方式 生命周期的合并
  function mergeFild(key) {
    // ----- 添加代码
    // 生命周期合并，另作处理（声明了多个相同的生命周期已数组的方式合并）
    if (strats[key]) {
      return options[key] = strats[key](parent[key], child[key])
    }
    // -----
    // parent 和 child 都是对象
    if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key],
        ...child[key]
      }
    }
    else if (child[key] === null) {
      options[key] = parent[key];
    } else {
      options[key] = child[key];
    }
  }

  return options;
}
