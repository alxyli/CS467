import React from 'react';
import { SearchTypeInput } from './SearchTypeInput';
import { TextInput, NumberListInput } from './WebsiteInput';
import PropTypes from 'prop-types';

export class FormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      website: '',
      sType: 'DFS',
      sLimit: '',
      searchTerm: '',
      advancedOn: false,
      isLoading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleAdvancedOptions = this.toggleAdvancedOptions.bind(this);
    this.verifyInput = this.verifyInput.bind(this);
    this.createQueryData = this.createQueryData.bind(this);
  }

  toggleAdvancedOptions(){
    this.setState({ 
      advancedOn: !this.state.advancedOn
    });
    if(!this.state.advancedOn){
      this.setState({ searchTerm: '' });
    }
  }

  handleChange(e) {
    this.setState({
       [e.target.name]: e.target.value 
      });
  }

  verifyInput(){
    if(this.state.website !== '' && this.state.sType !== '' && this.state.sLimit !== ''){
      if(this.state.advanceOn && this.state.searchTerm !== ''){
        return true;
      }
      return true;
    }
    return false;
  }

  createQueryData(){
    return JSON.stringify({
      url: this.state.website,
      depth: this.state.sLimit,
    })
  }

  handleSubmit(e) {
    console.log(e);
    e.preventDefault();
    console.log(this.verifyInput())
    if(this.verifyInput()){
      this.props.onQueryAPI(this.createQueryData());
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextInput value={this.state.value} name="website" onChange={this.handleChange} 
          label="Website:" isActive={true} />   
        <SearchTypeInput name="sType" onChange={this.handleChange}/>
        <NumberListInput name="sLimit" onChange={this.handleChange} label="Search Limit:"/>
        <TextInput value={this.state.value} name="searchTerm" onChange={this.handleChange} 
          label="Search Term:" isActive={this.state.advancedOn} />   
        <div>
          <input type="checkbox" onChange={this.toggleAdvancedOptions}/>
          <label>Advanced Options</label>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    );
  }
}

FormContainer.propTypes = {
  onQueryAPI: PropTypes.func.isRequired
};