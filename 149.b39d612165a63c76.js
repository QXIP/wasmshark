/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 5386:
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/***/ ((module) => {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************!*\
  !*** ./src/app/wiregasm.worker.ts ***!
  \************************************/


/// <reference lib="webworker" />
// addEventListener('message', ({ data }) => {
//   const response = `worker response to ${data}`;
//   postMessage(response);
// });
var _asyncToGenerator = (__webpack_require__(/*! ./node_modules/@babel/runtime/helpers/asyncToGenerator.js */ 5386)["default"]);
const BASE_URL_WIREGASM_LIB = 'wiregasm-lib/';
// load the Wiregasm library and pako
//
// pako is only used to inflate the compressed wasm and data files
// if you are not compressing the wasm and data files, you do not need to include pako
//
// import * from '../wiregasm-lib'
// import wiregasm from BASE_URL_WIREGASM_LIB + "wiregasm.js";
// import pako from BASE_URL_WIREGASM_LIB + "pako.js";
importScripts(BASE_URL_WIREGASM_LIB + "wiregasm.js", BASE_URL_WIREGASM_LIB + "pako.js");
let lib = null;
let uploadDir = null;
let currentSession = null;
const inflateRemoteBuffer = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (url) {
    const res = yield fetch(url);
    const buf = yield res.arrayBuffer();
    return pako.inflate(buf);
  });
  return function inflateRemoteBuffer(_x) {
    return _ref.apply(this, arguments);
  };
}();
const fetchPackages = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* () {
    console.log("Fetching packages");
    let [wasm, data] = yield Promise.all([yield inflateRemoteBuffer(BASE_URL_WIREGASM_LIB + "wiregasm.wasm.gz"), yield inflateRemoteBuffer(BASE_URL_WIREGASM_LIB + "wiregasm.data.gz")]);
    return {
      wasm,
      data
    };
  });
  return function fetchPackages() {
    return _ref2.apply(this, arguments);
  };
}();
fetchPackages().then(({
  wasm,
  data
}) => {
  loadWiregasm({
    wasmBinary: wasm.buffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getPreloadedPackage(name, size) {
      return data.buffer;
    },
    handleStatus: (type, status) => postMessage({
      type: "status",
      code: type,
      status: status
    }),
    handleError: error => postMessage({
      type: "error",
      error: error
    })
  }).then(l => {
    lib = l;
    if (!lib.init()) {
      throw new Error("Failed to initialize Wiregasm");
    }
    uploadDir = lib.getUploadDirectory();
    postMessage({
      type: "init"
    });
  }).catch(e => {
    postMessage({
      type: "error",
      error: e
    });
  });
}).catch(e => {
  postMessage({
    type: "error",
    error: e
  });
});
function treeToObject(vec) {
  let outData = [];
  if (!!vec?.$$) {
    for (let row = 0; row < vec.size(); row++) {
      const el = vec.get(row);
      if (typeof el === 'object') {
        Object.keys(el).forEach(key => {
          if (!!el[key]?.$$) {
            el[key] = treeToObject(el[key]);
          }
        });
      }
      outData[row] = el;
    }
  } else {
    if (typeof vec === 'object') {
      outData = vec;
      Object.keys(vec).forEach(key => {
        if (!!vec[key]?.$$) {
          outData[key] = treeToObject(vec[key]);
        }
      });
    }
  }
  return outData;
}
// Event listener to receive messages from the main script
onmessage = function (event) {
  if (!lib) {
    return;
  }
  const data = event.data;
  console.log('worker', {
    lib,
    data
  });
  if (data.type === "process") {
    const f = data.file;
    const reader = new FileReader();
    reader.addEventListener("load", event => {
      console.log("Processing", f.name);
      // write the file to the emscripten filesystem
      const buffer = new Uint8Array(event.target.result);
      const path = `${uploadDir}/${f.name}`;
      lib.FS.writeFile(path, buffer);
      // delete the current session if it exists
      if (currentSession !== null) {
        currentSession.delete();
        currentSession = null;
      }
      // create a new session
      currentSession = new lib.DissectSession(path);
      const res = currentSession.load();
      const framesData = currentSession.getFrames('', 0, 0);
      const cols = lib.getColumns();
      const colsArray = Array.from({
        length: cols.size()
      }, (x, k) => cols.get(k));
      console.log({
        cols
      });
      const frames = framesData.frames;
      console.log(frames);
      const frame1 = currentSession.getFrame(1);
      console.log(frame1);
      console.log('data_sources as object', treeToObject(frame1));
      // console.log('tree as object', treeToObject(frame1.tree))
      const table = [];
      for (let row = 0; row < frames.size(); row++) {
        const element = frames.get(row);
        table[row] = element;
        table[row].colData = [];
        for (let col = 0; col < element.columns.size(); col++) {
          table[row].colData.push(element.columns.get(col));
        }
        delete table[row].columns;
      }
      console.log({
        table
      });
      postMessage({
        type: "processed",
        name: f.name,
        data: {
          res,
          frame1,
          colsArray,
          table
        }
      });
    });
    reader.readAsArrayBuffer(f);
  }
  if (data.type === "getFrame") {
    const frame1 = currentSession.getFrame(data.frameId);
    console.log(frame1);
    console.log('data_sources as object', treeToObject(frame1));
    postMessage({
      type: "getFrame",
      data: {
        frame1
      }
    });
  }
};
})();

/******/ })()
;
//# sourceMappingURL=149.b39d612165a63c76.js.map