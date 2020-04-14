import React, { Component } from 'react';

// import PropTypes from 'prop-types';
// import classNames from 'classnames';
import styles from './com-orient.scss';
import * as Tool from 'tool';

export default class ComOrient extends Component {
  static propTypes = {
  }
  constructor (props) {
    super(props);
    this.state = {
      isLandscape: false
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.handleResize();
    }, 300);
    window.addEventListener('resize', this.handleResize, false);
    this.handleOrient();
    window.addEventListener('orientationchange', this.handleOrient);
  }

  handleResize = () => {
    const clientWidth = document.documentElement.clientWidth;
    if (clientWidth >= 1024 && !Tool.checkMobileVersions().pad) {
      this.setState({
        isLandscape: true
      });
    } else {
      this.handleOrient();
    }
  }
  handleOrient = () => {
    if (window.orientation === 90 || window.orientation === -90) {
      if (!Tool.checkMobileVersions().pad) {
        this.setState({
          isLandscape: true
        });
      }
    } else {
      this.setState({
        isLandscape: false
      });
    }
  }

  render() {
    const { isLandscape } = this.state;
    return (
      isLandscape && (<div className={styles.orient_wrapper}>
        <div className={styles.orient_container}>
          <div className={styles.content}>
            <i className={styles.icon}></i>
            <div className={styles.desc}>为了更好的体验，请使用竖屏浏览</div>
          </div>
        </div>
      </div>)
    );
  }
}