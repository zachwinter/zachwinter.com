import { MUTATIONS } from '@/store'

export function buildMutations (mutations) {
  const obj = {}
  for (let key in mutations) {
    obj[key] = function (state, val) {
      state[mutations[key]] = val
    }
  }
  return obj
}

export function persist ({ key = 'vuex.persist', modules }) {
  let $store = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null
  let initFlag = false

  if (!$store) {
    $store = modules.reduce((acc, val) => {
      acc[val] = {}
      return acc
    }, {})
    localStorage.setItem(key, JSON.stringify($store))
    $store = JSON.parse(localStorage.getItem(key))
    initFlag = true
  } 

  return function (store) {
    const state = { ...store.state, ...$store }
    if (!initFlag) store.replaceState(state)
    store.subscribe(({ type }, state) => {
      const [module] = type.split('/')
      if (modules.indexOf(module) !== -1) {
        const storeString = localStorage.getItem(key)
        const store = JSON.parse(storeString)
        store[module] = state[module]
        localStorage.setItem(key, JSON.stringify(store))
      }
    })
  }
}

export function dualBind (prop, localName = null) {
  if (Array.isArray(prop)) {
    return prop.reduce((acc, prop) => {
      acc = { ...acc, ..._dualBind(prop) }
      return acc
    }, {})
  } else {
    return _dualBind(prop, localName)
  }
}

export function bind (prop, localName = null) {
  if (Array.isArray(prop)) {
    return prop.reduce((acc, prop) => {
      acc = { ...acc, ..._bind(prop) }
      return acc
    }, {})
  } else {
    return _bind(prop, localName)
  }
}

function _extract (prop) {
  const split = prop.split('/')
  const [module, key] = split.length == 2 ? split : [null, split[1]]
  const mutation = Object.keys(MUTATIONS[module]).reduce((acc, val) => {
    if (MUTATIONS[module][val] === key) acc = val
    return acc
  }, null)
  return { mutation, module, key }
}

function _dualBind (prop, localName) {
  const { mutation, module, key } = _extract(prop)
  
  return { 
    [localName || key]: {
      get () {
        return module ? this.$store.state[module][key] : this.$store.state[key]
      },

      set (val) {
        return this.$store.commit(`${module}/${mutation}`, val)
      }
    }
  }
}

function _bind (prop, localName) {
  const { module, key } = _extract(prop)

  return {
    [localName || key] () {
      return module ? this.$store.state[module][key] : this.$store.state[key]
    }
  }
}