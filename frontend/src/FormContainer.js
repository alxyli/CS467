import React from 'react';
import { SearchTypeInput } from './SearchTypeInput';
import { TextInput, NumberListInput } from './WebsiteInput';

export class FormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      website: '',
      sType: '',
      sLimit: '',
      searchTerm: '',
      advancedOn: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleAdvancedOptions = this.toggleAdvancedOptions.bind(this);
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

  handleSubmit(e) {
    alert('A name was submitted: ' + this.state.value);
    e.preventDefault();
  }

  render() {
    return (
      <form>
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