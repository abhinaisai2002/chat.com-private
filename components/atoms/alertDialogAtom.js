const { atom } = require('recoil');

export const alertDialog = atom({
  key: 'alertDialog',
  default: {
    show: false,
    title: '',
    description: '',
    cancelCallBack: null,
    confirmCallBack: null,
  },
});
