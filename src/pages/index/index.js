import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import * as Tool from 'tool';

@inject('Toast', 'ComNoContent', 'Header')
@observer
export default class ServiceReserve extends Component {
  constructor (props){
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.Header.$setTitle('首页');
    Tool.setTitle('首页');
  }

  render() {
    return (
        <div>React Component</div>
    );
  }
}