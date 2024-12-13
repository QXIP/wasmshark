/// <reference lib="webworker" />

// addEventListener('message', ({ data }) => {
//   const response = `worker response to ${data}`;
//   postMessage(response);
// });

const BASE_URL_WIREGASM_LIB = 'wiregasm-lib/';


// load the Wiregasm library and pako
//
// pako is only used to inflate the compressed wasm and data files
// if you are not compressing the wasm and data files, you do not need to include pako
//
// import * from '../wiregasm-lib'
// import wiregasm from BASE_URL_WIREGASM_LIB + "wiregasm.js";
// import pako from BASE_URL_WIREGASM_LIB + "pako.js";

importScripts(
  BASE_URL_WIREGASM_LIB + "wiregasm.js",
  BASE_URL_WIREGASM_LIB + "pako.js"
);


declare const loadWiregasm: any;
declare const pako: any;

let lib: any = null;
let uploadDir: any = null;
let currentSession: any = null;

const inflateRemoteBuffer = async (url: string) => {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return pako.inflate(buf);
};

const fetchPackages = async () => {
  console.log("Fetching packages");
  let [wasm, data] = await Promise.all([
    await inflateRemoteBuffer(
      BASE_URL_WIREGASM_LIB + "wiregasm.wasm.gz"
    ),
    await inflateRemoteBuffer(
      BASE_URL_WIREGASM_LIB + "wiregasm.data.gz"
    ),
  ]);

  return { wasm, data };
};

fetchPackages()
  .then(({ wasm, data }) => {
    loadWiregasm({
      wasmBinary: wasm.buffer,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getPreloadedPackage(name: string, size: any) {
        return data.buffer;
      },
      handleStatus: (type: any, status: any) =>
        postMessage({ type: "status", code: type, status: status }),
      handleError: (error: any) => postMessage({ type: "error", error: error }),
    })
      .then((l: any) => {
        lib = l;

        if (!lib.init()) {
          throw new Error("Failed to initialize Wiregasm");
        }

        uploadDir = lib.getUploadDirectory();

        postMessage({ type: "init" });
      })
      .catch((e: any) => {
        postMessage({ type: "error", error: e });
      });
  })
  .catch((e) => {
    postMessage({ type: "error", error: e });
  });


function treeToObject(vec:any) {
  let outData:any = [];

  if(!!vec?.$$) {
    for (let row = 0; row < vec.size(); row++) {
      const el = vec.get(row);
      if(typeof el === 'object') {
        Object.keys(el).forEach((key) => {
          if(!!el[key]?.$$) {
            el[key] = treeToObject(el[key]);
          }
        })
      }
      outData[row] = el;
    }

  } else {
    if(typeof vec === 'object') {
      outData = vec;
      Object.keys(vec).forEach((key) => {
        if(!!vec[key]?.$$) {
          outData[key] = treeToObject(vec[key]);
        }
      })
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

  console.log('worker', { lib, data });

  if (data.type === "process") {
    const f = data.file;
    const reader = new FileReader();
    reader.addEventListener("load", (event: any) => {
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
      const colsArray = Array.from({ length: cols.size() }, (x, k) => cols.get(k))
      console.log({ cols })
      const frames = framesData.frames;
      console.log(frames)
      const frame1 = currentSession.getFrame(1);
      console.log(frame1)
      console.log('data_sources as object', treeToObject(frame1))
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

      console.log({ table });

      postMessage({
        type: "processed", name: f.name, data: {
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
    console.log(frame1)
    console.log('data_sources as object', treeToObject(frame1))
    postMessage({
      type: "getFrame", data: {

        frame1,

      }
    });
  }
};
