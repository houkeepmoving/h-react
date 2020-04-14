import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// import classNames from 'classnames';
import styles from './contact-way.scss';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import * as Common from 'tool/common';
import * as Tool from 'tool';
import * as getUserIdInfo from 'tool/getUserId';

@inject()
@observer
export default class ContactWay extends Component {
  static propTypes = {
    isContactWayWrapperShow: PropTypes.bool.isRequired,
    imUrl: PropTypes.string,
    phoneNum: PropTypes.number,
    phoneNumArr: PropTypes.array,
    pageSource: PropTypes.string,
    orderId: PropTypes.number
  }
  constructor (props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount(){
  }

 // 点击统计事件
  handleTrackCustomEvent(action, objectId) {
    let { userId } = getUserIdInfo.getUserId();
    // eslint-disable-next-line
    trackCustomEvent('yc_page_common_click', {
      'bus': '1',
      'refpage': Tool.getCookie('refpage'),
      'channel': Tool.getCookie('channel'),
      'city': Tool.getCookie('cityId') || 110100,
      'action': action
    }, {
      'userId': userId,
      'objectId': objectId
    });
  }

  onContactWayClose() {
    const { contactWayClose } = this.props;
    contactWayClose && contactWayClose();
  }

  // IM地址跳转
  linkIMUrlHandel() {
    const { imUrl, pageSource, orderId } = this.props;
    let action = pageSource === 'reservationDetail' ? 'tmfy_order_contact_im_click' : '';
    this.handleTrackCustomEvent(action, orderId);

    imUrl && Common.pageJumpHandel(imUrl);
  }

  // 拨打电话
  phoneCallHandel() {
    const { phoneNum, pageSource, orderId } = this.props;
    let action = pageSource === 'reservationDetail' ? 'tmfy_order_contact_telephone_click' : '';
    this.handleTrackCustomEvent(action, orderId);

    if (phoneNum) {
      let phone = JSON.stringify(phoneNum);
      require('jsBridge');
      window.jsBridgeV2.tel({
        tel: phone,
        success: (res) => {
          console.log('拨打电话成功', res);
        },
        fail: (err) => {
          console.log('拨打电话失败', err);
        }
      });
      // window.location.href = `tel:${phoneNum}`;
    }
  }

  render() {
    const { isContactWayWrapperShow, phoneNumArr = [], imUrl } = this.props;
    //默认样式
    const  defaultStyle = {
      transition: 'all .3s ease',
      transform: 'translateX(100%)'
    };
    //过渡样式
    const  transitionStyles = {
      entering: { transform: 'translateY(100%)' },
      entered: { transform: 'translateY(0%)' },
      exiting: { transform: 'translateY(0%)' },
      exited: { transform: 'translateY(100%)' }
    };
    return (
      isContactWayWrapperShow && (<div
        className={styles.contact_way_wrapper}
        onClick={() => this.onContactWayClose()}>
        <Transition
          in={isContactWayWrapperShow}
          appear={true}
          timeout={10}
          unmountOnExit={true}
        >
          {
            state => {
              return (
                <ul
                  className={styles.contact_way_list}
                  style={{...defaultStyle, ...transitionStyles[state]}}
                >
                  {
                    !phoneNumArr.length ? (
                      <>
                        {imUrl && <li onClick={() => this.linkIMUrlHandel()}>在线咨询</li>}
                        <li onClick={() => this.phoneCallHandel()}>电话联系</li>
                      </>
                    ) : phoneNumArr.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  }
                  <li className={styles.cancel_btn}>取消</li>
                </ul>
              );
            }
          }
        </Transition>
      </div>)
    );
  }
}