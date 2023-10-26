const { atom } = require('recoil');

export const drawAtom = atom({
  key: 'draw-color',
  default: {
    color: '#000000',
    width: 5,
    action: '',
  },
});
