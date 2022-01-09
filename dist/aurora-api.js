(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AuroraAPI"] = factory();
	else
		root["AuroraAPI"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/isomorphic-ws/browser.js":
/*!***********************************************!*\
  !*** ./node_modules/isomorphic-ws/browser.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// https://github.com/maxogden/websocket-stream/blob/48dc3ddf943e5ada668c31ccd94e9186f02fafbd/ws-fallback.js

var ws = null

if (typeof WebSocket !== 'undefined') {
  ws = WebSocket
} else if (typeof MozWebSocket !== 'undefined') {
  ws = MozWebSocket
} else if (typeof __webpack_require__.g !== 'undefined') {
  ws = __webpack_require__.g.WebSocket || __webpack_require__.g.MozWebSocket
} else if (typeof window !== 'undefined') {
  ws = window.WebSocket || window.MozWebSocket
} else if (typeof self !== 'undefined') {
  ws = self.WebSocket || self.MozWebSocket
}

module.exports = ws


/***/ }),

/***/ "./src/classes/AuroraAPI.ts":
/*!**********************************!*\
  !*** ./src/classes/AuroraAPI.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AuroraAPI)
/* harmony export */ });
/* harmony import */ var isomorphic_ws__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! isomorphic-ws */ "./node_modules/isomorphic-ws/browser.js");
/* harmony import */ var isomorphic_ws__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(isomorphic_ws__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var _MessageEmitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MessageEmitter */ "./src/classes/MessageEmitter.ts");



// Можно рассмотреть использование приватных полей через #
// https://github.com/tc39/proposal-class-fields/blob/master/PRIVATE_SYNTAX_FAQ.md
// У вебпака есть свои приколы на этот счёт, мб заменить его к чёрту?))
// + logger settings
class AuroraAPI {
    constructor(url, events) {
        this._messageEmitter = new _MessageEmitter__WEBPACK_IMPORTED_MODULE_1__["default"]();
        this._ready = () => {
            console.error("[AuroraAPI] If you see this message, tell the developer of the `aurora-api` library that he is the creator of the crutches.");
        };
        this._socket = new isomorphic_ws__WEBPACK_IMPORTED_MODULE_0__(url);
        this._socket.onclose = (event) => this.onClose(event, events?.onClose);
        this._socket.onerror = (event) => this.onError(event, events?.onError);
        this._socket.onmessage = (event) => this.onMessage(event, events?.onMessage);
        this._socket.onopen = (event) => this.onOpen(event, events?.onOpen);
    }
    // reopen?
    close(code, data) {
        this._socket.close(code, data);
    }
    hasConnected() {
        return this._socket.readyState === this._socket.OPEN;
    }
    async ready() {
        if (this.hasConnected())
            return true;
        return await new Promise((resolve) => {
            this._ready = () => {
                resolve(true);
            };
        });
    }
    send(type, data = {}, callback) {
        if (!this.hasConnected())
            return console.error("[AuroraAPI] WebSocket not connected");
        const uuid = (0,uuid__WEBPACK_IMPORTED_MODULE_2__["default"])();
        this._socket.send(JSON.stringify({ type, uuid, data }));
        if (callback === undefined)
            // Promise style
            return new Promise((resolve, reject) => {
                this._messageEmitter.addListener(uuid, (data) => {
                    if (data.code !== undefined)
                        reject(data);
                    else
                        resolve(data);
                });
            });
        // Callback style
        this._messageEmitter.addListener(uuid, (data) => {
            if (data.code !== undefined)
                callback(data);
            else
                callback(null, data);
        });
    }
    /* Events */
    onOpen(event, eventListener) {
        console.log("[AuroraAPI] Connection established");
        this._ready();
        if (eventListener)
            eventListener(event);
    }
    onClose(event, eventListener) {
        if (event.wasClean)
            return console.log("[AuroraAPI] Connection closed");
        if (event.code === 1006)
            console.error("[AuroraAPI] Break connection");
        else
            console.error("[AuroraAPI] Unknown error", event);
        if (eventListener)
            eventListener(event);
    }
    onMessage(event, eventListener) {
        this._messageEmitter.emit(JSON.parse(event.data));
        if (eventListener)
            eventListener(event);
    }
    onError(event, eventListener) {
        console.error("[AuroraAPI] WebSocket error observed:", event);
        if (eventListener)
            eventListener(event);
    }
}


/***/ }),

