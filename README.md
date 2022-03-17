# ES inline module

A simple way of loading inline es-modules on modern browser.

## Usage

1. Use `inlineImport` to dynamically import inline scripts.

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

## v0.4+ Update

1. react & typescript loader

```html
<script type="inline-module-importmap">
  {
    "imports": {
      "styled-components": "https://unpkg.com/@esm-bundle/styled-components/esm/styled-components.browser.min.js"
    }
  }
</script>
<script type="inline-module" name="hello" loader="react">
  import React from 'react';
  import styled from 'styled-components';
  
  const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
  `;
  
  const name = 'Akira';
  class Hello extends React.Component {
    render() {
      return (
        <Title>
          Hello~~ {name}
        </Title>
      );
    }
  }
  
  export default Hello;
</script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="https://unpkg.com/inline-module/dist/loaders.js"></script>
<script src="https://unpkg.com/inline-module/dist/core.js" setup></script>
<div id="app"></div>
<script type="module">
  import Hello from 'hello';
  import React from 'react';
  import ReactDOM from 'react-dom';
  ReactDOM.render(React.createElement(Hello), document.getElementById('app'));
</script>
```
