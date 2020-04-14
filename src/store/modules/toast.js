import { observable, action, computed } from 'mobx';

class Toast {
  @observable toastState = {
    msg: ''
  };

  @action.bound $toast(msg, time, callBack) { // bound绑定this
    this.toastState.msg = msg;
    window.timeoutId = setTimeout(() => {
      this.toastState.msg = '';
      window.timeoutId = null;
      callBack && callBack();
    }, time || 1500);
  }
}

export default new Toast();