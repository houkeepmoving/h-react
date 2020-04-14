import { observable, action, computed } from 'mobx';

class ComNoContent {
  @observable comContentState = {
    content: ''
  };

  @action.bound $comConntent(text) { // bound绑定this
    this.comContentState.content = text;
  }
}

export default new ComNoContent();