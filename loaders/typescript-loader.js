import { requireBabel } from "./utils";

export default {
  transform(code, options = {}) {
    const {availablePresets, transform} = requireBabel();
    const {filename} = options;
    if(!/\.ts$/.test(filename)) {
      options.filename = `${options.filename}.ts`;
    }
    return transform(code, {
      presets: [availablePresets.typescript],
      ...options
    }); 
  },
  imports: {

  },
};