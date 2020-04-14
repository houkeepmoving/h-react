import React, { Component } from 'react';

import classNames from 'classnames';
import styles from './loading-more.scss';
import PropTypes from 'prop-types';
// import * as Tool from 'tool';

export default class LoadingMore extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
  }
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { show, text } = this.props;
    return (
      show && (<div className={classNames(styles.loading_more)}>
        {(text === '加载中...') && <i className={styles.icon_loadmore}></i>}
        <span>{ text }</span>
      </div>)
    );
  }
}