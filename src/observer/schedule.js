import { nextTick } from '../util/next-tick';

let queue = [];
let has = {};

function flushSchedularQueue() {
  queue.forEach(watcher => watcher.run());
  queue = []; // 让下次可以继续使用 
  has = {};
}

export function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    queue.push(watcher);
    has[id] = true;

    // 宏任务和微任务 (vue中使用了Vue.nextTick)
    // Vuew.nextTick = promise / mutationObserver / setImmediate / setTimeout
    nextTick(flushSchedularQueue)
  }
}
