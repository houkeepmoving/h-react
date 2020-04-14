import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './com-nocontent.scss';
// import * as Tool from 'tool';
import * as Common from 'tool/common';

@inject('ComNoContent')
@observer
export default class ComNoContent extends Component {
  static propTypes = {
  }
  constructor (props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }

  handleReload = () => {
    window.location.reload();
  }

  render() {
    const { content } = this.props.ComNoContent.comContentState;
    return (
      content && (
        <section className={classNames('common_nodata_f', styles.common_nodata_f)}>
          <div className={ classNames(styles.nocontent_icon, {[styles.icon_error]: content === '页面溜走了，请稍候重试'}, {[styles.network_error]: content === '当前网络不给力'}) }></div>
          <p>{content}</p>
          {
            (content === '页面溜走了，请稍候重试' || content === '当前网络不给力') && <div>
            <div className={ styles.reload_btn } onClick={this.handleReload}>
              点击刷新
            </div>
          </div>
          }
        </section>
      )
    );
  }
}