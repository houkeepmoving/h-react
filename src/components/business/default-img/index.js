import React, { Component } from 'react';
import { observer } from 'mobx-react';
import LazyLoad from 'react-lazy-load';

@observer
class DefaultImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      src: this.props.src ? this.props.src : '',
    };
  }

  handleImageLoaded() {
    //加载完毕
  }

  handleImageErrored() {
    //加载失败
    this.setState({
      src: '//x.autoimg.cn/cfw/cfw/common/auto-bendi-dianping/auto-dealer-list-placeholder.png'
    });
  }

  render() {
    let props = this.props;
    let {src} = this.state;
    return (
        <LazyLoad>
          <img
              {...props}
              src={src}
              onLoad={this.handleImageLoaded.bind(this)}
              onError={this.handleImageErrored.bind(this)}
          />
        </LazyLoad>
    );
  }
}
export default DefaultImage;