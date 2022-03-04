import { requireBabel } from "./utils";

export default {
  transform(code, options = {}) {
    const {availablePresets, transform} = requireBabel();
    options.filename = `${options.filename}.jsx`;
    return transform(code, {
      presets: [availablePresets.react],
      ...options
    }); 
  },
  imports: {
    react: 'https://unpkg.com/@esm-bundle/react/esm/react.development.js',
    'react-dom': 'https://unpkg.com/@esm-bundle/react-dom/esm/react-dom.development.js',
    'react-is': 'https://unpkg.com/@esm-bundle/react-is/esm/react-is.development.js',
  },
};