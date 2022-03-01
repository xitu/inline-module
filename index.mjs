const cache = {};
export default async function inlineImport(moduleID) {
  let blobURL = null;
  if(moduleID in cache) blobURL = cache[moduleID];
  else {
    const module = document.querySelector(`script[type="inline-module"]${moduleID}`);
    if(module) {
      const jsCode = module.innerHTML;
      const blob = new Blob([jsCode], {type: 'text/javascript'});
      const script = document.createElement('script');
      script.setAttribute('type', 'module');
      document.body.appendChild(script);
      blobURL = URL.createObjectURL(blob);
      script.src = blobURL;
      cache[moduleID] = blobURL;
    }
  }
  if(blobURL) {
    const result = await import(blobURL);
    return result;
  }
  return null;
}