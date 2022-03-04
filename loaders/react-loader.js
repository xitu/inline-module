import { requireBabel } from "./utils";

export default {
  transform(code, options = {}) {
    const {availablePresets, transform} = requireBabel();
    const {filename} = options;
    if(!/\.[tj]sx$/.test(filename)) {
      options.filename = `${filename}.jsx`;
    }
    const presets = [availablePresets.react];
    if(/\.tsx$/.test(filename)) {
      presets.push(availablePresets.typescript);
    }
    return transform(code, {
      presets: [availablePresets.react, availablePresets.typescript],
      ...options
    }); 
  },
  imports: {
    react: 'https://unpkg.com/@esm-bundle/react/esm/react.development.js',
    'react-dom': 'https://unpkg.com/@esm-bundle/react-dom/esm/react-dom.development.js',
    'react-is': 'https://unpkg.com/@esm-bundle/react-is/esm/react-is.development.js',
  },
};