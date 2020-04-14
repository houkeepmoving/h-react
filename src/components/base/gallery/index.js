import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'swiper/dist/css/swiper.min.css';
import './gallery.css';

// import * as Tool from 'tool';

export default class Gallery extends Component {
  static propTypes  = {
    show: PropTypes.bool.isRequired,
    list: PropTypes.array.isRequired,
  }
  constructor (props) {
    super(props);
    this.state = {
      activeIndex: 1,
      speed: 150,
      direction: 'horizontal'
    };
  }

  componentDidMount() {

  }

  renderSwiper() {
    let that = this;
    const Swiper = require('swiper');
    window.swiperObj = new Swiper('#gallery', {
      direction: that.state.direction,
      speed: that.state.speed,
      observer: true,
      lazyLoading: true,
      onSlideChangeEnd: function(swiper) {
        // 切换结束时是第几个slide
        that.setState({
          activeIndex: swiper.activeIndex + 1
        });
      }
    });
  }
  // 切换到某个位置
  slideToIndex(index) {
    this.setState({
      activeIndex: index + 1
    });
    window.swiperObj.slideTo(index);
  }

  hideGallery() {
    this.props.onHideGallery && this.props.onHideGallery();
  }

  render() {
    const { activeIndex } = this.state;
    const { show, list } = this.props;

    return (
      show && <div className="swiper-container" id="gallery" onClick={() => this.hideGallery()}>
        <div className="gallery-num">{ `${activeIndex}/${list.length}`}</div>
        <div className="swiper-wrapper">
          {
            list.map((item, index) => {
              return (
                <div className="swiper-slide" key={ index }>
                  <div className="gallery-img-container">
                    <img className={classNames('gallery-img', 'swiper-lazy')} data-src={ item }/>
                  </div>
                  <div className="swiper-lazy-preloader"></div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}