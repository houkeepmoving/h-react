import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// import classNames from 'classnames';
import styles from './header.scss';
// import PropTypes from 'prop-types';
// import * as Tool from 'tool';
@inject('Header')
@observer
export default class Header extends Component {
  static propTypes = {
  }
  constructor (props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }

   // 组件销毁前移除事件监听
  componentWillUnmount(){
  }

  goBackHandel = () => {
    window.history.back();
  }

  render() {
    const { title } = this.props.Header.headerTitle;
    return (
      <header className={styles.header}>
        <div className={styles.header_icon}>
          <div className={styles.hd} onClick={this.goBackHandel}>
            <i className={styles.back, styles.icon, styles.icon_back}></i>
          </div>
          <div className={styles.bd}>
            {title}
          </div>
        </div>
      </header>
    );
  }
}