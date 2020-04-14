import React, { Component } from 'react';
import classNames from 'classnames';
import * as Tool from './tool';
import styles from "./App.scss";
import { Provider } from 'mobx-react';
import stores from './store/index';
import Loadable from 'react-loadable';

const ComOrient = Loadable({
  loader: () => import('components/base/com-orient'),
  loading: () => null
});
const Header = Loadable({
  loader: () => import ('components/business/header'),
  loading: () => null
});
const Toast = Loadable({
  loader: () => import('components/base/toast'),
  loading: () => null
});
const ComNoContent = Loadable({
  loader: () => import ('components/base/com-nocontent'),
  loading: () => null
});


export default class App extends Component {
  constructor (props) {
    super(props);
    let UA = window.navigator.userAgent.toLowerCase();
    this.state = {
      // app和微信环境才显示header
      isHeaderShow: !Tool.webApp.checkMainApp() && !(UA.match(/MicroMessenger/i) && UA.match(/MicroMessenger/i)[0] === 'micromessenger')
    };
  }
  componentDidMount() {
  }
  render() {
    const { isHeaderShow } = this.state;
    return (
      <Provider {...stores}>
        <div className={classNames(styles.app_container, isHeaderShow ? styles.padding_top : '')}>
          { isHeaderShow && <Header/> }
          {this.props.children}
          <ComOrient/>
          <Toast/>
          <ComNoContent/>
        </div>
      </Provider>
    );
  }
}
