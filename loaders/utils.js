export function requireBabel() {
  if(typeof Babel === 'undefined') {
    throw new Error('React transform requires babel-standalone(https://unpkg.com/@babel/standalone/babel.min.js).');
  }
  return Babel;
}