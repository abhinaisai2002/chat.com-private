const { atom } = require('recoil');

export const mouseCursorAtom = atom({
  key: 'mouse-cursor',
  default: 'default',
});
