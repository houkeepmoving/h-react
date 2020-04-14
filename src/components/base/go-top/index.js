import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './go-top.scss';
// import * as Tool from 'tool';

export default class GoTop extends Component {
  static propTypes  = {
    goTop: PropTypes.bool.isRequired
  }
  constructor (props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }

  gotopHandel = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  render() {
    const { goTop } = this.props;
    return (
      <div className={classNames(styles.go_top, {[styles.active]: goTop})} onClick={this.gotopHandel}></div>
    );
  }
}