/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/lib/observable/index.js":
/*!*************************************!*\
  !*** ./src/lib/observable/index.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ "./src/lib/state/index.js");

/* harmony default export */ __webpack_exports__["default"] = ((state, mapper = null) => {
  return fn => {
    if (mapper) {
      const newState = Object(_state__WEBPACK_IMPORTED_MODULE_0__["default"])(mapper(state));

      newState.__subscribe(fn);

      state.__subscribe(store => {
        Object.assign(newState, mapper(state));
      });

      return fn(mapper(state));
    } else {
      state.__subscribe(fn);

      return fn(state);
    }
  };
});

/***/ }),

/***/ "./src/lib/state/index.js":
/*!********************************!*\
  !*** ./src/lib/state/index.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const makeHandler = (initialObject = undefined) => ({
  get: (target, property) => {
    if (typeof target[property] === 'object' && target[property] !== null) {
      return new Proxy(target[property], makeHandler(target[property], target));
    } else {
      if (typeof target[property] === 'function') {
        // Array modifiers
        if (['push', 'unshift', 'pop', 'splice'].includes(property)) {
          return function (...args) {
            const val = Array.prototype[property].apply(target, args);
            subscribers.forEach(({
              __fn
            }) => __fn(initialObject || target));
            return val;
          };
        }
      }

      return target[property];
    }
  },
  set: (target, prop, value) => {
    target[prop] = value;
    subscribers.forEach(({
      __fn
    }) => __fn(initialObject || target));
  }
});

/* harmony default export */ __webpack_exports__["default"] = (initialState => {
  return (__subscribers => {
    const handler = (initialObject = undefined) => ({
      get: (target, property) => {
        // Handling objects
        if (typeof target[property] === 'object') {
          return new Proxy(target[property], handler(target));
        } else {
          if (typeof target[property] === 'function') {
            // Array modifiers
            if (['push', 'unshift', 'pop', 'splice'].includes(property)) {
              return function (...args) {
                const val = Array.prototype[property].apply(target, args);

                __subscribers.forEach(({
                  __fn
                }) => __fn(initialObject.__state || target.__state));

                return val;
              };
            }
          }

          return target[property];
        }
      },
      set: (target, prop, value) => {
        const oldValue = target[prop];

        if (oldValue !== value) {
          target[prop] = value;

          __subscribers.forEach(({
            __fn
          }) => __fn(initialObject || target));
        }

        return true;
      }
    });

    return new Proxy({ ...initialState,
      __observable: true,
      __subscribe: __fn => __subscribers.push({
        __fn
      })
    }, handler()); // return proxied
  })([]);
});

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/state */ "./src/lib/state/index.js");
/* harmony import */ var _lib_observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/observable */ "./src/lib/observable/index.js");


const State = Object(_lib_state__WEBPACK_IMPORTED_MODULE_0__["default"])({
  counter: {
    value: 0
  },
  other: {
    value: 0
  }
});
const Counter = document.createElement('span');
Object(_lib_observable__WEBPACK_IMPORTED_MODULE_1__["default"])(State, ({
  counter: {
    value
  }
}) => {
  return {
    value
  };
})(({
  value
}) => {
  console.log('wham');
  Counter.innerText = value;
});
setInterval(() => {
  State.counter.value += 1;
}, 1000);
setInterval(() => {
  State.other.value += 1;
}, 500);
const AppContainer = document.getElementById('app');
AppContainer.appendChild(Counter);

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map