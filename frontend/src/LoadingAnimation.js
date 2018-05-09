import React from 'react';
import PropTypes from 'prop-types';
import { Logo } from './Logo';

export class LoadingAnimation extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return (
        <Logo stylePath="./animation.css" />
      );
  }
}