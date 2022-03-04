const loaderMap = window['inline-module-loaders'];

const currentScript = document.currentScript || document.querySelector('script');

// https://github.com/WICG/import-maps
const map = {imports: {}, scopes: {}};
const installed = new Set();

function loadContent(url) {
  const request = new XMLHttpRequest();
  request.open('GET', url, false); // `false` makes the request synchronous
  request.send(null);

  if(request.status === 200) {
    return request.responseText;
  }
  throw new Error(request.statusText);
}

function getBlobURL(module) {
  let jsCode = module.innerHTML;
  if(module.hasAttribute('src')) {
    const url = module.getAttribute('src');
    jsCode = loadContent(url);
    module.innerHTML = jsCode;
  }
  let loaders = module.getAttribute('loader');
  if(loaders) {
    loaders = loaders.split(/\s*>\s*/);
    jsCode = loaders.reduce((code, loader) => {
      const {transform, imports} = loaderMap[loader];
      const {code: resolved, map: sourceMap} = transform(code, {/* sourceMap: true, */ filename: module.getAttribute('name') || module.id || 'anonymous'});
      if(sourceMap) code = `${resolved}\n\n//# sourceMappingURL=${createBlob(JSON.stringify(sourceMap))}`;
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
  [...modules].forEach((module) => {
    const {id} = module;
    const name = module.getAttribute('name');
    let file;
    if(id || name) file = getBlobURL(module);
    if(id) {
      importMap[`#${id}`] = file;
    }
    if(name) {
      importMap[name] = file;
    }
  });
  const importMapEl = document.querySelector('script[type="importmap"]');
  if(importMapEl) {
    // map = JSON.parse(mapEl.innerHTML);
    throw new Error('Cannot setup after importmap is set. Use <script type="inline-module-importmap"> instead.');
  }

  const externalMapEl = document.querySelector('script[type="inline-module-importmap"]');
  if(externalMapEl) {
    const externalMap = JSON.parse(externalMapEl.textContent);
    Object.assign(map.imports, externalMap.imports);
    Object.assign(map.scopes, externalMap.scopes);
  }

  Object.assign(map.imports, importMap);

  const mapEl = document.createElement('script');
  mapEl.setAttribute('type', 'importmap');
  mapEl.textContent = JSON.stringify(map);
  currentScript.after(mapEl);

  // eslint-disable-next-line
  for(const url of Object.values(importMap)) {
    if(!installed.has(url)) { // mount
      const el = document.createElement('script');
      el.setAttribute('type', 'module');
      el.setAttribute('src', url);
      currentScript.after(el);
      installed.add(url);
    }
  }
}

if(currentScript.hasAttribute('setup')) {
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