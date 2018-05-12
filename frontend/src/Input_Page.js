import React from 'react';
import PropTypes from 'prop-types';
import { FormContainer } from './FormContainer';
import { Logo } from './Logo';

export class InputPage extends React.Component {
  render() {
      return (
        <div>
          <div>
            <Logo/>
          </div>
          <div>
            <FormContainer onQueryAPI={this.props.onQueryAPI} />
          </div>
        </div>
      );
  }
}

FormContainer.propTypes = {
  onQueryAPI: PropTypes.func.isRequired
};

