const { atom } = require('recoil');

export const textDialog = atom({
  key: 'textDialog',
  default: {
    show: false,
    cancelCallBack: null,
    confirmCallBack: null,
  },
});
