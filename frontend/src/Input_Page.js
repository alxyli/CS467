import React from 'react';
import PropTypes from 'prop-types';
import { FormContainer } from './FormContainer';
import { Logo } from './Logo';
import styles from './css/input.css';


export class InputPage extends React.Component {
  render() {
      return (
        <div className={styles.container}>
          <div className={styles.logo}>
            <Logo/>
          </div>
          <div className={styles.inputForm}>
            <FormContainer onQueryAPI={this.props.onQueryAPI} toResults={this.props.toResults} />
          </div>
        </div>
      );
  }
}

InputPage.propTypes = {
  onQueryAPI: PropTypes.func.isRequired,
  toResults: PropTypes.func.isRequired
};

