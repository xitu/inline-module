const loaderMap = window['inline-module-loaders'];

const currentScript = document.currentScript || document.querySelector('script');

// https://github.com/WICG/import-maps
const map = {imports: {}, scopes: {}};
const installed = new Set();

function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function loadContent(url) {
  const request = new XMLHttpRequest();
  request.open('GET', url, false); // `false` makes the request synchronous
  request.send(null);

  if(request.status === 200) {
    return request.responseText;
  }
  throw new Error(request.statusText);
}

// replace code
function replaceImport(code, map) {
  const importExp = /^(\s*import\s+[\s\S]*?from\s*['"`])([\s\S]*?)(['"`])/img;
  return code.replace(importExp, (a, b, c, d) => {
    const url = map[c];
    if(url) {
      return `${b}${url}${d}`;
    }
    return `${b}${c}${d}`;
  });
}

function getBlobURL(module, replaceImportURL = false, map = {}) {
  let jsCode = module.textContent;
  if(module.hasAttribute('src')) {
    const url = module.getAttribute('src');
    jsCode = loadContent(url);
    module.textContent = jsCode;
  }
  if(replaceImportURL) {
    jsCode = replaceImport(jsCode, map);
  }
  let loaders = module.getAttribute('loader');
  if(loaders) {
    loaders = loaders.split(/\s*>\s*/);
    jsCode = loaders.reduce((code, loader) => {
      const {transform, imports} = loaderMap[loader];
      const {code: resolved, map: sourceMap} = transform(code, {sourceMap: true, filename: module.getAttribute('name') || module.id || 'anonymous'});
      if(sourceMap) code = `${resolved}\n\n//# sourceMappingURL=data:application/json;base64,${toBase64(JSON.stringify(sourceMap))}`;
      else code = resolved;
      Object.assign(map.imports, imports);
      return code;
    }, jsCode);
  }
  return createBlob(jsCode, 'text/javascript');
}

function createBlob(code, type = 'text/plain') {
  const blob = new Blob([code], {type});
  const blobURL = URL.createObjectURL(blob);
  return blobURL;
}

function setup() {
  const modules = document.querySelectorAll('script[type="inline-module"]');
  const importMap = {};
  const loadModules = [];

  const importMapEl = document.querySelector('script[type="importmap"]');
  if(importMapEl) {
    console.warn('Cannot update importmap after  <script type="importmap"> is set. Please use <script type="inline-module-importmap"> instead.');
  }

  [...modules].forEach((module) => {
    const {id} = module;
    const name = module.getAttribute('name');
    const url = getBlobURL(module, !!importMapEl, importMap);
    if(id) {
      importMap[`#${id}`] = url;
      importMap[`//#${id}`] = url; // for some platform only support protocals
    }
    if(name) {
      importMap[name] = url;
      importMap[`//${name}`] = url; // for some platform only support protocals
    }
    loadModules.push(url);
  });

  const externalMapEl = document.querySelector('script[type="inline-module-importmap"]');
  if(externalMapEl) {
    const externalMap = JSON.parse(externalMapEl.textContent);
    Object.assign(map.imports, externalMap.imports);
    Object.assign(map.scopes, externalMap.scopes);
  }

  Object.assign(map.imports, importMap);

  if(!importMapEl) {
    const mapEl = document.createElement('script');
    mapEl.setAttribute('type', 'importmap');
    mapEl.textContent = JSON.stringify(map);
    currentScript.after(mapEl);
  }

  loadModules.forEach((url) => {
    if(!installed.has(url)) { // mount
      const el = document.createElement('script');
      el.async = false;
      el.setAttribute('type', 'module');
      el.setAttribute('src', url);
      currentScript.after(el);
      installed.add(url);
    }
  });
}

if(currentScript.getAttribute('setup') !== 'false') {
  setup();
}

window.inlineImport = async (moduleID) => {
  const {imports} = map;
  let blobURL = null;
  if(moduleID in imports) blobURL = imports[moduleID];
  else {
    let module;
    if(/^#/.test(moduleID)) {
      module = document.querySelector(`script[type="inline-module"]${moduleID}`);
    }
    if(!module) {
      module = document.querySelector(`script[type="inline-module"][name="${moduleID}"]`);
    }
    if(module) {
      blobURL = getBlobURL(module);
      imports[moduleID] = blobURL;
    }
  }
  if(blobURL) {
    const result = await import(blobURL);
    return result;
  }
  return null;
};