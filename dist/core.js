(()=>{var f=window["inline-module-loaders"],l=document.currentScript||document.querySelector("script"),p={imports:{},scopes:{}},u=new Set;function b(e){let t=new XMLHttpRequest;if(t.open("GET",e,!1),t.send(null),t.status===200)return t.responseText;throw new Error(t.statusText)}function m(e){let t=e.innerHTML;if(e.hasAttribute("src")){let n=e.getAttribute("src");t=b(n),e.innerHTML=t}let r=e.getAttribute("loader");return r&&(r=r.split(/\s*>\s*/),t=r.reduce((n,a)=>{let{transform:s,imports:i}=f[a],{code:o,map:c}=s(n,{sourceMap:!0,filename:e.getAttribute("name")||e.id||"anonymous"});return c?n=`${o}

//# sourceMappingURL=data:application/json;base64,${btoa(JSON.stringify(c))}`:n=o,Object.assign(p.imports,i),n},t)),d(t,"text/javascript")}function d(e,t="text/plain"){let r=new Blob([e],{type:t});return URL.createObjectURL(r)}function y(){let e=document.querySelectorAll('script[type="inline-module"]'),t={};if([...e].forEach(s=>{let{id:i}=s,o=s.getAttribute("name"),c;(i||o)&&(c=m(s)),i&&(t[`#${i}`]=c),o&&(t[o]=c)}),document.querySelector('script[type="importmap"]'))throw new Error('Cannot setup after importmap is set. Use <script type="inline-module-importmap"> instead.');let n=document.querySelector('script[type="inline-module-importmap"]');if(n){let s=JSON.parse(n.textContent);Object.assign(p.imports,s.imports),Object.assign(p.scopes,s.scopes)}Object.assign(p.imports,t);let a=document.createElement("script");a.setAttribute("type","importmap"),a.textContent=JSON.stringify(p),l.after(a);for(let s of Object.values(t))if(!u.has(s)){let i=document.createElement("script");i.setAttribute("type","module"),i.setAttribute("src",s),l.after(i),u.add(s)}}l.hasAttribute("setup")&&y();window.inlineImport=async e=>{let{imports:t}=p,r=null;if(e in t)r=t[e];else{let n;/^#/.test(e)&&(n=document.querySelector(`script[type="inline-module"]${e}`)),n||(n=document.querySelector(`script[type="inline-module"][name="${e}"]`)),n&&(r=m(n),t[e]=r)}return r?await import(r):null};})();
