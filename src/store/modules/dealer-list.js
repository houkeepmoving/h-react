import { observable, action, computed } from 'mobx';
import Api from 'api/index';

class DealerList {
  @observable
  dealerList = {
    // 当前区域码
    currentArea: {
      code: -1,
      name: ''
    },
    // 当前选中商圈码
    currentZone: {},
    // 当前商圈列表
    currentZoneList: [],
    // 选中的区域
    showArea: '附近',
    filters: null,
    // dealerList: [],
    // 商家列表加载页码
    // pageNum: 1,
    // 是否加载更多列表
    // isGetMore: false,
    // 加载更多参数
    // loadMore: {
     // show: false,
     // text: '加载中...'
    // }
  };

  // 获取列表筛选项
  @action.bound
  getDealerListFilters(params) {
    return Api.getDealerListFilters(params).then((res) => {
      console.log('获取列表筛选项成功');
      console.log(res);
      if (res.returncode === 0) {
        // 获取筛选性
        this.dealerList.filters = res.result;
        if (res.result.area && res.result.area.length > 0) {
          this.dealerList.currentArea = {
            code: res.result.area[0].code,
            name: res.result.area[0].name
          };
          this.dealerList.showArea = res.result.area[0].name;
          this.dealerList.selectArea = res.result.area[0];
          this.dealerList.currentZoneList = res.result.area[0].zones;
        }
      } else {
        return Promise.reject(res);
      }
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  // 获取商家列表
  @action.bound
  getDealerList(params) {
    return Api.getDealerList(params).then((res) => {
      console.log('处理获取商家列表');
      console.log(params);
      if (res.returncode === 0) {
        // 获取筛选性
        this.dealerList.dealerList = res.result.list;
        this.dealerList.isGetMore = res.result.list && res.result.list.length >= 20;
        this.dealerList.loadMore = {
          show: true,
          text: this.dealerList.isGetMore ? '加载中...' : '全部加载完成'
        };
        return Promise.resolve(res);
      } else {
        return Promise.reject(res);
      }
    }).catch((err) => {
      this.clearData();
      return Promise.reject(err);
    });
  }

  // 获取更多商家列表
  @action.bound
  getDealerListMore(params) {
    if (this.dealerList.isGetMore) {
      params.pageNum = this.dealerList.pageNum++;
      console.log('获取更多商家列表');
      console.log(params.pageNum);
      console.log(this.dealerList.pageNum);
      return Api.getDealerList(params).then((res) => {
        if (res.returncode === 0) {
          this.dealerList.dealerList = res.result.list;
          this.dealerList.isGetMore = res.result.list && res.result.list.length >= 20;
          this.dealerList.loadMore = {
            show: true,
            text: this.dealerList.isGetMore ? '加载中...' : '全部加载完成'
          };
          return Promise.resolve(res);
        } else {
          return Promise.reject(res);
        }
      }).catch((err) => {
        this.clearData();
        return Promise.reject(err);
      });
    }
  }

  @action.bound
  clearData() {
    // 这里需要还原初始数据
    this.dealerList.dealerList = [];
    this.dealerList.pageNum = 1;
    this.dealerList.isGetMore = false;
    this.dealerList.loadMore = {
      show: false,
      text: '加载中...'
    };
  }

  @action.bound
  handleChangeArea(area) {
    console.log(area);
    this.dealerList.currentArea = {
      code: area.code,
      name: area.name
    };
    this.dealerList.currentZoneList = area.zones;
  }

  @action.bound
  handleChangeZone(zone) {
    this.dealerList.showArea = zone.id > -1 ? zone.name : this.dealerList.currentArea.name;
    this.dealerList.currentZone = zone;
  }

  @computed
  get count () {
    return '';
    // return this.goodsList.num;
  }
  @computed
  get getList () {
    return '';
    // return this.goodsList.list;
  }
}

export default new DealerList();