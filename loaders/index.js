import reactLoader from './react-loader';
import tsLoader from './typescript-loader';

window['inline-module-loaders'] = window['inline-module-loaders'] || {};

window['inline-module-loaders'].react = reactLoader;
window['inline-module-loaders'].typescript = tsLoader;