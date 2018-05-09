import React from 'react';
import PropTypes from 'prop-types';

export class Logo extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return (
        <div>
          <link rel="stylesheet" type="text/css" href={this.props.stylePath} />
          <div class="main_container">
            <div class="container">
              <link rel="stylesheet" type="text/css" href={this.props.stylePath} />
              <div class="bar main north"></div>
              <div class="bar diag nw cw"></div>
              <div class="bar diag ne ccw"></div>
              <div class="bar diag sw ccw"></div>
              <div class="bar diag se cw"></div>
            </div>
            <div class="container rotate_cw">
              <div class="bar main north"></div>
              <div class="bar diag nw cw"></div>
              <div class="bar diag ne ccw"></div>
              <div class="bar diag sw ccw"></div>
              <div class="bar diag se cw"></div>
            </div>
            <div class="container rotate_ccw">
              <div class="bar main north"></div>
              <div class="bar diag nw cw"></div>
              <div class="bar diag ne ccw"></div>
              <div class="bar diag sw ccw"></div>
              <div class="bar diag se cw"></div>
            </div>
          </div>
        </div>
      );
  }
}