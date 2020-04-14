import React, { Component } from 'react';

import PropTypes from 'prop-types';
// import classNames from 'classnames';
import styles from './confirm.scss';
// import * as Tool from 'tool';

export default class Confirm extends Component {
  static propTypes  = {
    isConfirmShow: PropTypes.bool.isRequired,
    leftBtnText: PropTypes.string.isRequired,
    rightBtnText: PropTypes.string.isRequired,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string
  }
  constructor (props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }

  // methods

  leftAction() {
    const { leftBtnAction } = this.props;
    leftBtnAction && leftBtnAction();
  }

  rightAction() {
    const { rightBtnAction } = this.props;
    rightBtnAction && rightBtnAction();
  }

  confirmContainerClick() {
    const { onConfirmClose } = this.props;
    onConfirmClose && onConfirmClose();
  }

  confirmWrapperClick(e) {
    e.stopPropagation();
  }

  render() {
    const { isConfirmShow, leftBtnText, rightBtnText, confirmTitle, confirmContent } = this.props;
    return (
      isConfirmShow &&  (
        <div className={styles.confirm_container} onClick={() => this.confirmContainerClick()}>
          <div className={styles.confirm_wrapper} onClick={(e) => this.confirmWrapperClick(e)}>
            <div className={styles.confirm_title}>{confirmTitle}</div>
            <div className={styles.confirm_content}>{confirmContent}</div>
            <div className={styles.btn_wrapper}>
              <div className={styles.left_btn} onClick={() => this.leftAction()}>{leftBtnText}</div>
              <div className={styles.right_btn} onClick={() => this.rightAction()}>{rightBtnText}</div>
            </div>
          </div>
        </div>
      )
    );
  }
}