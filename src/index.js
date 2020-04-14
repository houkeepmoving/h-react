import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import Root from './router';

// import * as serviceWorker from './serviceWorker';
// import { AppContainer } from 'react-hot-loader';

const render = Component => {
  ReactDOM.render(
    <HashRouter>
      <Component/>
    </HashRouter>,
    document.getElementById('root')
  );
};
render(Root);

// if (module.hot) {
//   module.hot.accept(Root, () => {
//     render(Root); // 重新渲染到 document 里面
//   });
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
