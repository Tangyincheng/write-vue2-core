// ?:匹配不捕获
// arguments[0] = 匹配到的标签  arguments[1] 匹配到的标签名字
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // abc-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 匹配的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的</div>

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 > <div>

export function parseHTML(html) {
  let root = null; // ast语法树的树根
  let currentParent; // 标识当前父亲是谁
  let stack = [];
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }

  // 开始标签
  function start(tagName, attrs) {
    // 遇到开始标签 就创建一个ast元素
    let element = createASTElement(tagName, attrs);
    if (!root) {
      root = element;
    }
    // 把当前元素标记成父ast树
    currentParent = element;
    // 将开始标签存放到栈中
    stack.push(element);
  }

  // 文本
  function chars(text) {
    // 去掉空格
    text = text.replace(/\s/g, '');
    if (text) {
      currentParent.children.push({
        text,
        type: TEXT_TYPE
      })
    }
  }

  // 结束标签
  function end(tagName) {
    let element = stack.pop();  // 拿到的是ast对象
    // 标识当前这个标签属于这个div的儿子
    currentParent = stack[stack.length - 1];
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element); // 实现了一个树的父子关系
    }
  }

  // 不停的解析html字符串
  while (html) {
    let textEnd = html.indexOf('<');
    if (textEnd == 0) {
      // 如果当前索引为0 肯定是一个标签 开始标签或者结束标签
      let startTagMatch = parseStartTag(); // 通过这个方法获取到匹配的结果 tagName,attrs
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs); // 1. 解析开始标签
        continue; // 如果开始标签匹配完毕后，继续下一次匹配
      }
      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]); // 2.解析结束标签
        continue;
      }
    }
    let text;
    if (textEnd >= 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length);
      chars(text); // 3.解析文本
    }
  }

  // 前进 n
  function advance(n) {
    html = html.substring(n);
  }

  function parseStartTag() {
    let start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      // 将标签删除
      advance(start[0].length)

      let end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // 解析属性
        advance(attr[0].length); // 将属性去掉
        match.attrs.push({
          name: attr[1],
          // attr[3] 双引号属性值；attr[4] 单引号属性值；attr[5] 无引号属性值
          value: attr[3] || attr[4] || attr[5]
        })
      }
      // 去掉开始标签的 >
      if (end) {
        advance(end[0].length);
        return match;
      }
    }
  }
  return root;
}