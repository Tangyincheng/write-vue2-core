import { parseHTML } from './paser-html';

import { generate } from './generate';

// ast语法树 是用对象描述原生语法   虚拟dom用对象描述dom节点
export function compilerToFunction(template) {
  // 1) 解析html字符串 将html字符串 -> ast语法树
  let root = parseHTML(template);
  // 需要将ast语法树生成最终的render函数，就是字符串拼接(模板引擎)

  let code = generate(root);
  // 核心思路就是模板转化成 下面这段字符串
  // <div id="app"><p>hello {{name}}</p> hello</div>
  // 将ast树，再次转换成js的语法

  // 所有的模板引擎实现，都需要new Function + with
  let renderFn = new Function(`with(this){return ${code}}`)
  // _c('div', {id:app}, _c('p', undefined, _v('hello'+_s(name))), _v('hello))

  // vue的render 返回的是虚拟dom
  return renderFn;
}

{/* <div id="app">
  <p>hello</p>
</div>

let root = {
  tag: 'div',
  attr: [{ name: 'id', value: 'app' }],
  parent: null,
  type: 1,
  children: [{
    tag: 'p',
    attr: [],
    parent: root,
    type: 1,
    children: [{
      text: 'hello',
      type: 3
    }]
  }]
} */}