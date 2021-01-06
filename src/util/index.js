export const isObject = (val) => typeof val === "object" && val !== null;

export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: true,
    value
  })
}

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'create',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestory',
  'destroyed'
]

let strats = {}

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal];
    }
  } else {
    return parentVal
  }
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

export function mergeOptions(parent, child) {
  const options = {};
  for (let key in parent) {
    mergeFild(key);
  }
  for (let key in child) { // 如果已经合并过了就不需要再次合并了
    if (!parent.hasOwnProperty(key)) {
      mergeFild(key);
    }
  }
  // 默认的合并策略 但是有些属性 需要有特殊的合并方式 生命周期的合并
  function mergeFild(key) {
    if (strats[key]) {
      return options[key] = strats[key](parent[key], child[key])
    }
    if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key],
        ...child[key]
      }
    } else if (child[key] === null) {
      options[key] = parent[key];
    } else {
      options[key] = child[key];
    }
  }

  return options;
}