/***/ "./src/classes/MessageEmitter.ts":
/*!***************************************!*\
  !*** ./src/classes/MessageEmitter.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MessageEmitter)
/* harmony export */ });
class MessageEmitter {
    constructor() {
        this.listeners = new Map();
    }
    addListener(uuid, listener) {
        this.listeners.set(uuid, listener);
    }
    emit(data) {
        if (data.uuid === undefined)
            return console.error("[AuroraAPI] Broken request: ", data);
        if (!this.listeners.has(data.uuid))
            return console.error("[AuroraAPI] Unhandled request: ", data);
        this.listeners.get(data.uuid)(data);
        this.listeners.delete(data.uuid);
    }
}


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuroraAPI": () => (/* reexport safe */ _classes_AuroraAPI__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _classes_AuroraAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/AuroraAPI */ "./src/classes/AuroraAPI.ts");


})();

__webpack_exports__ = __webpack_exports__.AuroraAPI;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDbEJxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMGdCQUEwZ0I7QUFDMWdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU8sd0RBQVE7QUFDZjtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3Qkc7QUFDWTs7QUFFdkM7QUFDQTtBQUNBLCtDQUErQywrQ0FBRyxLQUFLOztBQUV2RDtBQUNBLG1DQUFtQzs7QUFFbkM7QUFDQTs7QUFFQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsU0FBUyx5REFBUztBQUNsQjs7QUFFQSxpRUFBZSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7O0FDdkJjOztBQUUvQjtBQUNBLHFDQUFxQyxzREFBVTtBQUMvQzs7QUFFQSxpRUFBZSxRQUFROzs7Ozs7VUNOdkI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOMEQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9BdXJvcmFBUEkvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL0F1cm9yYUFQSS8uL25vZGVfbW9kdWxlcy9pc29tb3JwaGljLXdzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vQXVyb3JhQVBJLy4vc3JjL2NsYXNzZXMvQXVyb3JhQVBJLnRzIiwid2VicGFjazovL0F1cm9yYUFQSS8uL3NyYy9jbGFzc2VzL01lc3NhZ2VFbWl0dGVyLnRzIiwid2VicGFjazovL0F1cm9yYUFQSS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcmVnZXguanMiLCJ3ZWJwYWNrOi8vQXVyb3JhQVBJLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vQXVyb3JhQVBJLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vQXVyb3JhQVBJLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyIsIndlYnBhY2s6Ly9BdXJvcmFBUEkvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL0F1cm9yYUFQSS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9BdXJvcmFBUEkvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQXVyb3JhQVBJL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9BdXJvcmFBUEkvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9BdXJvcmFBUEkvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9BdXJvcmFBUEkvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9BdXJvcmFBUEkvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQXVyb3JhQVBJXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkF1cm9yYUFQSVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXhvZ2Rlbi93ZWJzb2NrZXQtc3RyZWFtL2Jsb2IvNDhkYzNkZGY5NDNlNWFkYTY2OGMzMWNjZDk0ZTkxODZmMDJmYWZiZC93cy1mYWxsYmFjay5qc1xuXG52YXIgd3MgPSBudWxsXG5cbmlmICh0eXBlb2YgV2ViU29ja2V0ICE9PSAndW5kZWZpbmVkJykge1xuICB3cyA9IFdlYlNvY2tldFxufSBlbHNlIGlmICh0eXBlb2YgTW96V2ViU29ja2V0ICE9PSAndW5kZWZpbmVkJykge1xuICB3cyA9IE1veldlYlNvY2tldFxufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICB3cyA9IGdsb2JhbC5XZWJTb2NrZXQgfHwgZ2xvYmFsLk1veldlYlNvY2tldFxufSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3cyA9IHdpbmRvdy5XZWJTb2NrZXQgfHwgd2luZG93Lk1veldlYlNvY2tldFxufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd3MgPSBzZWxmLldlYlNvY2tldCB8fCBzZWxmLk1veldlYlNvY2tldFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdzXG4iLCJpbXBvcnQgKiBhcyBXZWJTb2NrZXQgZnJvbSBcImlzb21vcnBoaWMtd3NcIlxyXG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tIFwidXVpZFwiXHJcblxyXG5pbXBvcnQgeyBSZXNwb25zZSwgUmVzcG9uc2VFcnJvciB9IGZyb20gXCIuLi90eXBlcy9SZXNwb25zZVwiXHJcbmltcG9ydCBNZXNzYWdlRW1pdHRlciBmcm9tIFwiLi9NZXNzYWdlRW1pdHRlclwiXHJcblxyXG4vLyDQnNC+0LbQvdC+INGA0LDRgdGB0LzQvtGC0YDQtdGC0Ywg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUg0L/RgNC40LLQsNGC0L3Ri9GFINC/0L7Qu9C10Lkg0YfQtdGA0LXQtyAjXHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWNsYXNzLWZpZWxkcy9ibG9iL21hc3Rlci9QUklWQVRFX1NZTlRBWF9GQVEubWRcclxuLy8g0KMg0LLQtdCx0L/QsNC60LAg0LXRgdGC0Ywg0YHQstC+0Lgg0L/RgNC40LrQvtC70Ysg0L3QsCDRjdGC0L7RgiDRgdGH0ZHRgiwg0LzQsSDQt9Cw0LzQtdC90LjRgtGMINC10LPQviDQuiDRh9GR0YDRgtGDPykpXHJcbi8vICsgbG9nZ2VyIHNldHRpbmdzXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXJvcmFBUEkge1xyXG4gICAgcHJpdmF0ZSBfbWVzc2FnZUVtaXR0ZXIgPSBuZXcgTWVzc2FnZUVtaXR0ZXIoKVxyXG4gICAgcHJpdmF0ZSBfc29ja2V0OiBXZWJTb2NrZXRcclxuICAgIHByaXZhdGUgX3JlYWR5ID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXHJcbiAgICAgICAgICAgIFwiW0F1cm9yYUFQSV0gSWYgeW91IHNlZSB0aGlzIG1lc3NhZ2UsIHRlbGwgdGhlIGRldmVsb3BlciBvZiB0aGUgYGF1cm9yYS1hcGlgIGxpYnJhcnkgdGhhdCBoZSBpcyB0aGUgY3JlYXRvciBvZiB0aGUgY3J1dGNoZXMuXCJcclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsXHJcbiAgICAgICAgZXZlbnRzPzoge1xyXG4gICAgICAgICAgICBvbkNsb3NlPzogKGV2ZW50OiBXZWJTb2NrZXQuQ2xvc2VFdmVudCB8IENsb3NlRXZlbnQpID0+IHZvaWRcclxuICAgICAgICAgICAgb25FcnJvcj86IChldmVudDogV2ViU29ja2V0LkVycm9yRXZlbnQgfCBFdmVudCkgPT4gdm9pZFxyXG4gICAgICAgICAgICBvbk1lc3NhZ2U/OiAoZXZlbnQ6IFdlYlNvY2tldC5NZXNzYWdlRXZlbnQgfCBNZXNzYWdlRXZlbnQpID0+IHZvaWRcclxuICAgICAgICAgICAgb25PcGVuPzogKGV2ZW50OiBXZWJTb2NrZXQuT3BlbkV2ZW50IHwgRXZlbnQpID0+IHZvaWRcclxuICAgICAgICB9XHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLl9zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVybClcclxuICAgICAgICB0aGlzLl9zb2NrZXQub25jbG9zZSA9IChldmVudCkgPT4gdGhpcy5vbkNsb3NlKGV2ZW50LCBldmVudHM/Lm9uQ2xvc2UpXHJcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHRoaXMub25FcnJvcihldmVudCwgZXZlbnRzPy5vbkVycm9yKVxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHRoaXMub25NZXNzYWdlKGV2ZW50LCBldmVudHM/Lm9uTWVzc2FnZSlcclxuICAgICAgICB0aGlzLl9zb2NrZXQub25vcGVuID0gKGV2ZW50KSA9PiB0aGlzLm9uT3BlbihldmVudCwgZXZlbnRzPy5vbk9wZW4pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVvcGVuP1xyXG4gICAgcHVibGljIGNsb3NlKGNvZGU/OiBudW1iZXIsIGRhdGE/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zb2NrZXQuY2xvc2UoY29kZSwgZGF0YSlcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb2NrZXQucmVhZHlTdGF0ZSA9PT0gdGhpcy5fc29ja2V0Lk9QRU5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgcmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29ubmVjdGVkKCkpIHJldHVybiB0cnVlXHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlYWR5ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQv9GA0LDQstC60LAg0LfQsNC/0YDQvtGB0LAgKENhbGxiYWNrIHN0eWxlKVxyXG4gICAgICogQHBhcmFtIHR5cGUg0KLQuNC/INGA0LXQutCy0LXRgdGC0LBcclxuICAgICAqIEBwYXJhbSBkYXRhINCU0LDQvdC90YvQtVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrINCk0YPQvdC60YbQuNGPINC+0LHRgNCw0YLQvdC+0LPQviDQstGL0LfQvtCy0LAgKNC+0LHRgNCw0LHQvtGC0LrQsCDQvtGC0LLQtdGC0LApXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZW5kKFxyXG4gICAgICAgIHR5cGU6IHN0cmluZyxcclxuICAgICAgICBkYXRhOiBvYmplY3QgfCB1bmRlZmluZWQsXHJcbiAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogbnVsbCB8IFJlc3BvbnNlRXJyb3IsIGRhdGE/OiBSZXNwb25zZSkgPT4gdm9pZFxyXG4gICAgKTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0L/RgNCw0LLQutCwINC30LDQv9GA0L7RgdCwIChQcm9taXNlIHN0eWxlKVxyXG4gICAgICogQHBhcmFtIHR5cGUg0KLQuNC/INGA0LXQutCy0LXRgdGC0LBcclxuICAgICAqIEBwYXJhbSBkYXRhINCU0LDQvdC90YvQtVxyXG4gICAgICogQHRocm93cyB7UmVzcG9uc2VFcnJvcn1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNlbmQodHlwZTogc3RyaW5nLCBkYXRhPzogb2JqZWN0KTogUHJvbWlzZTxSZXNwb25zZT5cclxuXHJcbiAgICBwdWJsaWMgc2VuZChcclxuICAgICAgICB0eXBlOiBzdHJpbmcsXHJcbiAgICAgICAgZGF0YTogb2JqZWN0ID0ge30sXHJcbiAgICAgICAgY2FsbGJhY2s/OiAoZXJyb3I6IG51bGwgfCBSZXNwb25zZUVycm9yLCBkYXRhPzogUmVzcG9uc2UpID0+IHZvaWRcclxuICAgICk6IHZvaWQgfCBQcm9taXNlPFJlc3BvbnNlPiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0Nvbm5lY3RlZCgpKSByZXR1cm4gY29uc29sZS5lcnJvcihcIltBdXJvcmFBUEldIFdlYlNvY2tldCBub3QgY29ubmVjdGVkXCIpXHJcblxyXG4gICAgICAgIGNvbnN0IHV1aWQgPSB1dWlkdjQoKVxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgdHlwZSwgdXVpZCwgZGF0YSB9KSlcclxuXHJcbiAgICAgICAgaWYgKGNhbGxiYWNrID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIC8vIFByb21pc2Ugc3R5bGVcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VFbWl0dGVyLmFkZExpc3RlbmVyKHV1aWQsIChkYXRhOiBSZXNwb25zZSB8IFJlc3BvbnNlRXJyb3IpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKDxSZXNwb25zZUVycm9yPmRhdGEpLmNvZGUgIT09IHVuZGVmaW5lZCkgcmVqZWN0KGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSByZXNvbHZlKDxSZXNwb25zZT5kYXRhKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAvLyBDYWxsYmFjayBzdHlsZVxyXG4gICAgICAgIHRoaXMuX21lc3NhZ2VFbWl0dGVyLmFkZExpc3RlbmVyKHV1aWQsIChkYXRhOiBSZXNwb25zZSB8IFJlc3BvbnNlRXJyb3IpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKCg8UmVzcG9uc2VFcnJvcj5kYXRhKS5jb2RlICE9PSB1bmRlZmluZWQpIGNhbGxiYWNrKDxSZXNwb25zZUVycm9yPmRhdGEpXHJcbiAgICAgICAgICAgIGVsc2UgY2FsbGJhY2sobnVsbCwgPFJlc3BvbnNlPmRhdGEpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKiBFdmVudHMgKi9cclxuXHJcbiAgICBwcml2YXRlIG9uT3BlbihcclxuICAgICAgICBldmVudDogV2ViU29ja2V0Lk9wZW5FdmVudCB8IEV2ZW50LFxyXG4gICAgICAgIGV2ZW50TGlzdGVuZXI/OiAoZXZlbnQ6IFdlYlNvY2tldC5PcGVuRXZlbnQgfCBFdmVudCkgPT4gdm9pZFxyXG4gICAgKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJbQXVyb3JhQVBJXSBDb25uZWN0aW9uIGVzdGFibGlzaGVkXCIpXHJcbiAgICAgICAgdGhpcy5fcmVhZHkoKVxyXG4gICAgICAgIGlmIChldmVudExpc3RlbmVyKSBldmVudExpc3RlbmVyKGV2ZW50KVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25DbG9zZShcclxuICAgICAgICBldmVudDogV2ViU29ja2V0LkNsb3NlRXZlbnQgfCBDbG9zZUV2ZW50LFxyXG4gICAgICAgIGV2ZW50TGlzdGVuZXI/OiAoZXZlbnQ6IFdlYlNvY2tldC5DbG9zZUV2ZW50IHwgQ2xvc2VFdmVudCkgPT4gdm9pZFxyXG4gICAgKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50Lndhc0NsZWFuKSByZXR1cm4gY29uc29sZS5sb2coXCJbQXVyb3JhQVBJXSBDb25uZWN0aW9uIGNsb3NlZFwiKVxyXG4gICAgICAgIGlmIChldmVudC5jb2RlID09PSAxMDA2KSBjb25zb2xlLmVycm9yKFwiW0F1cm9yYUFQSV0gQnJlYWsgY29ubmVjdGlvblwiKVxyXG4gICAgICAgIGVsc2UgY29uc29sZS5lcnJvcihcIltBdXJvcmFBUEldIFVua25vd24gZXJyb3JcIiwgZXZlbnQpXHJcbiAgICAgICAgaWYgKGV2ZW50TGlzdGVuZXIpIGV2ZW50TGlzdGVuZXIoZXZlbnQpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbk1lc3NhZ2UoXHJcbiAgICAgICAgZXZlbnQ6IFdlYlNvY2tldC5NZXNzYWdlRXZlbnQgfCBNZXNzYWdlRXZlbnQsXHJcbiAgICAgICAgZXZlbnRMaXN0ZW5lcj86IChldmVudDogV2ViU29ja2V0Lk1lc3NhZ2VFdmVudCB8IE1lc3NhZ2VFdmVudCkgPT4gdm9pZFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZUVtaXR0ZXIuZW1pdChKU09OLnBhcnNlKGV2ZW50LmRhdGEpKVxyXG4gICAgICAgIGlmIChldmVudExpc3RlbmVyKSBldmVudExpc3RlbmVyKGV2ZW50KVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvcihcclxuICAgICAgICBldmVudDogV2ViU29ja2V0LkVycm9yRXZlbnQgfCBFdmVudCxcclxuICAgICAgICBldmVudExpc3RlbmVyPzogKGV2ZW50OiBXZWJTb2NrZXQuRXJyb3JFdmVudCB8IEV2ZW50KSA9PiB2b2lkXHJcbiAgICApIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiW0F1cm9yYUFQSV0gV2ViU29ja2V0IGVycm9yIG9ic2VydmVkOlwiLCBldmVudClcclxuICAgICAgICBpZiAoZXZlbnRMaXN0ZW5lcikgZXZlbnRMaXN0ZW5lcihldmVudClcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBSZXNwb25zZSwgUmVzcG9uc2VFcnJvciwgUmVzcG9uc2VFdmVudCB9IGZyb20gXCIuLi90eXBlcy9SZXNwb25zZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2VFbWl0dGVyIHtcbiAgICBsaXN0ZW5lcnM6IE1hcDxzdHJpbmcsIFJlc3BvbnNlRXZlbnQ+ID0gbmV3IE1hcCgpXG5cbiAgICBwdWJsaWMgYWRkTGlzdGVuZXIodXVpZDogc3RyaW5nLCBsaXN0ZW5lcjogUmVzcG9uc2VFdmVudCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQodXVpZCwgbGlzdGVuZXIpXG4gICAgfVxuXG4gICAgcHVibGljIGVtaXQoZGF0YTogUmVzcG9uc2UgfCBSZXNwb25zZUVycm9yKSB7XG4gICAgICAgIGlmIChkYXRhLnV1aWQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJbQXVyb3JhQVBJXSBCcm9rZW4gcmVxdWVzdDogXCIsIGRhdGEpXG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnMuaGFzKGRhdGEudXVpZCkpIHJldHVybiBjb25zb2xlLmVycm9yKFwiW0F1cm9yYUFQSV0gVW5oYW5kbGVkIHJlcXVlc3Q6IFwiLCBkYXRhKVxuXG4gICAgICAgIHRoaXMubGlzdGVuZXJzLmdldChkYXRhLnV1aWQpIShkYXRhKVxuICAgICAgICB0aGlzLmxpc3RlbmVycy5kZWxldGUoZGF0YS51dWlkKVxuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IC9eKD86WzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzEtNV1bMC05YS1mXXszfS1bODlhYl1bMC05YS1mXXszfS1bMC05YS1mXXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwKSQvaTsiLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiBJbiB0aGUgYnJvd3NlciB3ZSB0aGVyZWZvcmVcbi8vIHJlcXVpcmUgdGhlIGNyeXB0byBBUEkgYW5kIGRvIG5vdCBzdXBwb3J0IGJ1aWx0LWluIGZhbGxiYWNrIHRvIGxvd2VyIHF1YWxpdHkgcmFuZG9tIG51bWJlclxuLy8gZ2VuZXJhdG9ycyAobGlrZSBNYXRoLnJhbmRvbSgpKS5cbnZhciBnZXRSYW5kb21WYWx1ZXM7XG52YXIgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIC8vIGxhenkgbG9hZCBzbyB0aGF0IGVudmlyb25tZW50cyB0aGF0IG5lZWQgdG8gcG9seWZpbGwgaGF2ZSBhIGNoYW5jZSB0byBkbyBzb1xuICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0byBpbXBsZW1lbnRhdGlvbi4gQWxzbyxcbiAgICAvLyBmaW5kIHRoZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBjcnlwdG8gKG1zQ3J5cHRvKSBvbiBJRTExLlxuICAgIGdldFJhbmRvbVZhbHVlcyA9IHR5cGVvZiBjcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKGNyeXB0bykgfHwgdHlwZW9mIG1zQ3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09PSAnZnVuY3Rpb24nICYmIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKTtcblxuICAgIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG59IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbnZhciBieXRlVG9IZXggPSBbXTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXgucHVzaCgoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KGFycikge1xuICB2YXIgb2Zmc2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAvLyBOb3RlOiBCZSBjYXJlZnVsIGVkaXRpbmcgdGhpcyBjb2RlISAgSXQncyBiZWVuIHR1bmVkIGZvciBwZXJmb3JtYW5jZVxuICAvLyBhbmQgd29ya3MgaW4gd2F5cyB5b3UgbWF5IG5vdCBleHBlY3QuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQvcHVsbC80MzRcbiAgdmFyIHV1aWQgPSAoYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV0pLnRvTG93ZXJDYXNlKCk7IC8vIENvbnNpc3RlbmN5IGNoZWNrIGZvciB2YWxpZCBVVUlELiAgSWYgdGhpcyB0aHJvd3MsIGl0J3MgbGlrZWx5IGR1ZSB0byBvbmVcbiAgLy8gb2YgdGhlIGZvbGxvd2luZzpcbiAgLy8gLSBPbmUgb3IgbW9yZSBpbnB1dCBhcnJheSB2YWx1ZXMgZG9uJ3QgbWFwIHRvIGEgaGV4IG9jdGV0IChsZWFkaW5nIHRvXG4gIC8vIFwidW5kZWZpbmVkXCIgaW4gdGhlIHV1aWQpXG4gIC8vIC0gSW52YWxpZCBpbnB1dCB2YWx1ZXMgZm9yIHRoZSBSRkMgYHZlcnNpb25gIG9yIGB2YXJpYW50YCBmaWVsZHNcblxuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTsgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7IC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgYnVmW29mZnNldCArIGldID0gcm5kc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZ2lmeShybmRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjQ7IiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh1dWlkKSB7XG4gIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiZXhwb3J0IHsgZGVmYXVsdCBhcyBBdXJvcmFBUEkgfSBmcm9tIFwiLi9jbGFzc2VzL0F1cm9yYUFQSVwiXHJcbmV4cG9ydCB7IFJlcXVlc3QgfSBmcm9tIFwiLi90eXBlcy9SZXF1ZXN0XCJcclxuZXhwb3J0IHsgUmVzcG9uc2UsIFJlc3BvbnNlRXJyb3IsIFJlc3BvbnNlRXZlbnQgfSBmcm9tIFwiLi90eXBlcy9SZXNwb25zZVwiXHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==