import React from 'react';
import PropTypes from 'prop-types';

export class TextInput extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e){
    this.props.onChange(e);
  }

  render() {
    if(this.props.isActive){
      return (
        <div>
          <label>
            {this.props.label}
            <input type="text" name={this.props.name} onChange = {this.handleChange}/>
          </label>
        </div>
      );
    } else{
      return(null);
    }

  }
}

TextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export class NumberListInput extends React.Component {
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
          {this.props.label}
          <input type="number" min="1" name={this.props.name} onChange = {this.handleChange} />
        </label>
      </div>
    );
  }
}

NumberListInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};