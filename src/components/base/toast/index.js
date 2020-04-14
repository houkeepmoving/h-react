import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

// import classNames from 'classnames';
import styles from './toast.scss';
// import * as Tool from 'tool';

@inject('Toast')
@observer
export default class Toast extends Component {
  static popTypes = {
    msg: PropTypes.string.isRequired
  }
  constructor (props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }

  render() {
    const { msg } = this.props.Toast.toastState;
    return (
      msg && msg.length && (
        <div className={ styles.toast }>
          <span>{ msg }</span>
        </div>
      )
    );
  }
}