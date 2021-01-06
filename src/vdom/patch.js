export function patch(oldVnode, vnode) {
  // 判断是更新还是要渲染
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) { // 第一次渲染，oldVnode是真实dom
    const oldElm = oldVnode; // div id = "app"
    const parentElm = oldElm.parentNode; // body

    // 递归创建真实节点  替换掉老的节点
    let el = createElm(vnode);
    // 添加新的dom
    parentElm.insertBefore(el, oldElm.nextSibling);
    // 删除旧的dom
    parentElm.removeChild(oldElm);

    // 需要将渲染好的结果返回
    return el;
  }
}

// 根据虚拟节点创建真实的节点
function createElm(vnode) {
  let { tag, children, key, data, text } = vnode;
  // 是标签就创建标签
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    // 更新属性
    updateProperties(vnode);
    // 递归创建子节点，将子节点添加到父节点上
    children.forEach(child => {
      return vnode.el.appendChild(createElm(child));
    })
  } else {
    // 如果不是标签就是文本
    // 虚拟dom上映射着真实dom 方便后续更新操作
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

// 更新属性
function updateProperties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el;
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === 'class') {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}
