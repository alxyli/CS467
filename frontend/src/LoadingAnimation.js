import React from 'react';
import PropTypes from 'prop-types';
import './animation.css';

export class LoadingAnimation extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return (
        <div class="main_container">
          <div class="container">
            <div class="bar main north"></div>
            <div class="bar diag nw cw"></div>
            <div class="bar diag ne ccw"></div>
            <div class="bar diag sw ccw"></div>
            <div class="bar diag se cw"></div>
          </div>
          <div class="container rotate">
            <div class="bar main north"></div>
            <div class="bar diag nw cw"></div>
            <div class="bar diag ne ccw"></div>
            <div class="bar diag sw ccw"></div>
            <div class="bar diag se cw"></div>
          </div>
        </div>
      );
  }
}