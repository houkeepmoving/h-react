import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import classNames from 'classnames';
import styles from './calendar.scss';
// import PropTypes from 'prop-types';
// import * as Tool from 'tool';
@observer
export default class Calendar extends Component {
  static propTypes = {
  }
  constructor (props) {
    super(props);
    this.state = {
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      startDate: this.props.startDate || this.getDateStr(1), // 明天
      endDate: this.props.endDate || this.getDateStr(30), // 30天之后的日期
      calendarSource: [],
      choseDateStr: this.props.startDate || this.getDateStr(1),
      // { key: '', items: [] }
      calendarRangeItem: function (key, items) {
        this.key = key;
        this.items = items;
      },
      // { date: '', disable: '', dateStr: '' }
      calendarItem: function (date, disable, dateStr) {
        this.date = date;
        this.disable = disable;
        this.dateStr = dateStr;
      }
    };
  }
  componentDidMount() {
    this.initCalendarRange();
  }
  // 组件销毁前移除事件监听
  componentWillUnmount(){

  }


  // 初始化日历数据
  initCalendarRange = () => {
    let calendarSource = [];
    let startTime = this.parseDate(this.state.startDate);
    let endTime = this.parseDate(this.state.endDate);
    let keys = this.generateKeys(startTime, endTime);
    for (let i = 0; i < keys.length; i++) {
      let date = keys[i];
      let daycount = this.getDayCount(date.getFullYear(), date.getMonth());
      let firstWeekDay = date.getDay();
      // eslint-disable-next-line
      let crItem = new this.state.calendarRangeItem(date, []);
      for (let j = 0; j < firstWeekDay; j++) {
        // eslint-disable-next-line
        let item1 = new this.state.calendarItem('', '', true, '');
        crItem.items.push(item1);
      }
      for (let z = 1; z <= daycount; z++) {
        let itemDay = new Date(date.getFullYear(), date.getMonth(), z);
        let disabled = false;
        if (itemDay < startTime || itemDay > endTime) {
          disabled = true;
        }
        let dateStr = this.formateDate(itemDay);
        // eslint-disable-next-line
        let item2 = new this.state.calendarItem(itemDay, disabled, dateStr);
        crItem.items.push(item2);
      }
      calendarSource.push(crItem);
    }
    this.setState({
      calendarSource: calendarSource
    });
  }

  // 获取开始时间 结束时间
  getDateStr = (AddDayCount) => {
    let dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期
    let y = dd.getFullYear();
    let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1); // 获取当前月份的日期，不足10补0
    let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
    return y + '-' + m + '-' + d;
  }

  // 获取当月总天数
  getDayCount = (year, month) => {
    let dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 1) {
      if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
        return 29;
      }
    }
    return dict[month];
  }

  // 日期转化成标准时间
  parseDate = (dateStr) => {
    let timeArray = dateStr.split('-');
    return new Date(timeArray[0], timeArray[1] - 1, timeArray[2]);
  }

  // 根据开始时间 结束时间 获取有多少个月
  generateKeys = (startTime, endTime) => {
    let keys = [];
    let startMonthDate = new Date(startTime.getFullYear(), startTime.getMonth(), 1);
    let endMonthDate = new Date(endTime.getFullYear(), endTime.getMonth(), 1);
    // eslint-disable-next-line
    while (startMonthDate < endMonthDate) {
      let date = new Date(startMonthDate.getFullYear(), startMonthDate.getMonth(), 1);
      keys.push(date);
      startMonthDate.setMonth(startMonthDate.getMonth() + 1);
    }
    keys.push(endMonthDate);
    return keys;
  }

  // 格式化日期 2018-02-01
  formateDate = (dd) => {
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1; // 获取当前月份的日期
    let d = dd.getDate();
    return y + '-' + (m > 9 ? m : '0' + m) + '-' + (d > 9 ? d : '0' + d);
  }


  // 隐藏日历控件
  handleHide = () => {
    setTimeout(() => {
      this.props.hideCalendar();
    }, 200);
  }

  // 确认日期
  confirmDate = () => {
    this.props.confirmDate(this.state.choseDateStr);
  }

  // 选择日期
  selectDate = (date) => {
    if (date.disable !== '' && !date.disable && date.dateStr !== this.state.choseDateStr) {
      this.setState({
        choseDateStr: date.dateStr
      });
    }
  }


  formateKey = (value) => {
    if (value) {
      let y = value.getFullYear();
      let m = value.getMonth() + 1; // 获取当前月份的日期
      return y + '年' + m + '月';
    } else {
      return null;
    }
  }

  formateday = (value) => {
    if (value) {
      return value.getDate();
    } else {
      return null;
    }
  }


  render() {
    const { show } = this.props;
    const { weekdays, calendarSource, choseDateStr } = this.state;
    return (
      show && calendarSource.length > 0 &&  (<div className={ styles.calendar }>
        <div className={ styles.transparent_mask } onClick={ this.handleHide }></div>
        <div className={ classNames(styles.calendar_main, show && calendarSource.length > 0 ? styles.show : '') }>
          <div className={ styles.header }>
            日期选择
          </div>
          <div className={ styles.weekdays }>
            <ul>
              {
                weekdays.map((item) => {
                  return (
                    <li key={ item }>
                      <span>{ item }</span>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div className={ styles.contents }>
            {
              calendarSource.map((item, index) => {
                return (
                  <div className={ styles.picker_inner } key={ index }>
                    <div className={ styles.months }>{ this.formateKey(item.key) }</div>
                    <div className={ styles.days }>
                      <ul>
                        {
                          item.items.map((date, dateIndex) => {
                            return (
                              <li key={ dateIndex }>
                                <span className={ classNames(date.disable ? styles.unable : '', date.dateStr === choseDateStr ? styles.active : '' ) } onClick={ this.selectDate.bind(this, date) }>{ this.formateday(date.date) }</span>
                              </li>
                            );
                          })
                        }
                      </ul>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className={ styles.confirmate_btn_box }>
          <div className={ styles.confirmate_btn } onClick={ this.confirmDate }>确认</div>
        </div>
      </div>)
    );
  }
}