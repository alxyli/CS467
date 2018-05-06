import React from 'react';
import PropTypes from 'prop-types';
import './animation.css';

export class LoadingAnimation extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return (
        <div class="loading">
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
        </div>
      );
  }
}