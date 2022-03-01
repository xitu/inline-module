A simple way of loading inline es-modules on modern browser.

```html
  <script type="inline-module" id="foo">
    const foo = 'bar';
    export default {foo};
  </script>
  <script type="module">
    import inlineImport from 'https://unpkg.com/inline-module/index.mjs';
    const foo = (await inlineImport('#foo')).default;
    console.log(foo); // {foo: 'bar'}
  </script>
  ```