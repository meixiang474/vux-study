import applyMixin from "./mixin";
import ModuleCollection from "./module/module-collection";
import { forEach } from "./util";

let Vue;

function getState(store, path) {
  return path.reduce((newState, current) => {
    return newState[current];
  }, store.state);
}

function installModule(store, rootState, path, module) {
  let namespace = store._modules.getNameSpace(path);
  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current];
    }, rootState);

    store._withCommitting(() => {
      Vue.set(parent, path[path.length - 1], module.state);
    });
  }
  module.forEachMutation((mutation, type) => {
    store._mutations[namespace + type] =
      store._mutations[namespace + type] || [];
    store._mutations[namespace + type].push((payload) => {
      store._withCommitting(() => {
        mutation.call(store, getState(store, path), payload);
      });
      store._subscribers.forEach((sub) => sub({ mutation, type }, store.state));
    });
  });
  module.forEachAction((action, type) => {
    store._actions[namespace + type] = store._actions[namespace + type] || [];
    store._actions[namespace + type].push((payload) => {
      action.call(store, store, payload);
    });
  });
  module.forEachGetters((getter, key) => {
    store._wrapperGetters[namespace + key] = function() {
      return getter(getState(store, path));
    };
  });
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child);
  });
}

function resetStoreVm(store, state) {
  const wrapperGetters = store._wrapperGetters;
  let oldVm = store._vm;
  let computed = {};
  store.getters = {};
  forEach(wrapperGetters, (fn, key) => {
    computed[key] = function() {
      return fn();
    };
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
    });
  });
  store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  });
  if (store.strict) {
    store._vm.watch(
      () => store._vm._data.$$state,
      () => {
        console.assert(store._committing, "warn");
      },
      { deep: true, sync: true }
    );
  }
  if (oldVm) {
    Vue.nextTick(() => oldVm.$destroy());
  }
}

class Store {
  constructor(options) {
    this._modules = new ModuleCollection(options);
    const state = this._modules.root.state;
    this._mutations = {};
    this._actions = {};
    this._wrapperGetters = {};
    this._subscribers = [];
    this.strict = options.strict;
    this._committing = false;
    installModule(this, state, [], this._modules.root);
    resetStoreVm(this, state);
    options.plugins.forEach((plugin) => plugin(this));
  }
  _withCommitting(fn) {
    let committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  }
  subscribe(fn) {
    this._subscribers.push(fn);
  }
  commit = (type, payload) => {
    this._mutations[type].forEach((fn) => fn(payload));
  };
  dispatch = (type, payload) => {
    this._actions[type].forEach((fn) => fn(payload));
  };
  replaceState(newState) {
    this._withCommitting(() => {
      this._vm._data.$$state = newState;
    });
  }
  get state() {
    return this._vm_data.$$state;
  }
  registerModule(path, rawModule) {
    if (typeof path === "string") path = [path];
    this._modules.register(path, rawModule);
    installModule(this, this.state, path, rawModule.newModule);
    resetStoreVm(this, this.state);
  }
}

const install = (_Vue) => {
  Vue = _Vue;
  applyMixin(Vue);
};

export { Store, install };
