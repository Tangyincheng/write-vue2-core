const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;  // 匹配 {{}}

// children 中的内容解析
function gen(node) {
  if (node.type == 1) {
    // 元素标签 递归解析
    return generate(node);
  } else {
    // children 为文本
    let text = node.text; // hello{{ name }} => "hello"+_s(name)
    // 每次使用正则时将 lastIndex 归零
    let lastIndex = defaultTagRE.lastIndex = 0;
    let tokens = [];
    let match, index = 0;
    // 解析文本
    while (match = defaultTagRE.exec(text)) {
      index = match.index;
      // 例：解析 hello{{ name }}hello 中的 {{ name }} 前面的 hello
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      // 例：解析 hello{{ name }}hello 中的 {{ name }}
      tokens.push(`_s(${match[1].trim()})`);
      lastIndex = index + match[0].length;
    }
    // 例：解析 hello{{ name }} hello 中的 {{ name }} 后面的 hello
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    // 将结果拼接上 +
    return `_v(${tokens.join('+')})`;
  }
}

// 处理属性  拼接成属性的字符串
function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    // 解析 style
    if (attr.name === "style") {
      // style="color: red;" => {style: {color:'red'}}
      let obj = {};
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      });
      attr.value = obj;
    }
    // 拼接上 ,
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  // 去掉最后一个 ,
  return `{${str.slice(0, -1)}}`;
}

function genChildren(el) {
  let children = el.children;
  if (children && children.length > 0) {
    return `${children.map(c => gen(c)).join(',')}`;
  } else {
    return false;
  }
}

// 递归创建
export function generate(el) {
  // 获取子节点
  let children = genChildren(el);
  let code = `_c("${el.tag}",${el.attrs.length ? genProps(el.attrs) : 'undefined'
    }${children ? `,${children}` : ''
    })`;

  return code
}