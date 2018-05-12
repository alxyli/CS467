import React from 'react';
import PropTypes from 'prop-types';

export class Button extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e){
    const userInput = e.target.value;
    this.props.onChange(userInput);
  }

  render() {
    if(this.props.isActive){
      return (
        <input type="text" onChange = {this.handleChange}/>
      );
    } else{
      return(null);
    }

  }
}

TextInput.propTypes = {
  onChange: PropTypes.func.isRequired
};