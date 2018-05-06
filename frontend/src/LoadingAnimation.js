import React from 'react';
import PropTypes from 'prop-types';
import './animation.css';

export class LoadingAnimation extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return (
        <div class="container rotate">
          <div class="bar main north"></div>
          <div class="bar diag right nw"></div>
          <div class="bar main rotate"></div>
        </div>
      );
  }
}