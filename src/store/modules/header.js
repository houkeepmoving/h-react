import { observable, action, computed } from 'mobx';

class Header {
  @observable headerTitle = {
    title: ''
  };

  @action.bound $setTitle(title) { // bound绑定this
    this.headerTitle.title = title;
  }
}

export default new Header();