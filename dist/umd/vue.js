(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var isObject = function isObject(val) {
    return _typeof(val) === "object" && val !== null;
  };
  var isReservedTag = function isReservedTag(tagName) {
    var str = 'p,div,span,input,button'; // ...

    var obj = {};
    str.split(',').forEach(function (tag) {
      obj[tag] = true;
    });
    return obj[tagName];
  };
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: true,
      value: value
    });
  } // 生命周期列举

  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured'];
  var strats = {};

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  } // 合并生命周期


  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal); // res.__proto__ = parentVal

    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key];
      }
    }

    return res;
  }

  strats.components = mergeAssets;
  function mergeOptions(parent, child) {
    var options = {}; // 将 parent 上的属性与 child 进行合并

    for (var key in parent) {
      mergeFild(key);
    } // 将 child 上的属性与 parent 进行合并


    for (var _key in child) {
      // 如果已经合并过了就不需要再次合并了
      if (!parent.hasOwnProperty(_key)) {
        mergeFild(_key);
      }
    } // 默认的合并策略 但是有些属性 需要有特殊的合并方式 生命周期的合并


    function mergeFild(key) {
      // ----- 添加代码
      // 生命周期合并，另作处理（声明了多个相同的生命周期已数组的方式合并）
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      } // -----
      // parent 和 child 都是对象


      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] === null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options;
  }

  // 重写会导致数组本身发生变化的方法 push、shift、unshift、pop、reverse、sort、splice
  var oldArrayMethods = Array.prototype; // value.__proto__ = arrayMethods  原型链查找
  // arrayMethods.__proto__ = oldArrayMethods

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'sort', 'splice', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // AOP 切片编程
      var result = oldArrayMethods[method].apply(this, args); // 调用原生的数组方法
      // push unshift 添加的元素可能还是一个对象

      var inserted; // 当前用户插入的元素

      var ob = this.__ob__;

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
        ob.observeArray(inserted); // 将新增属性继续观测
      }

      ob.dep.notify(); // 如果用户调用了 push方法 就通知当前这个dep更新

      return result;
    };
  });

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = []; // age:[watcher, watcher]
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher); // 观察者模式
      }
    }, {
      key: "depend",
      value: function depend() {
        //让这个watcher记住当前的dep,如果watcher没存过dep，dep肯定不能存过watcher
        Dep.target.addDep(this); // this.subs.push(Dep.target)  // 观察者模式
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  var stack = []; // 目前可以做到 将watcher保留起来 和 移除的功能

  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  // Object.defineProperty 不能兼容ie8及以下 vue2 无法兼容ie8及以下版本

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 仅仅是初始化的操作
      this.dep = new Dep(); // 这个dep是给数组用的
      // 如果vue的数据层次过多，需要递归解析对象中的属性，依次增加set和get方法
      // value.__ob__ = this; // 给每个监控过的对象都增加一个__bo__属性

      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        // 如果是数组的话，并不会对索引进行观测，因为会导致性能消耗过大
        // 前端开发中很少操作索引    push  shift  unshift
        value.__proto__ = arrayMethods; // 如果数组里放的是对象，再监控

        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); // 拿到所有的key

        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    var dep = new Dep(); // 这个dep是给对象使用的
    // 递归实现深度检测
    // 这里这个value可能是数组 也可能是对象，返回的结果是observer的实例，当前这个value对应的observer

    var childOb = observe(value);
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      // 获取值的时候，做一些操作
      get: function get() {
        // 每个属性都对应着自己的watcher
        if (Dep.target) {
          // 如果当前有watcher，则需要将watcher存起来
          dep.depend();

          if (childOb) {
            // 数组的依赖收集
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
      set: function set(newValue) {
        if (newValue === value) return; // 继续劫持用户设置的值，因为用户设置的的值也是一个对象

        observe(newValue);
        value = newValue;
        dep.notify(); // 通知依赖的watcher更新操作
      }
    });
  }

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i]; // 将数组中的每一个都去出来，数据变化后 也需要更新试图
      // 数组中的数组的依赖收集

      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function observe(data) {
    if (!isObject(data)) {
      return;
    }

    return new Observer(data); // 用来观测数据
  }

  function initState(vm) {
    var opts = vm.$options; // vue的数据来源 属性 方法 数据 计算属性 watch

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
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  function initData(vm) {
    // 数据初始化工作
    var data = vm.$options.data; // 用户传递的data
    // 用户可以通过 vm._data 拿到data

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对象劫持  用户改变了数据 期望可以得到通知 => 刷新页面
    // MVVM模式 数据变化可以驱动视图变化
    // Object.defineProperty(): 给属性增加get方法和set方法
    // 为了让用户更好的使用 可以直接vm.xxx

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data); // 响应式原理
  }

  // ?:匹配不捕获
  // arguments[0] = 匹配到的标签  arguments[1] 匹配到的标签名字
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 匹配的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的</div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 > <div>

  function parseHTML(html) {
    var root = null; // ast语法树的树根

    var currentParent; // 标识当前父亲是谁

    var stack = [];
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    function start(tagName, attrs) {
      // 遇到开始标签 就创建一个ast元素
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      } // 把当前元素标记成父ast树


      currentParent = element; // 将开始标签存放到栈中

      stack.push(element);
    }

    function chars(text) {
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          text: text,
          type: TEXT_TYPE
        });
      }
    }

    function end(tagName) {
      var element = stack.pop(); // 拿到的是ast对象
      // 标识当前这个标签属于这个div的儿子

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element); // 实现了一个树的父子关系
      }
    } // 不停的解析html字符串


    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        // 如果当前索引为0 肯定是一个标签或者结束标签
        var startTagMatch = parseStartTag(); // 通过这个方法获取到匹配的结果 tagName,attrs

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs); // 1. 解析开始标签

          continue; // 如果开始标签匹配完毕后，继续下一次匹配
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]); // 2.解析结束标签

          continue;
        }
      }

      var text = void 0;

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
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        }; // 将标签删除

        advance(start[0].length);

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 解析属性
          advance(attr[0].length); // 将属性去掉

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        } // 去掉开始标签的 >


        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配 {{}}

  function gen(node) {
    if (node.type == 1) {
      // 元素标签
      return generate(node);
    } else {
      var text = node.text;
      var lastIndex = defaultTagRE.lastIndex = 0;
      var tokens = [];
      var match,
          index = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  } // 处理属性  拼接成属性的字符串


  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === "style") {
        (function () {
          // style="color: red;" => {style: {color:'red}}
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    } // 去掉最后一个 ,


    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compilerToFunction(template) {
    // 1) 解析html字符串 将html字符串 -> ast语法树
    var root = parseHTML(template); // 需要将ast语法树生成最终的render函数，就是字符串拼接(模板引擎)

    var code = generate(root); // 核心思路就是模板转化成 下面这段字符串
    // <div id="app"><p>hello {{name}}</p> hello</div>
    // 将ast树，再次转换成js的语法
    // 所有的模板引擎实现，都需要new Function + with

    var renderFn = new Function("with(this){return ".concat(code, "}")); // _c('div', {id:app}, _c('p', undefined, _v('hello'+_s(name))), _v('hello))
    // vue的render 返回的是虚拟dom

    return renderFn;
  }

  var callbacks = [];
  var waiting = false;

  function flushCallback() {
    callbacks.forEach(function (cb) {
      return cb();
    });
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

  var queue = [];
  var has = {};

  function flushSchedularQueue() {
    queue.forEach(function (watcher) {
      return watcher.run();
    });
    queue = []; // 让下次可以继续使用 

    has = {};
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true; // 宏任务和微任务 (vue中使用了Vue.nextTick)
      // Vuew.nextTick = promise / mutationObserver / setImmediate / setTimeout

      nextTick(flushSchedularQueue);
    }
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.id = id$1++;
      this.getter = exprOrFn; // 将内部传过来的回调函数 放到getter属性上

      this.depsId = new Set(); // es6中的集合（不能放重复项）

      this.deps = [];
      this.get(); // 调用get方法 会让渲染watcher执行
    } // watcher 里不能放重复的dep dep里不能放重复的watcher


    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(id);
          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this); // 把watcher存起来 Dep.target

        this.getter(); // 渲染watcher执行 render

        popTarget(); // 移除watcher
      }
    }, {
      key: "update",
      value: function update() {
        // 等待着 一起更新 因为每次调用update的时候 都放入了watcher
        // this.get()
        queueWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    // 判断是更新还是要渲染
    if (!oldVnode) {
      // 这里是组件的挂载  vm.$mount()
      // 通过当前的虚拟节点 创建元素并返回
      return createElm(vnode);
    }

    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      // 第一次渲染，oldVnode是真实dom
      var oldElm = oldVnode; // div id = "app"

      var parentElm = oldElm.parentNode; // body
      // 递归创建真实节点  替换掉老的节点

      var el = createElm(vnode); // 添加新的dom

      parentElm.insertBefore(el, oldElm.nextSibling); // 删除旧的dom

      parentElm.removeChild(oldElm); // 需要将渲染好的结果返回

      return el;
    } else {
      // 1.对比两个虚拟节点 操作真实的dom
      if (oldVnode.tag !== vnode.tag) {
        // 标签不一致，直接替换
        oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
      } // 2.如果是文本


      if (!oldVnode.tag) {
        // 文本替换
        if (oldVnode.text !== vnode.text) {
          oldVnode.el.textContent = vnode.text;
        }
      } // 3.说明标签一致而且不是文本 (比对属性是否一致)


      var _el = vnode.el = oldVnode.el;

      updateProperties(vnode, oldVnode.data); // 计较子节点

      var oldChildren = oldVnode.children || [];
      var newChildren = vnode.children || []; // 新老节点都有子节点，需要比对子节点

      if (oldChildren.length > 0 && newChildren.length > 0) {
        updateChildren(_el, oldChildren, newChildren);
      } else if (newChildren.length > 0) {
        // 新节点有子节点，老节点没有子节点，直接将新的子节点转化成真实节点，插入即可。
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i];

          _el.appendChild(createElm(child));
        }
      } else if (oldChildren.length > 0) {
        // 老节点有子节点，新节点没有子节点
        _el.innerHTML = '';
      }
    }
  }

  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
  }

  function updateChildren(parent, oldChildren, newChildren) {
    // vue 采用的是双指针的方式
    // vue 在内部比对的过程中做了很多优化策略
    var oldStartIndex = 0;
    var oldStartVnode = oldChildren[0];
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex];
    var newStartIndex = 0;
    var newStartVnode = newChildren[0];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex];

    var makeIndexByKey = function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (item, index) {
        if (item.key) {
          map[item.key] = index; // 根据key创建一个映射表
        }
      });
      console.log(map);
      return map;
    };

    var map = makeIndexByKey(oldChildren); // 在比对的过程中，新老虚拟节点有一方循环完毕就结束

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      // 优化向后插入的情况
      if (!oldStartVnode) {
        // 如果老指针移动过程中可能会碰到undefined
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 如果是同一个节点，就需要比对这个元素的属性
        patch(oldStartVnode, newStartVnode); // 比对开头节点

        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        // 优化向前插入的情况
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        // 头移尾 (涉及到 倒叙变正序)
        patch(oldStartVnode, newEndVnode);
        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        // 尾移头
        patch(oldEndVnode, newStartVnode);
        parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        // 暴力比对 乱序
        // 先根据老节点的key 做一个映射表，拿新的虚拟节点去映射表中查找，则进行移动操作（移到头指针前面的位置）
        // 如果找不到，则将元素插入即可
        var moveIndex = map[newStartVnode.key];

        if (!moveIndex) {
          // 不需要复用
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          // 如果在映射表中查找到了，则直接将元素移走，并且将当前位置置为空
          var moveVnode = oldChildren[moveIndex]; // 我要移动的那个元素

          oldChildren[moveIndex] = undefined; // 占位防止塌陷

          parent.insertBefore(moveVnode.el, oldStartVnode.el);
          patch(moveVnode, newStartVnode);
        }

        newStartVnode = newChildren[++newStartIndex];
      }
    }

    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        var el = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
        parent.insertBefore(createElm(newChildren[i]), el); // 写null,就等价于appendChild
        // 将新增的元素直接及逆行插入(可能是向后插入，也可能是向前插入)
        // parent.appendChild(createElm(newChildren[i]))
      }
    }

    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var chile = oldChildren[_i];

        if (chile != undefined) {
          parent.removeChild(chile.el);
        }
      }
    }
  } // 初始化的作用


  function createComponent(vnode) {
    // 需要创建组件的实例
    var i = vnode.data;

    if ((i = i.hook) && (i = i.init)) {
      i(vnode);
    } // 执行完毕后


    if (vnode.componentInstance) {
      return true;
    }
  } // 根据虚拟节点创建真实的节点


  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text; // 是标签就创建标签

    if (typeof tag === 'string') {
      // 不是tag是字符串的就是普通的html  还有可能是组件
      // 实例化组件
      if (createComponent(vnode)) {
        // 表示是组件
        // 这里应该返回的是真实的dom元素
        return vnode.componentInstance.$el;
      }

      vnode.el = document.createElement(tag); // 更新属性

      updateProperties(vnode); // 递归创建子节点，将子节点添加到父节点上

      children.forEach(function (child) {
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
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var el = vnode.el; // 如果老的属性中有 新的属性中没有，在真实的dom上将这个属性删除掉

    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {};

    for (var key in oldStyle) {
      if (!newStyle[key]) {
        el.style[key] = ''; // 删除多余的
      }
    }

    for (var _key in oldProps) {
      if (!newProps[_key]) {
        el.removeAttribute(_key);
      }
    }

    for (var _key2 in newProps) {
      // 以新的为准
      if (_key2 === 'style') {
        for (var styleName in newProps.style) {
          // 新增样式
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this; // 通过虚拟节点，渲染出真实的dom

      vm.$el = patch(vm.$el, vnode); // 需要用虚拟节点创建真实节点 替换 真实的$el
    };
  }
  function mountComponent(vm, el) {
    var options = vm.$options;
    vm.$el = el; // 真实的dom元素
    // Watcger 用于渲染
    // vm._render 通过解析render方法 渲染出虚拟dom _c _v _s
    // vm._update 通过虚拟dom 创建真实的dom
    // 调用 boforeMount

    callHook(vm, 'beforeMount'); // 渲染页面

    var updateComponent = function updateComponent() {
      // 无论是渲染还是更新都会调用此方法
      // 返回的是虚拟dom
      // 由Watcher监听render生成vnode，并由update生成真实dom并挂载
      vm._update(vm._render());
    }; // 渲染watcher 每个组件都有一个watcher vm.$watch(()=>{})


    new Watcher(vm, updateComponent, function () {}, true); // true 表示他是一个渲染watcher
    // 调用 mounted

    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook]; // 找到对应的钩子一次执行

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 数据劫持
      var vm = this; // Vue中使用this.$options 指代的就是用户传递的属性
      // 将用户传递的 和 全局的进行合并

      vm.$options = mergeOptions(vm.constructor.options, options); // 调用 beforeCreate

      callHook(vm, 'beforeCreate'); // 初始化状态

      initState(vm); // 分割代码
      // 调用 created

      callHook(vm, 'created'); // 如果用户传入了el属性 需要将页面渲染出来
      // 如果用户传入了el 就要实现挂载流程

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 默认先查找有没有render方法，没有render再采用template，template也没有就使用el中的内容

      if (!options.render) {
        // 对模板进行编译
        var template = options.template; // 取出模板

        if (!template && el) {
          template = el.outerHTML;
        } // 编译


        var render = compilerToFunction(template);
        options.render = render; // 我们需要将template 转化成render方法vue1.0 2.0 虚拟dom
      } // options.render
      // 渲染当前的组件 挂载这个组件


      mountComponent(vm, el);
    }; // 用户调用的nextTick


    Vue.prototype.$nextTick = nextTick;
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    // console.log('vmvmvmvm', vm)
    // ast -> render -> 调用
    var key = data.key;

    if (key) {
      delete data.key;
    } // 以前表示的是标签 现在是组件 名字 上下文


    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      return vnode(tag, data, key, children, undefined);
    } else {
      // 组件 找到组件的定义
      var Ctor = vm.$options.components[tag];
      return createComponent$1(vm, tag, data, key, children, Ctor);
    }
  }

  function createComponent$1(vm, tag, data, key, children, Ctor) {
    // console.log(vm.$options);
    if (isObject(Ctor)) {
      Ctor = vm.$options._base.extend(Ctor);
    }

    data.hook = {
      init: function init(vnode) {
        // 当前组件的实例，就是componentInstance
        var child = vnode.componentInstance = new Ctor({
          _isComponent: true
        });
        child.$mount();
      }
    };
    return vnode("vue-component-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, undefined, {
      Ctor: Ctor,
      children: children
    });
  }

  function createTextNode(vm, text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text, componentOptions) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions
    };
  } // 虚拟节点  就是通过 _c _v 实现用对象来描述dom的操作(对象)
  // 1) 将template转换成ast语法树 => 生成render方法 => 生成虚拟dom => 真实的dom
  // 重新生成虚拟dom => 更新dom

  function renderMixin(Vue) {
    // _c 创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON.stringify
    Vue.prototype._c = function () {
      // console.log('this', this.$options);
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments))); // tag, data, children1, children2
    };

    Vue.prototype._v = function (text) {
      return createTextNode(this, text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this; // console.log('this', this)

      var render = vm.$options.render; // 去实例上取值

      var vnode = render.call(vm);
      return vnode;
    };
  }

  function initMixin$1(Vue) {
    Vue.mixin = function (mixin) {
      // 对象合并
      this.options = mergeOptions(this.options, mixin);
    };
  }

  var ASSETS_TYPE = ["component", "directive", "filter"];

  function initAssetRegisters(Vue) {
    ASSETS_TYPE.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (type === 'component') {
          // 注册全局组件
          // 使用extend方法 将对象变成构造函数
          // 子组件可能也有这个 VueComponent.component方法
          // console.log(this.options._base.extend)
          definition = this.options._base.extend(definition);
        }

        this.options[type + 's'][id] = definition;
      };
    });
  }

  function initExtend(Vue) {
    // 为什么要有子类和父类 new Vue (Vue 的构造函数)
    // 创建子类 继承于父类 扩展的时候都扩展到自己的属性上
    var cid = 0;

    Vue.extend = function (extendOptions) {
      var Sub = function VueComponent(options) {
        this._init(options);
      };

      Sub.cid = cid++;
      Sub.prototype = Object.create(this.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(this.options, extendOptions);
      return Sub;
    };
  }

  // import { mergeOptions } from '../util/index'
  function initGlobalAPI(Vue) {
    // 整合了所有的全局相关的内容
    Vue.options = {};
    initMixin$1(Vue); // 初始化的全局过滤器 指令 组件

    ASSETS_TYPE.forEach(function (type) {
      Vue.options[type + "s"] = {};
    });
    Vue.options._base = Vue; // _base 是Vue的构造函数
    // 注册extend方法

    initExtend(Vue); // console.log('---------', Vue.extend);

    initAssetRegisters(Vue); // console.log(Vue.options);
    // Vue.mixin = function (mixin) {
    //   // 对象合并
    //   this.options = mergeOptions(this.options, mixin)
    // }
    // 生命周期的合并策略 [beforeCreate, beforeCreate]
    // Vue.mixin({
    //   beforeCreate() {
    //     console.log('1')
    //   }
    // })
    // Vue.mixin({
    //   beforeCreate() {
    //     console.log('2')
    //   }
    // })
  }

  function Vue(options) {
    // 进行Vue的初始化操作
    this._init(options);
  } // 通过引入文件的方式，给Vue原型上添加方法


  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue); // 初始化全局api

  initGlobalAPI(Vue);
  var vm1 = new Vue({
    data: {
      name: 'hello'
    }
  });
  var render1 = compilerToFunction("<div id='app' a='1' style='background:red'>\n  <div style=\"background:red\" key=\"A\">A</div>\n  <div style=\"background:yellow\" key=\"B\">B</div>\n  <div style=\"background:blue\" key=\"C\">C</div>\n</div>");
  var vnode$1 = render1.call(vm1);
  var el = createElm(vnode$1);
  document.body.appendChild(el);
  var vm2 = new Vue({
    data: {
      name: 'yctang',
      age: 18
    }
  });
  var render2 = compilerToFunction("<div id=\"aaa\" b=\"2\" style=\"color:blue\">\n  <div style=\"background:green\" key=\"Q\">Q</div>\n  <div style=\"background:red\" key=\"A\">A</div>\n  <div style=\"background:yellow\" key=\"F\">F</div>\n  <div style=\"background:blue\" key=\"C\">C</div>\n  <div style=\"background:green\" key=\"N\">N</div>\n</div>");
  var newVnode = render2.call(vm2);
  setTimeout(function () {
    patch(vnode$1, newVnode); // 传入两个虚拟节点，会在内部进行比对
  }, 3000); // 1. diff算法的特点是 平级比对，正常操作dom元素时，很少涉及到父变成子，子变成父

  return Vue;

})));
//# sourceMappingURL=vue.js.map
