import { observable, action, computed } from 'mobx';
import Api from 'api/index';

class Common {
  @observable
  dealerList = {
    myCarList: []
  };


  @action.bound
  getMyCarList(params) {
    Api.getMyCarList(params).then((res) => {
      if (res.returncode === 0) {
        this.dealerList.myCarList = res.result.carInfo;
        return Promise.resolve(res);
      } else {
        return Promise.reject(res);
      }
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

}

export default new Common();