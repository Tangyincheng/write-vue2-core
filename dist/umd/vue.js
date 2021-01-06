(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  // 重写会导致数组本身发生变化的方法 push、shift、unshift、pop、reverse、sort、splice
  // 获取所有数组中的方法
  let oldArrayMethods = Array.prototype; // value.__proto__ = arrayMethods  原型链查找
  // arrayMethods.__proto__ = oldArrayMethods
  // 数组中的方法拷贝

  const arrayMethods = Object.create(oldArrayMethods); // 需要重写的数组方法

  const methods = ['push', 'shift', 'unshift', 'pop', 'sort', 'splice', 'reverse']; // 对每一个方法进行重写

  methods.forEach(method => {
    arrayMethods[method] = function (...args) {
      console.log('用户调用了push方法'); // AOP 切片编程

      const result = oldArrayMethods[method].apply(this, args); // 调用原生的数组方法
      // push unshift 添加的元素可能还是一个对象

      let inserted; // 当前用户插入的元素

      let ob = this.__ob__; // 对push、unshift和splice这三个方法单独重写
      // 因为这三个方法中添加的值可能又是一个对象，也需要做数据劫持

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // 3个  新增的属性 aplice有删除 新增的功能
          inserted = args.splice(2);
      }

      if (inserted) {
        // 对push、unshift和splice三个方法新增的值做数据劫持
        ob.observeArray(inserted); // 将新增属性继续观测
      }

      ob.dep.notify(); // 如果用户调用了 push 方法 就通知当前这个dep更新

      return result;
    };
  });

  let id = 0;

  class Dep {
    constructor() {
      this.id = id++;
      this.subs = []; // age:[watcher, watcher]
    }

    addSub(watcher) {
      this.subs.push(watcher); // 观察者模式
    } // 收集 Watcher


    depend() {
      //让这个watcher记住当前的dep,如果watcher没存过dep，dep肯定不能存过watcher
      Dep.target.addDep(this); // this.subs.push(Dep.target)  // 观察者模式
    } // 触发 Watcher


    notify() {
      this.subs.forEach(watcher => watcher.update());
    }

  }

  let stack = []; // 目前可以做到 将watcher保留起来 和 移除的功能

  function pushTarget(watcher) {
    // Dep.target === watcher
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  class Observer {
    constructor(value) {
      // 仅仅是初始化的操作
      this.dep = new Dep(); // 这个dep是给数组用的
      // 在value上添加 __ob__ 属性，该属性的值等于 this，即 Observer。
      // 目的：为了在重写数组的方法中能够调用 observeArray。
      // 这里设置 enumerable：false，是为了防止死循环，而造成内存移除

      Object.defineProperty(value, "__ob__", {
        enumerable: false,
        configurable: true,
        value: this
      }); // 如果vue的数据层次过多，需要递归解析对象中的属性，依次增加set和get方法

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
        defineReactive(data, key, data[key]);
      });
    }

  }

  function defineReactive(data, key, value) {
    let dep = new Dep(); // 这个dep是给对象使用的
    // 如果是多层级的对象，需要递归调用

    let childOb = observe(value); // 递归实现深度检测
    // 这里这个value可能是数组 也可能是对象，返回的结果boserver的实例，当前这个value对应的observer

    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,

      // 获取值的时候，做一些操作
      get() {
        // 每个属性都对应着自己的watcher
        if (Dep.target) {
          console.log('收集'); // 如果当前有watcher，则需要将watcher存起来

          dep.depend(); // 数组的依赖收集

          if (childOb) {
            // 收集数组的相关依赖
            childOb.dep.depend(); // 如果数组中还有数组

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
        console.log('数据变化'); // 继续劫持用户设置的值，因为用户设置的的值也是一个对象

        observe(newValue);
        value = newValue;
        dep.notify(); // 通知依赖的watcher更新操作
      }

    });
  }

  function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
      // 将数组中的每一项都取出来，数据变化后 也需要更新试图
      let current = value[i]; // 数组中的数组的依赖收集

      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function observe(data) {
    // 如果data不是对象，则不做处理
    if (!(typeof data === "object" && data !== null)) {
      return;
    }

    return new Observer(data); // 用来观测数据
  }

  function initState(vm) {
    const opts = vm.$options; // vue的数据来源 属性 方法 数据 计算属性 watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }


  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get() {
        return vm[source][key];
      },

      set(newValue) {
        vm[source][key] = newValue;
      }

    });
  }

  function initData(vm) {
    // 数据初始化工作
    let data = vm.$options.data; // 用户传递的data
    // 用户可以通过 vm._data 拿到data
    // 用户传参中的data可以是函数的形式(函数返回一个对象)也可以是对象的形式，故做如下处理

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对象劫持  用户改变了数据 期望可以得到通知 => 刷新页面
    // MVVM模式 数据变化可以驱动视图变化
    // Object.defineProperty(): 给属性增加get方法和set方法
    // 为了让用户更好的使用 可以直接vm.xxx

    for (let key in data) {
      proxy(vm, '_data', key);
    }

    observe(data); // 响应式原理
  }

  // ?:匹配不捕获
  // arguments[0] = 匹配到的标签  arguments[1] 匹配到的标签名字
  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // abc-aaa

  const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
  const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 匹配的内容是标签名

  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的</div>

  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 > <div>

  function parseHTML(html) {
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
      };
    } // 开始标签


    function start(tagName, attrs) {
      // 遇到开始标签 就创建一个ast元素
      let element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      } // 把当前元素标记成父ast树


      currentParent = element; // 将开始标签存放到栈中

      stack.push(element);
    } // 文本


    function chars(text) {
      // 去掉空格
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          text,
          type: TEXT_TYPE
        });
      }
    } // 结束标签


    function end(tagName) {
      let element = stack.pop(); // 拿到的是ast对象
      // 标识当前这个标签属于这个div的儿子

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element); // 实现了一个树的父子关系
      }
    } // 不停的解析html字符串


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
    } // 前进 n


    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      let start = html.match(startTagOpen);

      if (start) {
        const match = {
          tagName: start[1],
          attrs: []
        }; // 将标签删除

        advance(start[0].length);
        let end, attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 解析属性
          advance(attr[0].length); // 将属性去掉

          match.attrs.push({
            name: attr[1],
            // attr[3] 双引号属性值；attr[4] 单引号属性值；attr[5] 无引号属性值
            value: attr[3] || attr[4] || attr[5]
          });
        } // 去掉开始标签的 >


        if (end) {
          advance(end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配 {{}}
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
      let match,
          index = 0; // 解析文本

      while (match = defaultTagRE.exec(text)) {
        index = match.index; // 例：解析 hello{{ name }}hello 中的 {{ name }} 前面的 hello

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        } // 例：解析 hello{{ name }}hello 中的 {{ name }}


        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      } // 例：解析 hello{{ name }} hello 中的 {{ name }} 后面的 hello


      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      } // 将结果拼接上 +


      return `_v(${tokens.join('+')})`;
    }
  } // 处理属性  拼接成属性的字符串


  function genProps(attrs) {
    let str = '';

    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i]; // 解析 style

      if (attr.name === "style") {
        // style="color: red;" => {style: {color:'red'}}
        let obj = {};
        attr.value.split(';').forEach(item => {
          let [key, value] = item.split(':');
          obj[key] = value;
        });
        attr.value = obj;
      } // 拼接上 ,


      str += `${attr.name}:${JSON.stringify(attr.value)},`;
    } // 去掉最后一个 ,


    return `{${str.slice(0, -1)}}`;
  }

  function genChildren(el) {
    let children = el.children;

    if (children && children.length > 0) {
      return `${children.map(c => gen(c)).join(',')}`;
    } else {
      return false;
    }
  } // 递归创建


  function generate(el) {
    // 获取子节点
    let children = genChildren(el);
    let code = `_c("${el.tag}",${el.attrs.length ? genProps(el.attrs) : 'undefined'}${children ? `,${children}` : ''})`;
    return code;
  }

  function compilerToFunction(template) {
    // 1) 解析html字符串 将html字符串 -> ast语法树
    console.log(template);
    let root = parseHTML(template); // 需要将ast语法树生成最终的render函数，就是字符串拼接(模板引擎)

    let code = generate(root);
    console.log('code', code); // 核心思路就是模板转化成 下面这段字符串
    // <div id="app"><p>hello {{name}}</p> hello</div>
    // _c('div', {id:app}, _c('p', undefined, _v('hello'+_s(name))), _v('hello))
    // 将ast树，再次转换成js的语法
    // 所有的模板引擎实现，都需要new Function + with

    let renderFn = new Function(`with(this){return ${code}}`);
    console.log(renderFn); // vue的render 返回的是虚拟dom

    return renderFn;
  }

  let callbacks = [];
  let waiting = false;

  function flushCallback() {
    callbacks.forEach(cb => cb());
    waiting = false;
    callbacks = [];
  }

  function nextTick(cb) {
    // 多次调用nextTick 如果没有刷新的时候，就先把他放到数组中，刷新后更改waiting
    callbacks.push(cb);

    if (waiting === false) {
      setTimeout(flushCallback, 0);
      waiting = true;
    }
  }

  let queue = [];
  let has = {};

  function flushSchedularQueue() {
    queue.forEach(watcher => watcher.run());
    queue = []; // 让下次可以继续使用 

    has = {};
  }

  function queueWatcher(watcher) {
    const id = watcher.id;

    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true; // 宏任务和微任务 (vue中使用了Vue.nextTick)
      // Vuew.nextTick = promise / mutationObserver / setImmediate / setTimeout

      nextTick(flushSchedularQueue);
    }
  }

  let id$1 = 0;

  class Wathcer {
    constructor(vm, exprOrFn, callback, options) {
      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.id = id$1++;
      this.getter = exprOrFn; // 将内部传过来的回调函数 放到getter属性上

      this.depsId = new Set(); // es6中的集合（不能放重复项）

      this.deps = [];
      this.get(); // 调用get方法 会让渲染watcher执行
    } // watcher 里不能放重复的dep dep里不能放重复的watcher


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

      this.getter(); // 渲染watcher执行

      popTarget(); // 移除watcher
    }

    update() {
      // 等待着 一起更新 因为每次调用update的时候 都放入了watcher
      // this.get()
      // ----- 添加代码
      queueWatcher(this); // -----
    } // ----- 添加代码


    run() {
      this.get();
    } // -----


  } // ----- 添加代码

  function patch(oldVnode, vnode) {
    // 判断是更新还是要渲染
    const isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      // 第一次渲染，oldVnode是真实dom
      const oldElm = oldVnode; // div id = "app"

      const parentElm = oldElm.parentNode; // body
      // 递归创建真实节点  替换掉老的节点

      let el = createElm(vnode); // 添加新的dom

      parentElm.insertBefore(el, oldElm.nextSibling); // 删除旧的dom

      parentElm.removeChild(oldElm); // 需要将渲染好的结果返回

      return el;
    }
  } // 根据虚拟节点创建真实的节点

  function createElm(vnode) {
    let {
      tag,
      children,
      key,
      data,
      text
    } = vnode; // 是标签就创建标签

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag); // 更新属性

      updateProperties(vnode); // 递归创建子节点，将子节点添加到父节点上

      children.forEach(child => {
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      // 如果不是标签就是文本
      // 虚拟dom上映射着真实dom 方便后续更新操作
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  } // 更新属性


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
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      const vm = this; // 通过虚拟节点，渲染出真实的dom

      vm.$el = patch(vm.$el, vnode); // 需要用虚拟节点创建真实节点 替换 真实的$el
    };
  }
  function mountComponent(vm, el) {
    const options = vm.$options;
    vm.$el = el; // 真实的dom元素
    // 渲染页面

    let updateComponent = () => {
      // 无论是渲染还是更新都会调用此方法
      // 返回的是虚拟dom
      console.log("watcher");

      vm._update(vm._render());
    }; // 渲染watcher 每个组件都有一个watcher vm.$watch(()=>{})


    new Wathcer(vm, updateComponent, () => {}, true); // true 表示他是一个渲染watcher
  }

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // 数据劫持
      const vm = this; // vue中使用 this.$options 指代的就是用户传递的属性

      vm.$options = options; // 初始化状体

      initState(vm); // ---------添加部分

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      } // ---------

    };

    Vue.prototype.$mount = function (el) {
      const vm = this;
      const options = vm.$options;
      el = document.querySelector(el); // 默认先查找有没有render方法，没有render再采用template，template也没有再使用 el 中的内容

      if (!options.render) {
        // 对模板进行编译
        let template = options.template; // 取出模板

        if (!template && el) {
          template = el.outerHTML;
        } // 编译


        const render = compilerToFunction(template);
        console.log('render', render);
        options.render = render; // 我们需要将template 转化成render方法vue1.0 2.0 虚拟dom

        console.log('options', options);
      } // 渲染当前的组件，挂载这个组件


      mountComponent(vm, el);
    }; // 用户调用的nextTick


    Vue.prototype.$nextTick = nextTick;
  }

  function createElement(tag, data = {}, ...children) {
    let key = data.key;

    if (key) {
      delete data.key;
    } // 返回标签节点


    return vnode(tag, data, key, children, undefined);
  }
  function createTextNode(text) {
    // 文本节点只需要返回 text 文本
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag,
      data,
      key,
      children,
      text
    };
  } // 虚拟节点  就是通过 _c _v 实现用对象来描述dom的操作(对象)
  // 1) 将template转换成ast语法树 => 生成render方法 => 生成虚拟dom => 真实的dom
  // 重新生成虚拟dom => 更新dom

  function renderMixin(Vue) {
    // _c 创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON.stringify
    Vue.prototype._c = function () {
      return createElement(...arguments); // tag, data, children1, children2
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : typeof val === 'object' ? JSON.stringify(val) : val;
    }; // ----- 添加代码


    Vue.prototype._render = function () {
      const vm = this;
      const {
        render
      } = vm.$options; // 去实例上取值

      let vnode = render.call(vm);
      return vnode;
    }; // -----

  }

  function Vue(options) {
    // 进行Vue的初始化操作
    this._init(options);
  } // 通过引入文件的方式，给Vue原型上添加方法


  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
