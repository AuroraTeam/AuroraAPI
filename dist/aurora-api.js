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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class AuroraAPI {
    // можно расмотреть использование приватныйх полей через #
    // https://github.com/tc39/proposal-class-fields/blob/master/PRIVATE_SYNTAX_FAQ.md
    constructor(url) {
        this._messageEmitter = new _MessageEmitter__WEBPACK_IMPORTED_MODULE_1__["default"]();
        this._ready = () => { };
        this._socket = new isomorphic_ws__WEBPACK_IMPORTED_MODULE_0__(url);
        this._socket.onclose = (event) => this.onClose(event);
        this._socket.onerror = (event) => this.onError(event);
        this._socket.onmessage = (event) => this.onMessage(event);
        this._socket.onopen = (event) => {
            this.onOpen(event);
            this._ready();
        };
    }
    // reopen?
    close(code, data) {
        this._socket.close(code, data);
    }
    hasConnected() {
        return this._socket.readyState === this._socket.OPEN;
    }
    ready() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasConnected())
                return true;
            return yield new Promise((resolve) => {
                this._ready = () => {
                    resolve(true);
                };
            });
        });
    }
    send(type, data = {}, callback) {
        if (!this._socket)
            return console.error("WebSocket not connected");
        const obj = {
            type: type,
            uuid: (0,uuid__WEBPACK_IMPORTED_MODULE_2__["default"])(),
            data: data,
        };
        this._socket.send(JSON.stringify(obj));
        if (callback !== undefined) {
            // Callback style
            this._messageEmitter.addListener(obj.uuid, (data) => {
                if (data.code !== undefined)
                    callback(data);
                else
                    callback(null, data);
            });
        }
        else {
            // Promise style
            return new Promise((resolve, reject) => {
                this._messageEmitter.addListener(obj.uuid, (data) => {
                    if (data.code !== undefined)
                        reject(data);
                    else
                        resolve(data);
                });
            });
        }
    }
    /* Events */
    onOpen(_event) {
        console.log("Connection established");
    }
    onClose(event) {
        if (event.wasClean)
            return console.log("Connection closed");
        if (event.code === 1006)
            console.error("Break connection");
        else {
            console.error("Unknown error");
            console.dir(event);
        }
    }
    onMessage(event) {
        this._messageEmitter.emit(JSON.parse(event.data));
    }
    onError(event) {
        console.error("WebSocket error observed:", event);
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
        if (data.uuid !== undefined && this.listeners.has(data.uuid)) {
            ;
            this.listeners.get(data.uuid)(data);
            this.listeners.delete(data.uuid);
        }
        else {
            if (data.code !== undefined)
                console.error(data);
            else
                console.dir(data);
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7Ozs7Ozs7O0FDN0JHO0FBQ1k7O0FBRXZDO0FBQ0E7QUFDQSwrQ0FBK0MsK0NBQUcsS0FBSzs7QUFFdkQ7QUFDQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7O0FBRUEsb0JBQW9CLFFBQVE7QUFDNUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFNBQVMseURBQVM7QUFDbEI7O0FBRUEsaUVBQWUsRUFBRTs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCYzs7QUFFL0I7QUFDQSxxQ0FBcUMsc0RBQVU7QUFDL0M7O0FBRUEsaUVBQWUsUUFBUTs7Ozs7O1VDTnZCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7O0FDTjBEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQXVyb3JhQVBJL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9BdXJvcmFBUEkvLi9ub2RlX21vZHVsZXMvaXNvbW9ycGhpYy13cy9icm93c2VyLmpzIiwid2VicGFjazovL0F1cm9yYUFQSS8uL3NyYy9jbGFzc2VzL0F1cm9yYUFQSS50cyIsIndlYnBhY2s6Ly9BdXJvcmFBUEkvLi9zcmMvY2xhc3Nlcy9NZXNzYWdlRW1pdHRlci50cyIsIndlYnBhY2s6Ly9BdXJvcmFBUEkvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JlZ2V4LmpzIiwid2VicGFjazovL0F1cm9yYUFQSS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcm5nLmpzIiwid2VicGFjazovL0F1cm9yYUFQSS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL0F1cm9yYUFQSS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjQuanMiLCJ3ZWJwYWNrOi8vQXVyb3JhQVBJLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92YWxpZGF0ZS5qcyIsIndlYnBhY2s6Ly9BdXJvcmFBUEkvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQXVyb3JhQVBJL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL0F1cm9yYUFQSS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQXVyb3JhQVBJL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vQXVyb3JhQVBJL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQXVyb3JhQVBJL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQXVyb3JhQVBJLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkF1cm9yYUFQSVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJBdXJvcmFBUElcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vbWF4b2dkZW4vd2Vic29ja2V0LXN0cmVhbS9ibG9iLzQ4ZGMzZGRmOTQzZTVhZGE2NjhjMzFjY2Q5NGU5MTg2ZjAyZmFmYmQvd3MtZmFsbGJhY2suanNcblxudmFyIHdzID0gbnVsbFxuXG5pZiAodHlwZW9mIFdlYlNvY2tldCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd3MgPSBXZWJTb2NrZXRcbn0gZWxzZSBpZiAodHlwZW9mIE1veldlYlNvY2tldCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd3MgPSBNb3pXZWJTb2NrZXRcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd3MgPSBnbG9iYWwuV2ViU29ja2V0IHx8IGdsb2JhbC5Nb3pXZWJTb2NrZXRcbn0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd3MgPSB3aW5kb3cuV2ViU29ja2V0IHx8IHdpbmRvdy5Nb3pXZWJTb2NrZXRcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gIHdzID0gc2VsZi5XZWJTb2NrZXQgfHwgc2VsZi5Nb3pXZWJTb2NrZXRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3c1xuIiwiaW1wb3J0ICogYXMgV2ViU29ja2V0IGZyb20gXCJpc29tb3JwaGljLXdzXCJcclxuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSBcInV1aWRcIlxyXG5cclxuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gXCIuLi90eXBlcy9SZXF1ZXN0XCJcclxuaW1wb3J0IHsgUmVzcG9uc2UsIFJlc3BvbnNlRXJyb3IgfSBmcm9tIFwiLi4vdHlwZXMvUmVzcG9uc2VcIlxyXG5pbXBvcnQgTWVzc2FnZUVtaXR0ZXIgZnJvbSBcIi4vTWVzc2FnZUVtaXR0ZXJcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVyb3JhQVBJIHtcclxuICAgIF9tZXNzYWdlRW1pdHRlcjogTWVzc2FnZUVtaXR0ZXIgPSBuZXcgTWVzc2FnZUVtaXR0ZXIoKVxyXG4gICAgX3NvY2tldDogV2ViU29ja2V0XHJcbiAgICBfcmVhZHkgPSAoKSA9PiB7fVxyXG4gICAgLy8g0LzQvtC20L3QviDRgNCw0YHQvNC+0YLRgNC10YLRjCDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtSDQv9GA0LjQstCw0YLQvdGL0LnRhSDQv9C+0LvQtdC5INGH0LXRgNC10LcgI1xyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtY2xhc3MtZmllbGRzL2Jsb2IvbWFzdGVyL1BSSVZBVEVfU1lOVEFYX0ZBUS5tZFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gbmV3IFdlYlNvY2tldCh1cmwpXHJcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uY2xvc2UgPSAoZXZlbnQpID0+IHRoaXMub25DbG9zZShldmVudClcclxuICAgICAgICB0aGlzLl9zb2NrZXQub25lcnJvciA9IChldmVudCkgPT4gdGhpcy5vbkVycm9yKGV2ZW50KVxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHRoaXMub25NZXNzYWdlKGV2ZW50KVxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbm9wZW4gPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vbk9wZW4oZXZlbnQpXHJcbiAgICAgICAgICAgIHRoaXMuX3JlYWR5KClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVvcGVuP1xyXG4gICAgcHVibGljIGNsb3NlKGNvZGU/OiBudW1iZXIsIGRhdGE/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zb2NrZXQuY2xvc2UoY29kZSwgZGF0YSlcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb2NrZXQucmVhZHlTdGF0ZSA9PT0gdGhpcy5fc29ja2V0Lk9QRU5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgcmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29ubmVjdGVkKCkpIHJldHVybiB0cnVlXHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlYWR5ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQv9GA0LDQstC60LAg0LfQsNC/0YDQvtGB0LAgKENhbGxiYWNrIHN0eWxlKVxyXG4gICAgICogQHBhcmFtIHR5cGUg0KLQuNC/INGA0LXQutCy0LXRgdGC0LBcclxuICAgICAqIEBwYXJhbSBkYXRhINCU0LDQvdC90YvQtVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrINCk0YPQvdC60YbQuNGPINC+0LHRgNCw0YLQvdC+0LPQviDQstGL0LfQvtCy0LAgKNC+0LHRgNCw0LHQvtGC0LrQsCDQvtGC0LLQtdGC0LApXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZW5kKFxyXG4gICAgICAgIHR5cGU6IHN0cmluZyxcclxuICAgICAgICBkYXRhOiBvYmplY3QgfCB1bmRlZmluZWQsXHJcbiAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogbnVsbCB8IFJlc3BvbnNlRXJyb3IsIGRhdGE/OiBSZXNwb25zZSkgPT4gdm9pZFxyXG4gICAgKTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0L/RgNCw0LLQutCwINC30LDQv9GA0L7RgdCwIChQcm9taXNlIHN0eWxlKVxyXG4gICAgICogQHBhcmFtIHR5cGUg0KLQuNC/INGA0LXQutCy0LXRgdGC0LBcclxuICAgICAqIEBwYXJhbSBkYXRhINCU0LDQvdC90YvQtVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2VuZCh0eXBlOiBzdHJpbmcsIGRhdGE/OiBvYmplY3QpOiBQcm9taXNlPFJlc3BvbnNlIHwgUmVzcG9uc2VFcnJvcj5cclxuXHJcbiAgICBwdWJsaWMgc2VuZChcclxuICAgICAgICB0eXBlOiBzdHJpbmcsXHJcbiAgICAgICAgZGF0YTogb2JqZWN0ID0ge30sXHJcbiAgICAgICAgY2FsbGJhY2s/OiAoZXJyb3I6IG51bGwgfCBSZXNwb25zZUVycm9yLCBkYXRhPzogUmVzcG9uc2UpID0+IHZvaWRcclxuICAgICk6IHZvaWQgfCBQcm9taXNlPFJlc3BvbnNlIHwgUmVzcG9uc2VFcnJvcj4ge1xyXG4gICAgICAgIGlmICghdGhpcy5fc29ja2V0KSByZXR1cm4gY29uc29sZS5lcnJvcihcIldlYlNvY2tldCBub3QgY29ubmVjdGVkXCIpXHJcblxyXG4gICAgICAgIGNvbnN0IG9iajogUmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgdXVpZDogdXVpZHY0KCksXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShvYmopKVxyXG4gICAgICAgIGlmIChjYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIENhbGxiYWNrIHN0eWxlXHJcbiAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VFbWl0dGVyLmFkZExpc3RlbmVyKG9iai51dWlkLCAoZGF0YTogUmVzcG9uc2UgfCBSZXNwb25zZUVycm9yKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGRhdGEgYXMgUmVzcG9uc2VFcnJvcikuY29kZSAhPT0gdW5kZWZpbmVkKSBjYWxsYmFjayhkYXRhIGFzIFJlc3BvbnNlRXJyb3IpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGNhbGxiYWNrKG51bGwsIGRhdGEgYXMgUmVzcG9uc2UpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gUHJvbWlzZSBzdHlsZVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZUVtaXR0ZXIuYWRkTGlzdGVuZXIob2JqLnV1aWQsIChkYXRhOiBSZXNwb25zZSB8IFJlc3BvbnNlRXJyb3IpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKGRhdGEgYXMgUmVzcG9uc2VFcnJvcikuY29kZSAhPT0gdW5kZWZpbmVkKSByZWplY3QoZGF0YSBhcyBSZXNwb25zZUVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgcmVzb2x2ZShkYXRhIGFzIFJlc3BvbnNlKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogRXZlbnRzICovXHJcbiAgICBwdWJsaWMgb25PcGVuKF9ldmVudDogV2ViU29ja2V0Lk9wZW5FdmVudCB8IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDb25uZWN0aW9uIGVzdGFibGlzaGVkXCIpXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQ2xvc2UoZXZlbnQ6IFdlYlNvY2tldC5DbG9zZUV2ZW50IHwgQ2xvc2VFdmVudCkge1xyXG4gICAgICAgIGlmIChldmVudC53YXNDbGVhbikgcmV0dXJuIGNvbnNvbGUubG9nKFwiQ29ubmVjdGlvbiBjbG9zZWRcIilcclxuICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gMTAwNikgY29uc29sZS5lcnJvcihcIkJyZWFrIGNvbm5lY3Rpb25cIilcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVua25vd24gZXJyb3JcIilcclxuICAgICAgICAgICAgY29uc29sZS5kaXIoZXZlbnQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk1lc3NhZ2UoZXZlbnQ6IFdlYlNvY2tldC5NZXNzYWdlRXZlbnQgfCBNZXNzYWdlRXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9tZXNzYWdlRW1pdHRlci5lbWl0KEpTT04ucGFyc2UoZXZlbnQuZGF0YSBhcyBzdHJpbmcpKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVycm9yKGV2ZW50OiBXZWJTb2NrZXQuRXJyb3JFdmVudCB8IEV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIldlYlNvY2tldCBlcnJvciBvYnNlcnZlZDpcIiwgZXZlbnQpXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUmVzcG9uc2UsIFJlc3BvbnNlRXJyb3IsIFJlc3BvbnNlRXZlbnQgfSBmcm9tIFwiLi4vdHlwZXMvUmVzcG9uc2VcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlRW1pdHRlciB7XG4gICAgbGlzdGVuZXJzOiBNYXA8c3RyaW5nLCBSZXNwb25zZUV2ZW50PiA9IG5ldyBNYXAoKVxuXG4gICAgYWRkTGlzdGVuZXIodXVpZDogc3RyaW5nLCBsaXN0ZW5lcjogUmVzcG9uc2VFdmVudCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQodXVpZCwgbGlzdGVuZXIpXG4gICAgfVxuXG4gICAgZW1pdChkYXRhOiBSZXNwb25zZSB8IFJlc3BvbnNlRXJyb3IpIHtcbiAgICAgICAgaWYgKGRhdGEudXVpZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMubGlzdGVuZXJzLmhhcyhkYXRhLnV1aWQpKSB7XG4gICAgICAgICAgICA7KHRoaXMubGlzdGVuZXJzLmdldChkYXRhLnV1aWQpIGFzIFJlc3BvbnNlRXZlbnQpKGRhdGEpXG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5kZWxldGUoZGF0YS51dWlkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKChkYXRhIGFzIFJlc3BvbnNlRXJyb3IpLmNvZGUgIT09IHVuZGVmaW5lZCkgY29uc29sZS5lcnJvcihkYXRhKVxuICAgICAgICAgICAgZWxzZSBjb25zb2xlLmRpcihkYXRhKVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgL14oPzpbMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDApJC9pOyIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuIEluIHRoZSBicm93c2VyIHdlIHRoZXJlZm9yZVxuLy8gcmVxdWlyZSB0aGUgY3J5cHRvIEFQSSBhbmQgZG8gbm90IHN1cHBvcnQgYnVpbHQtaW4gZmFsbGJhY2sgdG8gbG93ZXIgcXVhbGl0eSByYW5kb20gbnVtYmVyXG4vLyBnZW5lcmF0b3JzIChsaWtlIE1hdGgucmFuZG9tKCkpLlxudmFyIGdldFJhbmRvbVZhbHVlcztcbnZhciBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJuZygpIHtcbiAgLy8gbGF6eSBsb2FkIHNvIHRoYXQgZW52aXJvbm1lbnRzIHRoYXQgbmVlZCB0byBwb2x5ZmlsbCBoYXZlIGEgY2hhbmNlIHRvIGRvIHNvXG4gIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gZ2V0UmFuZG9tVmFsdWVzIG5lZWRzIHRvIGJlIGludm9rZWQgaW4gYSBjb250ZXh0IHdoZXJlIFwidGhpc1wiIGlzIGEgQ3J5cHRvIGltcGxlbWVudGF0aW9uLiBBbHNvLFxuICAgIC8vIGZpbmQgdGhlIGNvbXBsZXRlIGltcGxlbWVudGF0aW9uIG9mIGNyeXB0byAobXNDcnlwdG8pIG9uIElFMTEuXG4gICAgZ2V0UmFuZG9tVmFsdWVzID0gdHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSB8fCB0eXBlb2YgbXNDcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT09ICdmdW5jdGlvbicgJiYgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQobXNDcnlwdG8pO1xuXG4gICAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIG5vdCBzdXBwb3J0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQjZ2V0cmFuZG9tdmFsdWVzLW5vdC1zdXBwb3J0ZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbn0iLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG4vKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cblxudmFyIGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleC5wdXNoKChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSkpO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkoYXJyKSB7XG4gIHZhciBvZmZzZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICB2YXIgdXVpZCA9IChieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXSkudG9Mb3dlckNhc2UoKTsgLy8gQ29uc2lzdGVuY3kgY2hlY2sgZm9yIHZhbGlkIFVVSUQuICBJZiB0aGlzIHRocm93cywgaXQncyBsaWtlbHkgZHVlIHRvIG9uZVxuICAvLyBvZiB0aGUgZm9sbG93aW5nOlxuICAvLyAtIE9uZSBvciBtb3JlIGlucHV0IGFycmF5IHZhbHVlcyBkb24ndCBtYXAgdG8gYSBoZXggb2N0ZXQgKGxlYWRpbmcgdG9cbiAgLy8gXCJ1bmRlZmluZWRcIiBpbiB0aGUgdXVpZClcbiAgLy8gLSBJbnZhbGlkIGlucHV0IHZhbHVlcyBmb3IgdGhlIFJGQyBgdmVyc2lvbmAgb3IgYHZhcmlhbnRgIGZpZWxkc1xuXG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZ2lmaWVkIFVVSUQgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmluZ2lmeTsiLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpOyAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG5cbiAgcm5kc1s2XSA9IHJuZHNbNl0gJiAweDBmIHwgMHg0MDtcbiAgcm5kc1s4XSA9IHJuZHNbOF0gJiAweDNmIHwgMHg4MDsgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG5cbiAgaWYgKGJ1Zikge1xuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICBidWZbb2Zmc2V0ICsgaV0gPSBybmRzW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICByZXR1cm4gc3RyaW5naWZ5KHJuZHMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2NDsiLCJpbXBvcnQgUkVHRVggZnJvbSAnLi9yZWdleC5qcyc7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHV1aWQpIHtcbiAgcmV0dXJuIHR5cGVvZiB1dWlkID09PSAnc3RyaW5nJyAmJiBSRUdFWC50ZXN0KHV1aWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJleHBvcnQgeyBkZWZhdWx0IGFzIEF1cm9yYUFQSSB9IGZyb20gXCIuL2NsYXNzZXMvQXVyb3JhQVBJXCJcclxuZXhwb3J0IHsgUmVxdWVzdCB9IGZyb20gXCIuL3R5cGVzL1JlcXVlc3RcIlxyXG5leHBvcnQgeyBSZXNwb25zZSwgUmVzcG9uc2VFcnJvciwgUmVzcG9uc2VFdmVudCB9IGZyb20gXCIuL3R5cGVzL1Jlc3BvbnNlXCJcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9