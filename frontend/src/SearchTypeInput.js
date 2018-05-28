import React from 'react';
import PropTypes from 'prop-types';
import styles from './css/Form.css';

export class SearchTypeInput extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e){
    this.props.onChange(e);
  }
  
  render() {
    return (
      <div>
        <label>
          Search Type:
        </label>
        <select id="search-types" name={this.props.name} onChange={this.handleChange} 
          className={[styles.formStyling, styles.noError].join(' ')}>
          <option value="dfs" className={styles.formSignIn}>
            Depth First Search
          </option>
          <option value="bfs" className={styles.formSignIn}>
            Breadth First Search
          </option>
        </select>
      </div>
    );
  }
}

SearchTypeInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};