function getBlobURL(module) {
  const jsCode = module.innerHTML;
  const blob = new Blob([jsCode], {type: 'text/javascript'});
  const blobURL = URL.createObjectURL(blob);
  return blobURL;
}

const currentScript = document.currentScript || document.querySelector('script');

// https://github.com/WICG/import-maps
const map = {imports: {}, scopes: {}};

function setup() {
  const modules = document.querySelectorAll('script[type="inline-module"]');
  const importMap = {};
  [...modules].forEach((module) => {
    const {id} = module;
    if(id) {
      importMap[`#${id}`] = getBlobURL(module);
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
}

if(currentScript.hasAttribute('setup')) {
  setup();
}

window.inlineImport = async (moduleID) => {
  const {imports} = map;
  let blobURL = null;
  if(moduleID in imports) blobURL = imports[moduleID];
  else {
    const module = document.querySelector(`script[type="inline-module"]${moduleID}`);
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