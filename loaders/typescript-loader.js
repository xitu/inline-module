import { requireBabel } from "./utils";

export default {
  transform(code, options = {}) {
    const {availablePresets, transform} = requireBabel();
    options.filename = `${options.filename}.ts`;
    return transform(code, {
      presets: [availablePresets.typescript],
      ...options
    }); 
  },
  imports: {

  },
};