# ES inline module

A simple way of loading inline es-modules on modern browser.

## Usage

1. Use `inlineImport` to dynamic import inline scripts.

```html
<script type="inline-module" id="foo">
  const foo = 'bar';
  export default {foo};
</script>
<script src="https://unpkg.com/inline-module/index.js"></script>
<script type="module">
  const foo = (await inlineImport('#foo')).default;
  console.log(foo); // {foo: 'bar'}
</script>
  ```

2. Use setup attribute to insert importmap. Then you can use inline module as normal es-modules.

```html
<script type="inline-module" id="foo">
  const foo = 'bar';
  export default {foo};
</script>
<script src="https://unpkg.com/inline-module/index.js" setup></script>
<script type="module">
  import foo from '#foo';
  console.log(foo); // {foo: 'bar'}
</script>
```

**Note：inline-module script must be setup before all module scripts and after all inline-module scripts in this mode.**

3. Use setup and external importmap.

```html
<script type="inline-module-importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>
<script type="inline-module" id="foo">
const foo = 'bar';
export default foo;
</script>
<script src="https://unpkg.com/inline-module/index.js" setup></script>
<script type="module">
  import foo from '#foo'
  console.log(foo);
  import {createApp} from 'vue';
  console.log(createApp);
</script>
```
